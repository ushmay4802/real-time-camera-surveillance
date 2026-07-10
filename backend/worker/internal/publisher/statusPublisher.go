package publisher

import "camera-surveillance-system/internal/models"

type StatusPublisher interface {
	PublishCameraStatus(event models.CameraStatusEvent) error
}
