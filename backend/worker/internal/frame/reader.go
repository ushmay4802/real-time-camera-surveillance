package frame

import (
	"image"
	"io"
)

const (
	Width     = 640
	Height    = 320
	Channels  = 3
	FrameSize = Width * Height * Channels
)

type Reader struct {
	reader io.Reader
	buffer []byte
}

func NewReader(r io.Reader) *Reader {
	return &Reader{
		reader: r,
		buffer: make([]byte, FrameSize),
	}
}

func (r *Reader) Read() (*Frame, error) {

	_, err := io.ReadFull(r.reader, r.buffer)
	if err != nil {
		return nil, err
	}

	img := image.NewRGBA(
		image.Rect(
			0,
			0,
			Width,
			Height,
		),
	)

	rgba := img.Pix

	j := 0

	for i := 0; i < len(r.buffer); i += 3 {

		rgba[j] = r.buffer[i]
		rgba[j+1] = r.buffer[i+1]
		rgba[j+2] = r.buffer[i+2]
		rgba[j+3] = 255

		j += 4
	}

	return &Frame{
		Image: img,
	}, nil
}
