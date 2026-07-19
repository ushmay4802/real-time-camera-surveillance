package stream

import (
	"context"
	"log"

	"camera-surveillance-system/internal/detector"
	"camera-surveillance-system/internal/models"
	"camera-surveillance-system/internal/publisher"
)

type Manager struct {
	registry          *Registry
	status            publisher.StatusPublisher
	alert             publisher.AlertPublisher
	MEDIAMTX_RTSP_URL string
}

func NewManager(status publisher.StatusPublisher, alert publisher.AlertPublisher, MEDIAMTX_RTSP_URL string) *Manager {
	return &Manager{
		registry:          NewRegistry(),
		status:            status,
		alert:             alert,
		MEDIAMTX_RTSP_URL: MEDIAMTX_RTSP_URL,
	}
}
func (m *Manager) Start(cameraID, rtspURL, userID string) error {

	if m.registry.Acquire(cameraID) {
		if m.status != nil {
			_ = m.status.PublishCameraStatus(models.CameraStatusEvent{
				CameraID: cameraID,
				Status:   models.CameraStatusLive,
				FPS:      5, // replace later with actual FPS
				UserID:   userID,
			})
		}
		log.Printf("Camera already running")
		return nil
	}

	ctx, cancel := context.WithCancel(context.Background())

	session := &Session{
		CameraID: cameraID,
		RTSPURL:  rtspURL,
		UserID:   userID,

		Context: ctx,
		Cancel:  cancel,

		Decoder: NewFFmpeg(rtspURL),

		Detector: detector.New(),

		Publisher: publisher.NewFFmpegPublisher(
			m.MEDIAMTX_RTSP_URL + "/" + cameraID,
		),
		StatusPublisher: m.status,
		AlertPublisher:  m.alert,

		onDone: func() {
			m.registry.Cleanup(cameraID)
		},
	}

	m.registry.Add(session)

	go session.Run()

	log.Printf("Session created for %s", cameraID)

	return nil
}

func (m *Manager) Stop(cameraID, userID string) error {
	session, exists := m.registry.Remove(cameraID)
	if !exists {
		log.Printf("Camera %s is not running", cameraID)
		return nil
	}

	if session == nil {
		// Camera is still running for other users.
		if m.status != nil {
			_ = m.status.PublishCameraStatus(models.CameraStatusEvent{
				CameraID: cameraID,
				Status:   models.CameraStatusStopped,
				FPS:      0,
				UserID:   userID,
			})
		}
		return nil
	}

	// Last user disconnected.
	session.Cancel()

	if m.status != nil {
		_ = m.status.PublishCameraStatus(models.CameraStatusEvent{
			CameraID: cameraID,
			Status:   models.CameraStatusStopped,
			FPS:      0,
			UserID:   userID,
		})
	}

	log.Printf("Session removed for %s", cameraID)

	return nil
}
func (m *Manager) Get(cameraID string) (*Session, bool) {
	return m.registry.Get(cameraID)
}

func (m *Manager) Count() int {
	return m.registry.Count()
}
