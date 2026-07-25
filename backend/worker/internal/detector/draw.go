package detector

import (
	"image"
	"image/color"
)

var boxColor = color.RGBA{
	R: 255,
	G: 0,
	B: 0,
	A: 255,
}

func (d *YOLODetector) draw(img *image.RGBA, detections []Detection) {
	for _, det := range detections {
		d.drawRectangle(
			img,
			int(det.Left),
			int(det.Top),
			int(det.Right),
			int(det.Bottom),
			boxColor,
		)
	}
}

func (d *YOLODetector) drawRectangle(
	img *image.RGBA,
	left, top, right, bottom int,
	c color.Color,
) {

	bounds := img.Bounds()

	if left < bounds.Min.X {
		left = bounds.Min.X
	}
	if top < bounds.Min.Y {
		top = bounds.Min.Y
	}
	if right > bounds.Max.X-1 {
		right = bounds.Max.X - 1
	}
	if bottom > bounds.Max.Y-1 {
		bottom = bounds.Max.Y - 1
	}

	// Top
	for x := left; x <= right; x++ {
		img.Set(x, top, c)
	}

	// Bottom
	for x := left; x <= right; x++ {
		img.Set(x, bottom, c)
	}

	// Left
	for y := top; y <= bottom; y++ {
		img.Set(left, y, c)
	}

	// Right
	for y := top; y <= bottom; y++ {
		img.Set(right, y, c)
	}
}
