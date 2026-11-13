/**
 * User Dashboard
 */
const Dashboard = {
  init() {
    const user = Auth.requireAuth();
    this.renderWelcome(user);
    this.renderStats();
    this.renderActivity();
  },

  renderWelcome(user) {
    const el = document.getElementById('welcomeName');
    if (el) el.textContent = user.name.split(' ')[0];
    const lang = document.getElementById('currentLang');
    if (lang) lang.textContent = user.learningLang || 'English';
    const level = document.getElementById('currentLevel');
    if (level) level.textContent = user.level || 'B1';
  },

  renderStats() {
    const sessions = Storage.getSessions();
    const totalMin = sessions.reduce((s, x) => s + Math.floor((x.duration || 0) / 60), 0);
    const avg = sessions.length
      ? (sessions.reduce((s, x) => s + (x.overall || 0), 0) / sessions.length).toFixed(1)
      : '—';

    this.setText('statSessions', sessions.length || 0);
    this.setText('statMinutes', totalMin || 0);
    this.setText('statScore', avg);
    this.setText('statStreak', this.calcStreak(sessions));
  },

  calcStreak(sessions) {
    if (!sessions.length) return 0;
    // Simple demo streak
    return Math.min(sessions.length, 7);
  },

  renderActivity() {
    const list = document.getElementById('activityList');
    if (!list) return;
    const sessions = Storage.getSessions().slice(0, 5);
    if (!sessions.length) {
      list.innerHTML = `<div class="empty-state"><p class="text-muted">${I18n.t('no_data')}</p></div>`;
      return;
    }
    list.innerHTML = sessions.map(s => `
      <div class="activity-item">
        <div class="activity-icon" style="background:var(--primary-light);color:var(--primary)">
          ${App.icon('message', 18)}
        </div>
        <div class="activity-content">
          <div class="activity-title">${s.topic || 'Speaking'} · ${s.language || 'English'}</div>
          <div class="activity-meta">${App.formatDate(s.date)} · ${App.formatDuration(s.duration || 0)} · Score ${s.overall || '—'}</div>
        </div>
      </div>
    `).join('');
  },

  setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('welcomeName')) Dashboard.init();
});
