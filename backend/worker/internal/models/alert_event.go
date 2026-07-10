package models

import "time"

type BoundingBox struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	W float64 `json:"w"`
	H float64 `json:"h"`
}

type AlertEvent struct {
	CameraID   string      `json:"cameraId"`
	Label      string      `json:"label"`
	Confidence float32     `json:"confidence"`
	Box        BoundingBox `json:"box"`
	Timestamp  time.Time   `json:"timestamp"`
}
