package detector

import (
	"sync"

	ort "github.com/yalue/onnxruntime_go"
)

const RuntimePath = "model/libonnxruntime.so.1.27.0"

var (
	initOnce sync.Once
	initErr  error
)

func InitRuntime() error {
	initOnce.Do(func() {
		ort.SetSharedLibraryPath(RuntimePath)
		initErr = ort.InitializeEnvironment()
	})

	return initErr
}

func DestroyRuntime() error {
	return ort.DestroyEnvironment()
}
