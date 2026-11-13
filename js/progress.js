/**
 * Progress tracking with Chart.js
 */
const Progress = {
  init() {
    Auth.requireAuth();
    this.renderStats();
    this.renderCharts();
  },

  renderStats() {
    const sessions = Storage.getSessions();
    const totalMin = sessions.reduce((s, x) => s + Math.floor((x.duration || 0) / 60), 0);
    const avg = sessions.length
      ? (sessions.reduce((s, x) => s + (x.overall || 0), 0) / sessions.length).toFixed(1)
      : '0';
    document.getElementById('pSessions') && (document.getElementById('pSessions').textContent = sessions.length);
    document.getElementById('pMinutes') && (document.getElementById('pMinutes').textContent = totalMin);
    document.getElementById('pAvg') && (document.getElementById('pAvg').textContent = avg);
  },

  renderCharts() {
    if (typeof Chart === 'undefined') return;
    const sessions = Storage.getSessions();

    // Weekly activity (demo data if empty)
    const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let weeklyData = [12, 19, 8, 15, 22, 10, 18];
    if (sessions.length) {
      weeklyData = weeklyLabels.map((_, i) => {
        const daySessions = sessions.filter(s => new Date(s.date).getDay() === (i + 1) % 7);
        return daySessions.reduce((a, s) => a + Math.floor((s.duration || 0) / 60), 0) || Math.floor(Math.random() * 20);
      });
    }

    const ctx1 = document.getElementById('weeklyChart');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: weeklyLabels,
          datasets: [{
            label: 'Minutes',
            data: weeklyData,
            backgroundColor: 'rgba(118, 87, 246, 0.7)',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A0AEC0' } },
            x: { grid: { display: false }, ticks: { color: '#A0AEC0' } }
          }
        }
      });
    }

    // Score history
    const scoreData = sessions.slice(0, 10).reverse().map(s => s.overall || 6.5);
    const scoreLabels = sessions.slice(0, 10).reverse().map((_, i) => `S${i + 1}`);
    if (!scoreData.length) {
      scoreLabels.push(...['S1','S2','S3','S4','S5']);
      scoreData.push(6.2, 6.5, 6.8, 7.0, 7.1);
    }

    const ctx2 = document.getElementById('scoreChart');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: scoreLabels,
          datasets: [{
            label: 'Score',
            data: scoreData,
            borderColor: '#38C9E8',
            backgroundColor: 'rgba(56, 201, 232, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#38C9E8'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 4, max: 9, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A0AEC0' } },
            x: { grid: { display: false }, ticks: { color: '#A0AEC0' } }
          }
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('weeklyChart')) Progress.init();
});
