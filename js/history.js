/**
 * Speaking History
 */
const History = {
  init() {
    Auth.requireAuth();
    this.render();
  },

  render() {
    const sessions = Storage.getSessions();
    const container = document.getElementById('historyList');
    if (!container) return;
    if (!sessions.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${App.icon('message', 48)}</div>
          <h3>No sessions yet</h3>
          <p>Start your first AI speaking practice!</p>
          <a href="speaking.html" class="btn btn-primary">${I18n.t('start_conversation')}</a>
        </div>`;
      return;
    }
    container.innerHTML = `
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Language</th>
              <th>Topic</th>
              <th>Duration</th>
              <th>Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${sessions.map(s => `
              <tr>
                <td>${App.formatDate(s.date)}</td>
                <td>${s.language || '—'}</td>
                <td style="text-transform:capitalize">${s.topic || '—'}</td>
                <td>${App.formatDuration(s.duration || 0)}</td>
                <td><span class="badge badge-primary">${s.overall || '—'}</span></td>
                <td><button class="btn btn-sm btn-secondary" onclick="History.view('${s.id}')">View</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  },

  view(id) {
    const s = Storage.getSessions().find(x => x.id === id);
    if (!s) return;
    sessionStorage.setItem('lastSession', JSON.stringify(s));
    window.location.href = 'speaking-result.html';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('historyList')) History.init();
});
