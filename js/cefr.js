/**
 * CEFR Speaking Practice
 */
const CEFR = {
  levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  tasks: {
    A1: ['Introduce yourself (name, age, city).', 'Describe your family in simple sentences.', 'Talk about your daily routine using present simple.'],
    A2: ['Describe a picture of a city street.', 'Talk about your last holiday (past simple).', 'Compare two simple pictures (home vs office).'],
    B1: ['Give your opinion on online learning.', 'Describe a problem and suggest a solution.', 'Talk about advantages and disadvantages of social media.'],
    B2: ['Argue for or against remote work.', 'Speculate about future technology trends.', 'Discuss cultural differences in communication.'],
    C1: ['Analyse the impact of globalisation on local cultures.', 'Evaluate different approaches to education reform.', 'Discuss abstract concepts like freedom or justice.'],
    C2: ['Critique a complex societal issue with nuanced arguments.', 'Compare academic and everyday language use.', 'Lead a structured debate on an ethical dilemma.']
  },

  init() {
    Auth.requireAuth();
    this.renderLevels();
    document.getElementById('cefrLevelSelect')?.addEventListener('change', (e) => this.loadTasks(e.target.value));
    this.loadTasks('B1');
  },

  renderLevels() {
    const sel = document.getElementById('cefrLevelSelect');
    if (!sel) return;
    sel.innerHTML = this.levels.map(l => `<option value="${l}">${l}</option>`).join('');
    sel.value = 'B1';
  },

  loadTasks(level) {
    const tasks = this.tasks[level] || [];
    const area = document.getElementById('cefrTasks');
    if (!area) return;
    area.innerHTML = tasks.map((t, i) => `
      <div class="card mb-3" style="cursor:pointer" onclick="CEFR.startTask('${level}', ${i})">
        <div class="flex justify-between items-center">
          <div>
            <span class="badge badge-primary mb-2">${level}</span>
            <p class="font-medium">${t}</p>
          </div>
          <button class="btn btn-sm btn-primary">Practice</button>
        </div>
      </div>`).join('');
  },

  startTask(level, idx) {
    App.toast(`Starting ${level} task. Use the Speaking module for full practice.`, 'info');
    setTimeout(() => window.location.href = 'speaking.html', 800);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cefrTasks')) CEFR.init();
});
