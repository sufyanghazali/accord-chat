class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
    }
}