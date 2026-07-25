package stream

import (
	"context"
	"log"
	"path"
	"strings"
	"time"

	"camera-surveillance-system/internal/detector"
	"camera-surveillance-system/internal/frame"
	"camera-surveillance-system/internal/mediamtx"
	"camera-surveillance-system/internal/models"
	"camera-surveillance-system/internal/publisher"
)

type Session struct {
	CameraID string
	RTSPURL  string
	UserID   string

	Context context.Context
	Cancel  context.CancelFunc

	Decoder   FFmpeg
	Detector  detector.Detector
	Publisher publisher.Publisher

	StatusPublisher publisher.StatusPublisher
	AlertPublisher  publisher.AlertPublisher

	onDone func()
}

const AlertCooldown = 30 * time.Second

func (s *Session) Run() {

	defer func() {
		_ = s.Decoder.Stop()
		_ = s.Publisher.Stop()
		if s.onDone != nil {
			s.onDone()
		}
	}()

	log.Printf("Session started: %s", s.CameraID)

	if err := s.Decoder.Start(); err != nil {
		log.Printf("Decoder start failed: %v", err)
		return
	}
	log.Printf("RTSP URL: %s", s.RTSPURL)

	if err := s.Publisher.Start(); err != nil {
		log.Printf("Publisher start failed: %v", err)
		return
	}

	// Camera is starting up
	if s.StatusPublisher != nil {
		_ = s.StatusPublisher.PublishCameraStatus(models.CameraStatusEvent{
			CameraID: s.CameraID,
			Status:   models.CameraStatusConnecting,
			FPS:      0,
			UserID:   s.UserID,
		})
	}

	reader := frame.NewReader(s.Decoder.Stdout())

	liveSent := false
	lastAlert := time.Now().Add(-AlertCooldown)
	multiplePeoplePresent := false
	noPersonsPresent := false

	for {

		select {

		case <-s.Context.Done():

			log.Printf("Stopping session %s", s.CameraID)
			return

		default:

			frm, err := reader.Read()
			if err != nil {
				log.Printf("Read failed: %v", err)
				return
			}

			if frm == nil {
				log.Printf("Reader returned nil frame")
				continue
			}

			if frm.Image == nil {
				log.Printf("Reader returned frame with nil image")
				continue
			}

			// processed, detections, err := s.Detector.Process(frm)
			start := time.Now()
			processed, detections, err := s.Detector.Process(frm)
			log.Printf("Inference: %v", time.Since(start))
			if err != nil {
				log.Printf("Detector failed: %v", err)
				continue
			}

			if err := s.Publisher.Publish(processed); err != nil {
				log.Printf("Publish failed: %v", err)
				return
			}

			// First successful frame means MediaMTX is live.
			if !liveSent {

				streamPath := path.Base(strings.TrimRight(s.RTSPURL, "/"))

				if err := mediamtx.WaitForPath(
					s.Context,
					streamPath,
					5*time.Second,
				); err != nil {
					log.Printf("MediaMTX path not ready: %v", err)
					return
				}

				liveSent = true

				if s.StatusPublisher != nil {
					_ = s.StatusPublisher.PublishCameraStatus(models.CameraStatusEvent{
						CameraID: s.CameraID,
						Status:   models.CameraStatusLive,
						FPS:      5,
						UserID:   s.UserID,
					})
				}
			}

			log.Println("Frame published", s.CameraID)

			personCount := len(detections)

			if personCount > 1 {

				if !multiplePeoplePresent &&
					s.AlertPublisher != nil &&
					time.Since(lastAlert) >= AlertCooldown {

					now := time.Now()

					lastAlert = now
					multiplePeoplePresent = true

					first := detections[0]

					if err := s.AlertPublisher.PublishAlert(
						models.AlertEvent{
							CameraID:   s.CameraID,
							Label:      "multiple_persons",
							Confidence: first.Confidence,
							Box: models.BoundingBox{
								X: first.Left,
								Y: first.Top,
								W: first.Right - first.Left,
								H: first.Bottom - first.Top,
							},
							Timestamp:   now.UTC(),
							PersonCount: personCount,
							UserId:      s.UserID,
						},
					); err != nil {
						log.Printf("Failed to publish alert: %v", err)
					}
				}

			} else {
				multiplePeoplePresent = false

				if personCount == 0 &&
					!noPersonsPresent &&
					s.AlertPublisher != nil {

					noPersonsPresent = true

					if err := s.AlertPublisher.PublishAlert(
						models.AlertEvent{
							CameraID:    s.CameraID,
							Label:       "no_persons",
							Timestamp:   time.Now().UTC(),
							PersonCount: 0,
							UserId:      s.UserID,
						},
					); err != nil {
						log.Printf("Failed to publish alert: %v", err)
					}
				}

				if personCount > 0 {
					noPersonsPresent = false
				}
			}

		}
	}
}
