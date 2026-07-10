package stream

import (
	"context"
	"log"
	"math/rand"
	"time"

	"camera-surveillance-system/internal/detector"
	"camera-surveillance-system/internal/frame"
	"camera-surveillance-system/internal/models"
	"camera-surveillance-system/internal/publisher"
)

type Session struct {
	CameraID string
	RTSPURL  string

	Context context.Context
	Cancel  context.CancelFunc

	Decoder   FFmpeg
	Detector  detector.Detector
	Publisher publisher.Publisher

	StatusPublisher publisher.StatusPublisher
	AlertPublisher  publisher.AlertPublisher

	onDone func()
}

func (s *Session) Run() {

	defer func() {
		_ = s.Decoder.Stop()
		_ = s.Publisher.Stop()

		if s.StatusPublisher != nil {
			_ = s.StatusPublisher.PublishCameraStatus(models.CameraStatusEvent{
				CameraID: s.CameraID,
				Status:   models.CameraStatusStopped,
				FPS:      0,
			})
		}

		if s.onDone != nil {
			s.onDone()
		}
	}()

	log.Printf("Session started: %s", s.CameraID)

	if err := s.Decoder.Start(); err != nil {
		log.Printf("Decoder start failed: %v", err)
		return
	}

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
		})
	}

	reader := frame.NewReader(s.Decoder.Stdout())

	liveSent := false
	lastAlert := time.Now().Add(-30 * time.Second)

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

			processed, err := s.Detector.Process(frm)
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
				liveSent = true

				if s.StatusPublisher != nil {
					_ = s.StatusPublisher.PublishCameraStatus(models.CameraStatusEvent{
						CameraID: s.CameraID,
						Status:   models.CameraStatusLive,
						FPS:      5, // replace later with actual FPS
					})
				}
			}

			log.Println("Frame published", lastAlert)

			if s.AlertPublisher != nil &&
				time.Since(lastAlert) >= 30*time.Second {

				lastAlert = time.Now()

				_ = s.AlertPublisher.PublishAlert(
					models.AlertEvent{
						CameraID: s.CameraID,
						Label:    "person",

						Confidence: 0.90 + rand.Float32()*0.09,

						Box: models.BoundingBox{
							X: 120,
							Y: 80,
							W: 180,
							H: 250,
						},

						Timestamp: time.Now().UTC(),
					},
				)
			}

		}
	}
}
