/**
 * AI Speaking Partner (demo with Web Speech API + simulated AI)
 */
const Speaking = {
  state: {
    language: 'en-US',
    level: 'intermediate',
    topic: null,
    isActive: false,
    isRecording: false,
    isPaused: false,
    transcript: [],
    startTime: null,
    timerInterval: null,
    recognition: null,
    synth: window.speechSynthesis
  },

  topics: [
    { id: 'daily', name: 'Daily Life', icon: '🏠' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'environment', name: 'Environment', icon: '🌍' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'culture', name: 'Culture', icon: '🎭' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'personal', name: 'Personal Experiences', icon: '💭' }
  ],

  questions: {
    daily: [
      "Tell me about your typical morning routine.",
      "What do you usually do on weekends?",
      "How do you spend time with your family?",
      "What is your favorite meal of the day and why?",
      "Describe your neighborhood."
    ],
    education: [
      "What subjects did you enjoy most at school?",
      "How has education changed with technology?",
      "Do you prefer studying alone or in a group?",
      "What would you like to learn in the future?",
      "Describe a memorable teacher you had."
    ],
    technology: [
      "How has technology changed your daily life?",
      "What is your opinion on social media?",
      "Do you think AI will replace many jobs?",
      "What gadget can you not live without?",
      "How do you protect your privacy online?"
    ],
    environment: [
      "What environmental issues concern you most?",
      "How can individuals help protect the environment?",
      "Do you recycle? Why or why not?",
      "What is the climate like in your region?",
      "Should governments do more about climate change?"
    ],
    business: [
      "Would you rather work for a company or start your own business?",
      "What skills are most important in the workplace today?",
      "How do you handle stress at work?",
      "Describe a successful person you admire.",
      "What makes a good leader?"
    ],
    travel: [
      "What is the most interesting place you have visited?",
      "Do you prefer beach holidays or city breaks?",
      "How do you prepare for a trip?",
      "Would you like to live in another country?",
      "What is your dream destination?"
    ],
    health: [
      "How do you stay healthy?",
      "What is your opinion on fast food?",
      "Do you exercise regularly?",
      "How important is mental health?",
      "Describe a time when you felt really healthy and energetic."
    ],
    culture: [
      "What traditions are important in your culture?",
      "How do people celebrate New Year in your country?",
      "What kind of music do you enjoy?",
      "Have you ever experienced culture shock?",
      "What is unique about your hometown's culture?"
    ],
    science: [
      "What scientific discovery fascinates you?",
      "Should more money be spent on space exploration?",
      "How has science improved our lives?",
      "Are you interested in medicine or biology?",
      "What invention do you think is the most important?"
    ],
    sports: [
      "Do you play any sports?",
      "What is the most popular sport in your country?",
      "Do you prefer watching or playing sports?",
      "Have you ever competed in a tournament?",
      "What can we learn from sports?"
    ],
    personal: [
      "Tell me about a challenge you overcame.",
      "What are your goals for the next five years?",
      "Who has influenced you the most?",
      "What makes you happy?",
      "Describe a perfect day for you."
    ]
  },

  langMap: {
    English: 'en-US',
    Uzbek: 'uz-UZ',
    Russian: 'ru-RU',
    German: 'de-DE',
    French: 'fr-FR',
    Spanish: 'es-ES',
    Italian: 'it-IT',
    Turkish: 'tr-TR',
    Japanese: 'ja-JP',
    Korean: 'ko-KR',
    Arabic: 'ar-SA',
    Chinese: 'zh-CN'
  },

  initSetup() {
    this.renderTopics();
    this.bindSetupEvents();
  },

  renderTopics() {
    const grid = document.getElementById('topicGrid');
    if (!grid) return;
    grid.innerHTML = this.topics.map(t => `
      <div class="topic-card" data-topic="${t.id}">
        <div style="font-size:1.75rem;margin-bottom:8px">${t.icon}</div>
        <div class="font-medium text-sm">${t.name}</div>
      </div>
    `).join('');
  },

  bindSetupEvents() {
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.state.level = btn.dataset.level;
      });
    });

    document.getElementById('topicGrid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.topic-card');
      if (!card) return;
      document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      this.state.topic = card.dataset.topic;
    });

    document.getElementById('langSelect')?.addEventListener('change', (e) => {
      this.state.language = this.langMap[e.target.value] || 'en-US';
    });

    document.getElementById('startSpeakingBtn')?.addEventListener('click', () => {
      if (!this.state.topic) {
        App.toast('Please select a topic', 'warning');
        return;
      }
      this.startSession();
    });
  },

  startSession() {
    document.getElementById('setupPanel')?.classList.add('hidden');
    document.getElementById('sessionPanel')?.classList.remove('hidden');
    this.state.isActive = true;
    this.state.startTime = Date.now();
    this.state.transcript = [];
    this.startTimer();
    this.initSpeechRecognition();
    this.askQuestion();
  },

  startTimer() {
    const el = document.getElementById('sessionTimer');
    this.state.timerInterval = setInterval(() => {
      if (this.state.isPaused) return;
      const sec = Math.floor((Date.now() - this.state.startTime) / 1000);
      if (el) el.textContent = App.formatDuration(sec);
    }, 1000);
  },

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      App.toast('Speech recognition not supported in this browser. Demo mode will simulate.', 'warning');
      return;
    }
    this.state.recognition = new SpeechRecognition();
    this.state.recognition.lang = this.state.language;
    this.state.recognition.continuous = false;
    this.state.recognition.interimResults = false;

    this.state.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      this.addMessage('user', text);
      this.state.isRecording = false;
      this.updateMicUI(false);
      this.processUserAnswer(text);
    };

    this.state.recognition.onerror = () => {
      this.state.isRecording = false;
      this.updateMicUI(false);
      App.toast('Could not recognize speech. Try again.', 'error');
    };

    this.state.recognition.onend = () => {
      this.state.isRecording = false;
      this.updateMicUI(false);
    };
  },

  askQuestion() {
    const qs = this.questions[this.state.topic] || this.questions.daily;
    const q = qs[Math.floor(Math.random() * qs.length)];
    this.addMessage('ai', q);
    this.speak(q);
    this.setStatus('speaking');
    setTimeout(() => this.setStatus('your_turn'), 2500);
  },

  speak(text) {
    if (!this.state.synth) return;
    this.state.synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = this.state.language.startsWith('en') ? 'en-US' : this.state.language;
    u.rate = 0.95;
    this.state.synth.speak(u);
  },

  toggleMic() {
    if (!this.state.isActive || this.state.isPaused) return;
    if (this.state.isRecording) {
      this.state.recognition?.stop();
      this.state.isRecording = false;
      this.updateMicUI(false);
    } else {
      if (this.state.recognition) {
        this.state.recognition.start();
        this.state.isRecording = true;
        this.updateMicUI(true);
        this.setStatus('listening');
      } else {
        // Demo fallback
        this.simulateUserSpeech();
      }
    }
  },

  simulateUserSpeech() {
    this.state.isRecording = true;
    this.updateMicUI(true);
    this.setStatus('listening');
    setTimeout(() => {
      const demos = [
        "I usually wake up at seven and have breakfast with my family. Then I go to work by bus.",
        "In my free time I like reading books and watching movies. Sometimes I meet friends.",
        "Technology has made communication much easier, but I think we should also spend time offline.",
        "I believe education is the key to success. I want to improve my speaking skills."
      ];
      const text = demos[Math.floor(Math.random() * demos.length)];
      this.addMessage('user', text);
      this.state.isRecording = false;
      this.updateMicUI(false);
      this.processUserAnswer(text);
    }, 2500);
  },

  processUserAnswer(text) {
    this.setStatus('processing');
    // Simulated AI response delay
    setTimeout(() => {
      const followUps = [
        "That's interesting! Can you tell me more about that?",
        "I see. How long have you been doing that?",
        "Great answer. What do you think about the future of this?",
        "Thank you for sharing. Why is that important to you?",
        "Nice. Have you always felt that way?"
      ];
      const reply = followUps[Math.floor(Math.random() * followUps.length)];
      this.addMessage('ai', reply);
      this.speak(reply);
      this.setStatus('speaking');
      setTimeout(() => this.setStatus('your_turn'), 2000);
    }, 1200);
  },

  addMessage(role, text) {
    this.state.transcript.push({ role, text, time: new Date().toISOString() });
    const box = document.getElementById('chatTranscript');
    if (!box) return;
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `
      <div class="message-bubble">
        ${text}
        <div class="message-meta">${role === 'ai' ? 'AI Partner' : 'You'}</div>
      </div>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  },

  updateMicUI(recording) {
    const btn = document.getElementById('micBtn');
    if (btn) btn.classList.toggle('recording', recording);
  },

  setStatus(key) {
    const el = document.getElementById('aiStatus');
    if (!el) return;
    const map = {
      speaking: I18n.t('speaking'),
      listening: I18n.t('listening'),
      your_turn: I18n.t('your_turn'),
      processing: I18n.t('processing')
    };
    el.textContent = map[key] || key;
    const avatar = document.querySelector('.ai-avatar');
    avatar?.classList.toggle('speaking', key === 'speaking');
  },

  endSession() {
    clearInterval(this.state.timerInterval);
    this.state.synth?.cancel();
    this.state.recognition?.stop();
    this.state.isActive = false;

    const duration = Math.floor((Date.now() - this.state.startTime) / 1000);
    const scores = this.generateScores();
    const session = {
      language: document.getElementById('langSelect')?.value || 'English',
      topic: this.state.topic,
      level: this.state.level,
      duration,
      scores,
      transcript: this.state.transcript,
      overall: scores.overall
    };
    Storage.addSession(session);
    sessionStorage.setItem('lastSession', JSON.stringify(session));
    window.location.href = 'speaking-result.html';
  },

  generateScores() {
    // Demo scores — realistic random
    const r = (min, max) => Math.round((min + Math.random() * (max - min)) * 10) / 10;
    const fluency = r(5.5, 8.5);
    const grammar = r(5.0, 8.0);
    const vocabulary = r(5.5, 8.5);
    const pronunciation = r(5.0, 8.0);
    const coherence = r(5.5, 8.5);
    const overall = Math.round(((fluency + grammar + vocabulary + pronunciation + coherence) / 5) * 10) / 10;
    return { fluency, grammar, vocabulary, pronunciation, coherence, overall };
  },

  togglePause() {
    this.state.isPaused = !this.state.isPaused;
    const btn = document.getElementById('pauseBtn');
    if (btn) btn.textContent = this.state.isPaused ? I18n.t('resume') : I18n.t('pause');
    if (this.state.isPaused) this.state.synth?.pause();
    else this.state.synth?.resume();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('topicGrid')) Speaking.initSetup();
  
  document.getElementById('micBtn')?.addEventListener('click', () => Speaking.toggleMic());
  document.getElementById('endSessionBtn')?.addEventListener('click', () => Speaking.endSession());
  document.getElementById('pauseBtn')?.addEventListener('click', () => Speaking.togglePause());
});
