package models

type CameraStatus string

const (
	CameraStatusStopped    CameraStatus = "STOPPED"
	CameraStatusConnecting CameraStatus = "CONNECTING"
	CameraStatusLive       CameraStatus = "LIVE"
	CameraStatusError      CameraStatus = "ERROR"
)

type CameraStatusEvent struct {
	CameraID string       `json:"cameraId"`
	Status   CameraStatus `json:"status"`
	FPS      int          `json:"fps"`
	UserID   string       `json:"userId"`
}
