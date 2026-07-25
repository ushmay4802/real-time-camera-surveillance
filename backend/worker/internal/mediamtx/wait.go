package mediamtx

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

const apiURL = "http://mediamtx:9997/v3/paths/list"

type path struct {
	Name   string `json:"name"`
	Ready  bool   `json:"ready"`
	Online bool   `json:"online"`
}

type pathList struct {
	Items []path `json:"items"`
}

func WaitForPath(ctx context.Context, cameraID string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		ready, err := isPathReady(cameraID)
		if err == nil && ready {
			return nil
		}

		if time.Now().After(deadline) {
			return fmt.Errorf("timeout waiting for MediaMTX path %s", cameraID)
		}

		time.Sleep(100 * time.Millisecond)
	}
}

func isPathReady(cameraID string) (bool, error) {
	resp, err := http.Get(apiURL)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("unexpected status %d", resp.StatusCode)
	}

	var paths pathList

	if err := json.NewDecoder(resp.Body).Decode(&paths); err != nil {
		return false, err
	}

	for _, p := range paths.Items {
		log.Printf("Path: name=%s ready=%v online=%v",
			p.Name,
			p.Ready,
			p.Online,
		)

		if p.Name == cameraID {
			return p.Online && p.Ready, nil
		}
	}
	return false, nil
}
