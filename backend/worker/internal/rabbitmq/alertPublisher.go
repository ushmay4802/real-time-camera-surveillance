package rabbitmq

import "camera-surveillance-system/internal/models"

const AlertEventsQueue = "alert.events"

type AlertPublisher struct {
	client *Client
}

func NewAlertPublisher(client *Client) *AlertPublisher {
	return &AlertPublisher{
		client: client,
	}
}

func (p *AlertPublisher) PublishAlert(
	event models.AlertEvent,
) error {

	return p.client.Publish(
		AlertEventsQueue,
		event,
	)
}
