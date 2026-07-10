package stream

import (
	"io"
	"log"
	"os"
	"os/exec"
)

type FFmpeg interface {
	Start() error
	Stop() error
	Stdout() io.Reader
}

type FFmpegClient struct {
	RTSPURL string

	cmd *exec.Cmd

	stdout io.ReadCloser
}

func NewFFmpeg(url string) *FFmpegClient {
	return &FFmpegClient{
		RTSPURL: url,
	}
}

func (f *FFmpegClient) Start() error {

	f.cmd = exec.Command(

		"ffmpeg",

		"-loglevel", "error",

		"-rtsp_transport", "tcp",

		"-fflags", "nobuffer",

		"-flags", "low_delay",

		"-i", f.RTSPURL,

		"-vf", "fps=5,scale=640:360",

		"-pix_fmt", "rgb24",

		"-f", "rawvideo",

		"-",
	)

	log.Printf("RTSP URL: %s", f.RTSPURL)
	log.Printf("FFmpeg command: %v", f.cmd.Args)

	stdout, err := f.cmd.StdoutPipe()
	log.Println("Stdout pipe created")
	if err != nil {
		return err
	}
	f.stdout = stdout

	stderr, err := f.cmd.StderrPipe()
	if err != nil {
		return err
	}

	go func() {
		_, _ = io.Copy(os.Stderr, stderr)
	}()

	log.Println("Starting FFmpeg...")

	if err := f.cmd.Start(); err != nil {
		return err
	}
	log.Println("FFmpeg process started")
	go func() {
		if err := f.cmd.Wait(); err != nil {
			log.Printf("FFmpeg exited: %v", err)
		} else {
			log.Println("FFmpeg exited normally")
		}
	}()

	return nil
}

func (f *FFmpegClient) Stdout() io.Reader {
	return f.stdout
}

func (f *FFmpegClient) Stop() error {

	if f.stdout != nil {
		_ = f.stdout.Close()
	}

	if f.cmd != nil && f.cmd.Process != nil {

		log.Println("Stopping FFmpeg")

		err := f.cmd.Process.Kill()
		if err != nil {
			return err
		}
	}

	return nil
}
