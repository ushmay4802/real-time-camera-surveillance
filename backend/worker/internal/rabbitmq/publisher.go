package rabbitmq

import "camera-surveillance-system/internal/models"

const CameraStatusQueue = "camera.status"

type StatusPublisher struct {
	client *Client
}

func NewStatusPublisher(client *Client) *StatusPublisher {
	return &StatusPublisher{
		client: client,
	}
}

func (p *StatusPublisher) PublishCameraStatus(
	event models.CameraStatusEvent,
) error {

	return p.client.Publish(
		CameraStatusQueue,
		event,
	)
}
