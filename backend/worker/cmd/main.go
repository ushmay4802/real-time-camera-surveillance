package main

import (
	"log"

	"camera-surveillance-system/internal/config"
	"camera-surveillance-system/internal/detector"
	"camera-surveillance-system/internal/worker"
)

func main() {

	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	if err := detector.InitRuntime(); err != nil {
		log.Fatal(err)
	}
	defer detector.DestroyRuntime()

	w, err := worker.New(cfg)
	if err != nil {
		log.Fatal(err)
	}

	if err := w.Start(); err != nil {
		log.Fatal(err)
	}

	select {}

}
