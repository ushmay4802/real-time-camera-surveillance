package publisher

import "camera-surveillance-system/internal/models"

type AlertPublisher interface {
	PublishAlert(event models.AlertEvent) error
}
