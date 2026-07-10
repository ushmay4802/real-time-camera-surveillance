package rabbitmq

import (
	"context"
	"encoding/json"
	"fmt"

	"camera-surveillance-system/internal/models"
)

func (c *Client) ConsumeCameraEvents(
	ctx context.Context,
	queue string,
	handler func(models.CameraEvent) error,
) error {

	_, err := c.channel.QueueDeclare(
		queue,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("declare queue: %w", err)
	}

	messages, err := c.channel.Consume(
		queue,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("consume queue: %w", err)
	}

	go func() {
		for {
			select {

			case <-ctx.Done():
				return

			case msg, ok := <-messages:
				if !ok {
					return
				}

				var event models.CameraEvent

				if err := json.Unmarshal(msg.Body, &event); err != nil {
					_ = msg.Nack(false, false)
					continue
				}

				if err := handler(event); err != nil {
					_ = msg.Nack(false, true)
					continue
				}

				_ = msg.Ack(false)
			}
		}
	}()

	return nil
}
