FROM golang:1.25.4

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Download Go modules
COPY worker/go.mod worker/go.sum ./worker/

WORKDIR /app/worker

RUN go mod download

# Copy the entire backend (worker + messaging if needed later)
WORKDIR /app
COPY . .

WORKDIR /app/worker

RUN go build -o worker ./cmd

EXPOSE 8080

CMD ["go", "run", "./cmd"]