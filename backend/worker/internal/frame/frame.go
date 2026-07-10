package frame

import "image"

const (
	Width     = 640
	Height    = 360
	Channels  = 3
	FrameSize = Width * Height * Channels
)

type Frame struct {
	Image *image.RGBA
}
