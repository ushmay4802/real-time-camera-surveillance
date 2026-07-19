package worker

import (
	"context"
	"log"

	"camera-surveillance-system/internal/config"
	"camera-surveillance-system/internal/models"
	"camera-surveillance-system/internal/rabbitmq"
	"camera-surveillance-system/internal/stream"
)

const CameraEventsQueue = "camera.events"

type Worker struct {
	config   *config.Config
	rabbitMQ *rabbitmq.Client
	manager  *stream.Manager
	ctx      context.Context
}

func New(cfg *config.Config) (*Worker, error) {

	rmq, err := rabbitmq.New(cfg)
	if err != nil {
		return nil, err
	}
	statusPublisher := rabbitmq.NewStatusPublisher(rmq)
	alertPublisher := rabbitmq.NewAlertPublisher(rmq)

	return &Worker{
		config:   cfg,
		rabbitMQ: rmq,
		manager:  stream.NewManager(statusPublisher, alertPublisher, cfg.MediaMTXRTSPURL),
		ctx:      context.Background(),
	}, nil

}

func (w *Worker) Start() error {

	err := w.rabbitMQ.ConsumeCameraEvents(

		w.ctx,

		CameraEventsQueue,

		func(event models.CameraEvent) error {

			switch event.Action {

			case models.CameraStart:

				log.Printf("Starting stream %s", event.CameraID)

				return w.manager.Start(
					event.CameraID,
					event.RTSPURL,
					event.UserID,
				)

			case models.CameraStop:

				log.Printf("Stopping stream %s", event.CameraID)

				return w.manager.Stop(
					event.CameraID,
					event.UserID,
				)

			default:

				log.Printf("Unknown action %s", event.Action)

				return nil
			}

		},
	)

	if err != nil {
		return err
	}

	log.Println("✅ Worker Started")

	select {}

}

func (w *Worker) Stop() error {
	return w.rabbitMQ.Close()
}
