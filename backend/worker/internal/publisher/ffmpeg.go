package publisher

import (
	"camera-surveillance-system/internal/frame"
	"io"
	"log"
	"os"
	"os/exec"
)

type FFmpegPublisher struct {
	RTSPURL string

	cmd *exec.Cmd

	stdin io.WriteCloser
}

func NewFFmpegPublisher(url string) *FFmpegPublisher {
	return &FFmpegPublisher{
		RTSPURL: url,
	}
}

func (p *FFmpegPublisher) Start() error {

	p.cmd = exec.Command(

		"ffmpeg",

		"-loglevel", "error",

		"-f", "rawvideo",

		"-pix_fmt", "rgba",

		"-s", "640x360",

		"-r", "5",

		"-i", "-",

		"-an",

		"-c:v", "libx264",

		"-preset", "ultrafast",

		"-tune", "zerolatency",

		"-pix_fmt", "yuv420p",

		"-f", "rtsp",

		"-rtsp_transport", "tcp",

		p.RTSPURL,
	)

	stdin, err := p.cmd.StdinPipe()
	if err != nil {
		return err
	}

	p.stdin = stdin

	stderr, err := p.cmd.StderrPipe()
	if err != nil {
		return err
	}

	go func() {
		_, _ = io.Copy(os.Stderr, stderr)
	}()

	log.Println("Starting FFmpeg Publisher...")

	if err := p.cmd.Start(); err != nil {
		return err
	}

	go func() {
		if err := p.cmd.Wait(); err != nil {
			log.Printf("Publisher exited: %v", err)
		}
	}()

	return nil
}

func (p *FFmpegPublisher) Stop() error {

	if p.stdin != nil {
		_ = p.stdin.Close()
	}

	if p.cmd != nil && p.cmd.Process != nil {
		return p.cmd.Process.Kill()
	}

	return nil
}

func (p *FFmpegPublisher) Publish(frame *frame.Frame) error {

	_, err := p.stdin.Write(frame.Image.Pix)

	return err
}
