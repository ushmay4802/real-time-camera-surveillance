package stream

import "sync"

type Registry struct {
	mu sync.Mutex

	sessions map[string]*Session
}

func NewRegistry() *Registry {
	return &Registry{
		sessions: make(map[string]*Session),
	}
}

func (r *Registry) Exists(cameraID string) bool {

	r.mu.Lock()
	defer r.mu.Unlock()

	_, exists := r.sessions[cameraID]

	return exists
}

func (r *Registry) Add(session *Session) {

	r.mu.Lock()
	defer r.mu.Unlock()

	r.sessions[session.CameraID] = session
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

	delete(r.sessions, cameraID)

	return session, true
}

func (r *Registry) Count() int {

	r.mu.Lock()
	defer r.mu.Unlock()

	return len(r.sessions)
}
