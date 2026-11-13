/**
 * Speaking analysis / results page
 */
const Analysis = {
  init() {
    const raw = sessionStorage.getItem('lastSession');
    if (!raw) {
      document.getElementById('resultContent')?.insertAdjacentHTML('beforeend',
        `<div class="empty-state"><p>No session data. <a href="speaking.html">Start a session</a></p></div>`);
      return;
    }
    const session = JSON.parse(raw);
    this.render(session);
  },

  render(s) {
    const scores = s.scores || {};
    this.set('rOverall', scores.overall ?? s.overall ?? '—');
    this.set('rFluency', scores.fluency ?? '—');
    this.set('rGrammar', scores.grammar ?? '—');
    this.set('rVocab', scores.vocabulary ?? '—');
    this.set('rPron', scores.pronunciation ?? '—');
    this.set('rCoh', scores.coherence ?? '—');

    // Feedback demo
    const feedback = document.getElementById('generalFeedback');
    if (feedback) {
      feedback.textContent = `You spoke for ${App.formatDuration(s.duration || 0)} on the topic "${s.topic}". Your overall performance is solid for ${s.level || 'intermediate'} level. Keep practicing regularly to improve fluency and expand vocabulary.`;
    }

    const mistakes = document.getElementById('mistakesList');
    if (mistakes) {
      mistakes.innerHTML = `
        <div class="mistake-item">
          <div class="original">I go to the work every day</div>
          <div class="corrected">I go to work every day</div>
        </div>
        <div class="mistake-item">
          <div class="original">She don't like coffee</div>
          <div class="corrected">She doesn't like coffee</div>
        </div>`;
    }

    const tips = document.getElementById('improvementTips');
    if (tips) {
      tips.innerHTML = `
        <ul style="list-style:disc;padding-left:20px;color:var(--text-secondary)">
          <li>Practice linking words (however, therefore, in addition)</li>
          <li>Expand answers with examples and reasons</li>
          <li>Record yourself and listen for filler words</li>
          <li>Learn 5–10 new topic-related words each week</li>
        </ul>`;
    }

    // Transcript
    const tr = document.getElementById('resultTranscript');
    if (tr && s.transcript?.length) {
      tr.innerHTML = s.transcript.map(m => `
        <div class="message ${m.role}">
          <div class="message-bubble">${m.text}<div class="message-meta">${m.role === 'ai' ? 'AI' : 'You'}</div></div>
        </div>`).join('');
    }
  },

  set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('resultContent')) Analysis.init();
});
