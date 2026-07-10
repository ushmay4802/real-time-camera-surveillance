package detector

import "camera-surveillance-system/internal/frame"

type Detector interface {
	Process(*frame.Frame) (*frame.Frame, error)
}

type PassThrough struct{}

func New() Detector {
	return &PassThrough{}
}

func (p *PassThrough) Process(f *frame.Frame) (*frame.Frame, error) {
	return f, nil
}
