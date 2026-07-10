package frame

import (
	"image"
	"io"
)

type Reader struct {
	reader io.Reader
}

func NewReader(r io.Reader) *Reader {
	return &Reader{
		reader: r,
	}
}

func (r *Reader) Read() (*Frame, error) {

	buffer := make([]byte, FrameSize)

	_, err := io.ReadFull(
		r.reader,
		buffer,
	)

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

	for i := 0; i < len(buffer); i += 3 {

		rgba[j] = buffer[i]
		rgba[j+1] = buffer[i+1]
		rgba[j+2] = buffer[i+2]
		rgba[j+3] = 255

		j += 4
	}

	return &Frame{
		Image: img,
	}, nil
}
