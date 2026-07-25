package detector

import (
	"camera-surveillance-system/internal/frame"
	"image"
	"sync"

	ort "github.com/yalue/onnxruntime_go"
)

const (
	InputName  = "images"
	OutputName = "output0"

	InputWidth    = 640
	InputHeight   = 640
	InputChannels = 3
	OutputBoxes   = 8400
	OutputClasses = 84

	ModelPath = "model/yolov8n.onnx"
)

type YOLODetector struct {
	mu sync.Mutex

	session *ort.AdvancedSession

	inputTensor  *ort.Tensor[float32]
	outputTensor *ort.Tensor[float32]

	inputData  []float32
	outputData []float32

	resized *image.RGBA
}

func (d *YOLODetector) warmup() error {
	for i := range d.inputData {
		d.inputData[i] = 0
	}

	return d.session.Run()
}
func (d *YOLODetector) Init() error {
	if err := InitRuntime(); err != nil {
		return err
	}

	d.resized = image.NewRGBA(image.Rect(0, 0, InputWidth, InputHeight))

	d.inputData = make([]float32, InputChannels*InputWidth*InputHeight)
	d.outputData = make([]float32, OutputBoxes*OutputClasses)

	inputTensor, err := ort.NewTensor(
		ort.NewShape(1, InputChannels, InputHeight, InputWidth),
		d.inputData,
	)
	if err != nil {
		return err
	}

	outputTensor, err := ort.NewTensor(
		ort.NewShape(1, OutputClasses, OutputBoxes),
		d.outputData,
	)
	if err != nil {
		inputTensor.Destroy()
		return err
	}

	session, err := ort.NewAdvancedSession(
		ModelPath,
		[]string{InputName},
		[]string{OutputName},
		[]ort.Value{inputTensor},
		[]ort.Value{outputTensor},
		nil,
	)
	if err != nil {
		inputTensor.Destroy()
		outputTensor.Destroy()
		return err
	}

	d.session = session
	d.inputTensor = inputTensor
	d.outputTensor = outputTensor

	return d.warmup()
}

func (d *YOLODetector) Process(f *frame.Frame) (*frame.Frame, []Detection, error) {
	d.mu.Lock()
	defer d.mu.Unlock()

	d.preprocess(f)

	if err := d.session.Run(); err != nil {
		return nil, nil, err
	}

	bounds := f.Image.Bounds()

	detections := d.postprocess(
		bounds.Dx(),
		bounds.Dy(),
	)
	// log.Printf("Detected %d objects", len(detections))
	_ = detections
	d.draw(f.Image, detections)

	return f, detections, nil
}
func (d *YOLODetector) Close() error {
	if d.session != nil {
		d.session.Destroy()
	}

	if d.inputTensor != nil {
		d.inputTensor.Destroy()
	}

	if d.outputTensor != nil {
		d.outputTensor.Destroy()
	}

	return nil
}
