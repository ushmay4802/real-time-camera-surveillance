package stream

import "sync"

type Registry struct {
	mu sync.Mutex

	sessions      map[string]*Session
	cameraCounter map[string]int
}

func NewRegistry() *Registry {
	return &Registry{
		sessions:      make(map[string]*Session),
		cameraCounter: make(map[string]int),
	}
}

func (r *Registry) Exists(cameraID string) bool {

	r.mu.Lock()
	defer r.mu.Unlock()

	_, exists := r.sessions[cameraID]

	return exists
}

func (r *Registry) Acquire(cameraID string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.sessions[cameraID]; exists {
		r.cameraCounter[cameraID]++
		return true
	}

	return false
}

func (r *Registry) Add(session *Session) {

	r.mu.Lock()
	defer r.mu.Unlock()

	r.sessions[session.CameraID] = session
	r.cameraCounter[session.CameraID] = 1
}

func (r *Registry) Get(cameraID string) (*Session, bool) {

	r.mu.Lock()
	defer r.mu.Unlock()

	session, exists := r.sessions[cameraID]

	return session, exists
}

func (r *Registry) Remove(cameraID string) (*Session, bool) {

	r.mu.Lock()
	defer r.mu.Unlock()

	session, exists := r.sessions[cameraID]
	if !exists {
		return nil, false
	}

	if r.cameraCounter[cameraID] > 1 {
		r.cameraCounter[cameraID]--
		return nil, true
	}
	delete(r.cameraCounter, cameraID)
	delete(r.sessions, cameraID)

	return session, true
}

func (r *Registry) Count() int {

	r.mu.Lock()
	defer r.mu.Unlock()

	return len(r.sessions)
}

func (r *Registry) Cleanup(cameraID string) {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.sessions, cameraID)
	delete(r.cameraCounter, cameraID)
}
