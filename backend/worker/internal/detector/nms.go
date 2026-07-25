package detector

import "sort"

func nms(detections []Detection, threshold float32) []Detection {

	if len(detections) == 0 {
		return detections
	}

	sort.Slice(detections, func(i, j int) bool {
		return detections[i].Confidence > detections[j].Confidence
	})

	keep := make([]Detection, 0, len(detections))
	suppressed := make([]bool, len(detections))

	for i := 0; i < len(detections); i++ {

		if suppressed[i] {
			continue
		}

		keep = append(keep, detections[i])

		for j := i + 1; j < len(detections); j++ {

			if suppressed[j] {
				continue
			}

			// Only suppress boxes of the same class.
			if detections[i].ClassID != detections[j].ClassID {
				continue
			}

			if iou(detections[i], detections[j]) > threshold {
				suppressed[j] = true
			}
		}
	}

	return keep
}

func iou(a, b Detection) float32 {

	left := max(a.Left, b.Left)
	top := max(a.Top, b.Top)
	right := min(a.Right, b.Right)
	bottom := min(a.Bottom, b.Bottom)

	if right <= left || bottom <= top {
		return 0
	}

	intersection := (right - left) * (bottom - top)

	areaA := (a.Right - a.Left) * (a.Bottom - a.Top)
	areaB := (b.Right - b.Left) * (b.Bottom - b.Top)

	union := areaA + areaB - intersection

	if union <= 0 {
		return 0
	}

	return intersection / union
}

func max(a, b float32) float32 {
	if a > b {
		return a
	}
	return b
}

func min(a, b float32) float32 {
	if a < b {
		return a
	}
	return b
}
