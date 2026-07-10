package stream

import (
	"context"
	"log"

	"camera-surveillance-system/internal/detector"
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
func (m *Manager) Start(cameraID, rtspURL string) error {

	if m.registry.Exists(cameraID) {
		log.Printf("Camera %s already running", cameraID)
		return nil
	}

	ctx, cancel := context.WithCancel(context.Background())

	session := &Session{
		CameraID: cameraID,
		RTSPURL:  rtspURL,

		Context: ctx,
		Cancel:  cancel,

		Decoder: NewFFmpeg(rtspURL),

		Detector: detector.New(),

		Publisher: publisher.NewFFmpegPublisher(
			m.MEDIAMTX_RTSP_URL + "/" + cameraID,
		),
		StatusPublisher: m.status,
		AlertPublisher:  m.alert,

		onDone: func() { m.registry.Remove(cameraID) },
	}

	m.registry.Add(session)

	go session.Run()

	log.Printf("Session created for %s", cameraID)

	return nil
}

func (m *Manager) Stop(cameraID string) error {

	session, exists := m.registry.Remove(cameraID)
	if !exists {
		log.Printf("Camera %s is not running", cameraID)
		return nil
	}

	session.Cancel()

	log.Printf("Session removed for %s", cameraID)

	return nil
}

func (m *Manager) Get(cameraID string) (*Session, bool) {
	return m.registry.Get(cameraID)
}

func (m *Manager) Count() int {
	return m.registry.Count()
}
