/**
 * Admin Panel (demo)
 */
const Admin = {
  init() {
    // Demo admin access — in production check role on backend
    this.renderOverview();
    this.renderUsers();
  },

  renderOverview() {
    const users = Storage.getDemoUsers();
    const sessions = Storage.getSessions();
    this.set('aTotalUsers', users.length);
    this.set('aActiveUsers', users.filter(u => u.status === 'active').length);
    this.set('aSessions', sessions.length + 128);
    this.set('aMinutes', sessions.reduce((s, x) => s + Math.floor((x.duration || 0) / 60), 0) + 3420);
  },

  renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    const users = Storage.getDemoUsers();
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>
          <div class="flex items-center gap-3">
            <div class="avatar avatar-sm">${u.name.charAt(0)}</div>
            <div>
              <div class="font-medium" style="color:var(--text-primary)">${u.name}</div>
              <div class="text-sm text-muted">${u.email}</div>
            </div>
          </div>
        </td>
        <td>${u.level}</td>
        <td>${u.language}</td>
        <td>${u.sessions}</td>
        <td><span class="status-dot ${u.status}"></span>${u.status}</td>
        <td>
          <div class="admin-table-actions">
            <button class="btn btn-sm btn-secondary" onclick="Admin.toggleStatus('${u.id}')">${u.status === 'active' ? 'Block' : 'Activate'}</button>
            <button class="btn btn-sm btn-ghost" style="color:var(--danger)" onclick="Admin.deleteUser('${u.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  toggleStatus(id) {
    const users = Storage.getDemoUsers();
    const u = users.find(x => x.id === id);
    if (!u) return;
    u.status = u.status === 'active' ? 'blocked' : 'active';
    Storage.setDemoUsers(users);
    this.renderUsers();
    App.toast(`User ${u.status}`, 'success');
  },

  deleteUser(id) {
    if (!confirm('Delete this user? This is a demo action.')) return;
    const users = Storage.getDemoUsers().filter(u => u.id !== id);
    Storage.setDemoUsers(users);
    this.renderUsers();
    this.renderOverview();
    App.toast('User deleted', 'success');
  },

  set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('aTotalUsers') || document.getElementById('usersTableBody')) Admin.init();
});
