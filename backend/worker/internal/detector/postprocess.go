package detector

const (
	ConfidenceThreshold = 0.25
	NMSThreshold        = 0.45
	PersonClassID       = 0
)

func (d *YOLODetector) postprocess(imageWidth, imageHeight int) []Detection {
	detections := d.decode(imageWidth, imageHeight)

	return nms(detections, NMSThreshold)
}

func (d *YOLODetector) decode(imageWidth, imageHeight int) []Detection {

	detections := make([]Detection, 0, 100)

	scaleX := float32(imageWidth) / float32(InputWidth)
	scaleY := float32(imageHeight) / float32(InputHeight)

	for box := 0; box < OutputBoxes; box++ {

		cx := d.outputData[0*OutputBoxes+box]
		cy := d.outputData[1*OutputBoxes+box]
		w := d.outputData[2*OutputBoxes+box]
		h := d.outputData[3*OutputBoxes+box]

		bestScore := float32(0)
		bestClass := -1

		for class := 4; class < OutputClasses; class++ {

			score := d.outputData[class*OutputBoxes+box]

			if score > bestScore {
				bestScore = score
				bestClass = class - 4
			}
		}
		if bestClass != PersonClassID {
			continue
		}

		if bestScore < ConfidenceThreshold {
			continue
		}

		left := (cx - w/2) * scaleX
		top := (cy - h/2) * scaleY
		right := (cx + w/2) * scaleX
		bottom := (cy + h/2) * scaleY

		if left < 0 {
			left = 0
		}
		if top < 0 {
			top = 0
		}
		if right > float32(imageWidth) {
			right = float32(imageWidth)
		}
		if bottom > float32(imageHeight) {
			bottom = float32(imageHeight)
		}

		detections = append(detections, Detection{
			ClassID:    bestClass,
			Confidence: bestScore,
			Left:       left,
			Top:        top,
			Right:      right,
			Bottom:     bottom,
		})
	}

	return detections
}
