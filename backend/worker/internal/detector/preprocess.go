package detector

import (
	"camera-surveillance-system/internal/frame"
	"image"
	"image/draw"
	"log"

	xdraw "golang.org/x/image/draw"
)

func (d *YOLODetector) preprocess(f *frame.Frame) {

	if f == nil {
		return
	}

	if f.Image == nil {
		log.Println("Detector received nil image")
		return
	}
	if d.resized == nil {
		log.Println("d.resized is nil")
		return
	}

	xdraw.ApproxBiLinear.Scale(
		d.resized,
		d.resized.Bounds(),
		f.Image,
		f.Image.Bounds(),
		draw.Src,
		nil,
	)

	d.rgbaToCHW(d.resized)
}

func (d *YOLODetector) rgbaToCHW(img *image.RGBA) {

	pixels := img.Pix

	pixelCount := InputWidth * InputHeight

	rPlane := d.inputData[:pixelCount]
	gPlane := d.inputData[pixelCount : 2*pixelCount]
	bPlane := d.inputData[2*pixelCount : 3*pixelCount]

	j := 0

	for i := 0; i < len(pixels); i += 4 {

		rPlane[j] = float32(pixels[i]) / 255.0
		gPlane[j] = float32(pixels[i+1]) / 255.0
		bPlane[j] = float32(pixels[i+2]) / 255.0

		j++
	}
}
