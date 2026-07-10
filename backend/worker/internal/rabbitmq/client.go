package rabbitmq

import (
	"context"
	"encoding/json"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"

	"camera-surveillance-system/internal/config"
)

type Client struct {
	connection *amqp.Connection
	channel    *amqp.Channel
}

func New(cfg *config.Config) (*Client, error) {

	conn, err := amqp.Dial(cfg.RabbitMQURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {

		_ = conn.Close()

		return nil, fmt.Errorf("failed to create channel: %w", err)

	}

	return &Client{

		connection: conn,

		channel: ch,
	}, nil

}

func (c *Client) Channel() *amqp.Channel {
	return c.channel
}

func (c *Client) Close() error {

	if err := c.channel.Close(); err != nil {
		return err
	}

	return c.connection.Close()

}

func (c *Client) Publish(
	queue string,
	message any,
) error {

	body, err := json.Marshal(message)
	if err != nil {
		return err
	}

	_, err = c.channel.QueueDeclare(
		queue,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	return c.channel.PublishWithContext(
		context.Background(),
		"",
		queue,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}
