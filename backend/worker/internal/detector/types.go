package detector

type Detection struct {
	ClassID    int
	Confidence float32

	Left   float32
	Top    float32
	Right  float32
	Bottom float32
}
