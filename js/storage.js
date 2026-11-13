/**
 * Speakly AI - LocalStorage helpers (demo only)
 */
const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`speakly_${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`speakly_${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(`speakly_${key}`);
  },

  // User session
  getUser() {
    return this.get('user');
  },

  setUser(user) {
    return this.set('user', user);
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  logout() {
    this.remove('user');
  },

  // Sessions history
  getSessions() {
    return this.get('sessions', []);
  },

  addSession(session) {
    const list = this.getSessions();
    list.unshift({ ...session, id: Date.now().toString(), date: new Date().toISOString() });
    this.set('sessions', list.slice(0, 100));
    return list[0];
  },

  // Vocabulary
  getVocab() {
    return this.get('vocab', []);
  },

  setVocab(list) {
    return this.set('vocab', list);
  },

  // Settings
  getSettings() {
    return this.get('settings', {
      theme: 'dark',
      lang: 'en',
      dailyGoal: 15,
      notifications: true
    });
  },

  setSettings(settings) {
    return this.set('settings', { ...this.getSettings(), ...settings });
  },

  // Demo users for admin
  getDemoUsers() {
    let users = this.get('demo_users');
    if (!users) {
      users = [
        { id: '1', name: 'Aziz Karimov', email: 'aziz@example.com', level: 'B1', language: 'English', status: 'active', sessions: 24, joined: '2025-09-12' },
        { id: '2', name: 'Maria Petrova', email: 'maria@example.com', level: 'A2', language: 'English', status: 'active', sessions: 12, joined: '2025-10-01' },
        { id: '3', name: 'John Smith', email: 'john@example.com', level: 'C1', language: 'Spanish', status: 'active', sessions: 45, joined: '2025-08-20' },
        { id: '4', name: 'Dilnoza Rakhimova', email: 'dilnoza@example.com', level: 'B2', language: 'English', status: 'blocked', sessions: 8, joined: '2025-11-02' },
        { id: '5', name: 'Alex Chen', email: 'alex@example.com', level: 'A1', language: 'Japanese', status: 'active', sessions: 3, joined: '2025-11-08' }
      ];
      this.set('demo_users', users);
    }
    return users;
  },

  setDemoUsers(users) {
    return this.set('demo_users', users);
  }
};
