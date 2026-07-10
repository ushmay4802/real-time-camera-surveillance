package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	RabbitMQURL     string
	ModelPath       string
	OnnxRuntimeLib  string
	MediaMTXRTSPURL string
}

func Load() (*Config, error) {

	_ = godotenv.Load()

	cfg := &Config{
		RabbitMQURL:     os.Getenv("RABBITMQ_URL"),
		ModelPath:       os.Getenv("MODEL_PATH"),
		OnnxRuntimeLib:  os.Getenv("ONNXRUNTIME_LIB"),
		MediaMTXRTSPURL: os.Getenv("MEDIAMTX_RTSP_URL"),
	}

	if cfg.ModelPath == "" {
		cfg.ModelPath = "models/yolov8n.onnx"
	}
	if cfg.OnnxRuntimeLib == "" {
		cfg.OnnxRuntimeLib = "/Users/ushmay/Downloads/onnxruntime-osx-arm64-1.22.0/lib/libonnxruntime.dylib"
	}

	if cfg.RabbitMQURL == "" {
		return nil, fmt.Errorf("RABBITMQ_URL is required")
	}

	return cfg, nil
}
