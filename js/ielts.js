/**
 * IELTS Speaking Practice (demo)
 */
const IELTS = {
  part1Questions: [
    "What is your full name?",
    "Where are you from?",
    "Do you work or are you a student?",
    "What do you like about your hometown?",
    "Do you prefer living in a city or the countryside?",
    "What do you usually do in your free time?",
    "Do you like cooking?",
    "How often do you use public transport?"
  ],
  part2Cards: [
    { topic: "Describe a person who has influenced you", points: ["Who this person is", "How you know them", "What they have done", "Why they influenced you"] },
    { topic: "Describe a memorable journey", points: ["Where you went", "Who you went with", "What happened", "Why it was memorable"] },
    { topic: "Describe a book you recently read", points: ["What the book was about", "Why you chose it", "What you learned", "Whether you would recommend it"] }
  ],
  part3Questions: [
    "How has technology changed the way people communicate?",
    "Do you think education should be free for everyone?",
    "What are the advantages and disadvantages of living abroad?",
    "How can governments encourage people to protect the environment?",
    "Is it better to work for a large company or a small one?"
  ],

  currentPart: 1,
  answers: [],

  init() {
    Auth.requireAuth();
    this.bindTabs();
    this.loadPart(1);
  },

  bindTabs() {
    document.querySelectorAll('[data-ielts-part]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-ielts-part]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.loadPart(+tab.dataset.ieltsPart);
      });
    });
    document.getElementById('startIeltsBtn')?.addEventListener('click', () => this.startPractice());
  },

  loadPart(part) {
    this.currentPart = part;
    const area = document.getElementById('ieltsContent');
    if (!area) return;
    if (part === 1) {
      area.innerHTML = `
        <h3 class="mb-4">Part 1 — Introduction & Interview</h3>
        <p class="text-muted mb-4">Answer short questions about familiar topics. Aim for 2–3 sentences each.</p>
        <div class="card mb-4">
          <p class="font-medium" id="ieltsQ">${this.part1Questions[0]}</p>
        </div>
        <button class="btn btn-primary" id="nextIeltsQ">Next Question</button>`;
      let qi = 0;
      document.getElementById('nextIeltsQ')?.addEventListener('click', () => {
        qi = (qi + 1) % this.part1Questions.length;
        document.getElementById('ieltsQ').textContent = this.part1Questions[qi];
      });
    } else if (part === 2) {
      const card = this.part2Cards[Math.floor(Math.random() * this.part2Cards.length)];
      area.innerHTML = `
        <h3 class="mb-4">Part 2 — Individual Long Turn</h3>
        <p class="text-muted mb-4">You have 1 minute to prepare, then speak for 1–2 minutes.</p>
        <div class="card mb-4">
          <h4 class="mb-3">${card.topic}</h4>
          <p class="text-sm text-muted mb-2">You should say:</p>
          <ul style="list-style:disc;padding-left:20px;color:var(--text-secondary)">
            ${card.points.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        <div class="flex gap-3 items-center mb-4">
          <span class="text-muted">Prep timer:</span>
          <span id="prepTimer" class="font-bold text-accent" style="font-size:1.25rem">1:00</span>
        </div>
        <button class="btn btn-primary" id="startPrepBtn">Start Preparation</button>`;
      document.getElementById('startPrepBtn')?.addEventListener('click', () => this.startPrepTimer());
    } else {
      area.innerHTML = `
        <h3 class="mb-4">Part 3 — Two-way Discussion</h3>
        <p class="text-muted mb-4">Discuss more abstract topics related to Part 2. Give reasoned opinions.</p>
        <div class="card mb-4">
          <p class="font-medium" id="ieltsQ3">${this.part3Questions[0]}</p>
        </div>
        <button class="btn btn-primary" id="nextIeltsQ3">Next Question</button>`;
      let qi = 0;
      document.getElementById('nextIeltsQ3')?.addEventListener('click', () => {
        qi = (qi + 1) % this.part3Questions.length;
        document.getElementById('ieltsQ3').textContent = this.part3Questions[qi];
      });
    }
  },

  startPrepTimer() {
    let sec = 60;
    const el = document.getElementById('prepTimer');
    const btn = document.getElementById('startPrepBtn');
    if (btn) btn.disabled = true;
    const t = setInterval(() => {
      sec--;
      if (el) el.textContent = `0:${sec.toString().padStart(2, '0')}`;
      if (sec <= 0) {
        clearInterval(t);
        if (el) el.textContent = 'Speak now!';
        App.toast('Preparation time is over. Start speaking!', 'info');
      }
    }, 1000);
  },

  startPractice() {
    // Link to speaking with IELTS context
    window.location.href = 'speaking.html';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ieltsContent')) IELTS.init();
});
