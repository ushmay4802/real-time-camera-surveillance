package detector

import "camera-surveillance-system/internal/frame"

type Detector interface {
	Init() error
	Process(*frame.Frame) (*frame.Frame, []Detection, error)
	Close() error
}

func New() Detector {
	return &YOLODetector{}
}
