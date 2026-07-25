package models

import "time"

type BoundingBox struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
	W float32 `json:"w"`
	H float32 `json:"h"`
}

type AlertEvent struct {
	CameraID    string      `json:"cameraId"`
	Label       string      `json:"label"`
	Confidence  float32     `json:"confidence"`
	Box         BoundingBox `json:"box"`
	Timestamp   time.Time   `json:"timestamp"`
	PersonCount int         `json:"personCount"`
	UserId      string      `json:"userId"`
}
