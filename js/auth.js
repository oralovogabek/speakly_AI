/**
 * Demo authentication (frontend only — not secure)
 */
const Auth = {
  initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value;
      if (!email || !password) {
        App.toast('Please fill all fields', 'error');
        return;
      }
      // Demo: accept any credentials
      const user = {
        id: 'demo-1',
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email,
        nativeLang: 'Uzbek',
        learningLang: 'English',
        level: 'B1',
        plan: 'free',
        joined: new Date().toISOString()
      };
      Storage.setUser(user);
      App.toast('Welcome back!', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 600);
    });
  },

  initRegister() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.fullName.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;
      const confirm = form.confirmPassword.value;
      const nativeLang = form.nativeLang.value;
      const learningLang = form.learningLang.value;
      const level = form.level.value;

      if (!name || !email || !password) {
        App.toast('Please fill required fields', 'error');
        return;
      }
      if (password.length < 6) {
        App.toast('Password must be at least 6 characters', 'error');
        return;
      }
      if (password !== confirm) {
        App.toast('Passwords do not match', 'error');
        return;
      }

      const user = {
        id: Date.now().toString(),
        name,
        email,
        nativeLang,
        learningLang,
        level,
        plan: 'free',
        joined: new Date().toISOString()
      };
      Storage.setUser(user);
      App.toast('Account created successfully!', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 600);
    });
  },

  logout() {
    Storage.logout();
    window.location.href = 'index.html';
  },

  requireAuth() {
    if (!Storage.isLoggedIn()) {
      // For demo, create a guest user
      Storage.setUser({
        id: 'guest',
        name: 'Demo User',
        email: 'demo@speakly.ai',
        nativeLang: 'Uzbek',
        learningLang: 'English',
        level: 'B1',
        plan: 'pro',
        joined: new Date().toISOString()
      });
    }
    return Storage.getUser();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Auth.initLogin();
  Auth.initRegister();
});
