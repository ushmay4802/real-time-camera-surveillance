package publisher

import "camera-surveillance-system/internal/frame"

type Publisher interface {
	Start() error
	Publish(*frame.Frame) error
	Stop() error
}
