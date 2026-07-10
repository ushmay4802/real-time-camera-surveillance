package models

type CameraAction string

const (
	CameraStart CameraAction = "start"

	CameraStop CameraAction = "stop"
)

type CameraEvent struct {
	Action CameraAction `json:"action"`

	CameraID string `json:"cameraId"`

	RTSPURL string `json:"rtspUrl,omitempty"`
}
