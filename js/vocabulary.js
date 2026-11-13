/**
 * Vocabulary Builder
 */
const Vocabulary = {
  init() {
    Auth.requireAuth();
    this.render();
    this.bindEvents();
  },

  getList() {
    let list = Storage.getVocab();
    if (!list.length) {
      list = [
        { id: '1', word: 'fluent', translation: 'ravon', definition: 'Able to speak a language easily and accurately', example: 'She is fluent in three languages.', level: 'B1' },
        { id: '2', word: 'pronunciation', translation: 'talaffuz', definition: 'The way in which a word is pronounced', example: 'His pronunciation has improved a lot.', level: 'A2' },
        { id: '3', word: 'coherent', translation: 'mantiqiy', definition: 'Logical and consistent', example: 'She gave a coherent explanation.', level: 'B2' }
      ];
      Storage.setVocab(list);
    }
    return list;
  },

  render(filter = '') {
    const list = this.getList().filter(w =>
      !filter || w.word.toLowerCase().includes(filter) || w.translation.toLowerCase().includes(filter)
    );
    const container = document.getElementById('vocabList');
    if (!container) return;
    if (!list.length) {
      container.innerHTML = `<div class="empty-state"><p>${I18n.t('no_data')}</p></div>`;
      return;
    }
    container.innerHTML = list.map(w => `
      <div class="card" style="margin-bottom:12px" data-id="${w.id}">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-semibold text-lg">${w.word} <span class="badge badge-primary">${w.level}</span></div>
            <div class="text-muted text-sm">${w.translation}</div>
            <div class="mt-2 text-sm">${w.definition}</div>
            <div class="mt-1 text-sm text-muted"><em>"${w.example}"</em></div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm" onclick="Vocabulary.edit('${w.id}')">${I18n.t('edit')}</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="Vocabulary.remove('${w.id}')">${I18n.t('delete')}</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  bindEvents() {
    document.getElementById('addVocabBtn')?.addEventListener('click', () => App.openModal('addVocabModal'));
    document.getElementById('vocabSearch')?.addEventListener('input', (e) => this.render(e.target.value));
    document.getElementById('saveVocabBtn')?.addEventListener('click', () => this.save());
  },

  save() {
    const word = document.getElementById('vWord')?.value.trim();
    const translation = document.getElementById('vTranslation')?.value.trim();
    const definition = document.getElementById('vDefinition')?.value.trim();
    const example = document.getElementById('vExample')?.value.trim();
    const level = document.getElementById('vLevel')?.value || 'A2';
    if (!word) {
      App.toast('Word is required', 'error');
      return;
    }
    const list = this.getList();
    const editId = document.getElementById('vEditId')?.value;
    if (editId) {
      const idx = list.findIndex(w => w.id === editId);
      if (idx >= 0) list[idx] = { ...list[idx], word, translation, definition, example, level };
    } else {
      list.unshift({ id: Date.now().toString(), word, translation, definition, example, level });
    }
    Storage.setVocab(list);
    App.closeModal('addVocabModal');
    this.render();
    App.toast('Saved!', 'success');
    this.clearForm();
  },

  edit(id) {
    const w = this.getList().find(x => x.id === id);
    if (!w) return;
    document.getElementById('vEditId').value = w.id;
    document.getElementById('vWord').value = w.word;
    document.getElementById('vTranslation').value = w.translation || '';
    document.getElementById('vDefinition').value = w.definition || '';
    document.getElementById('vExample').value = w.example || '';
    document.getElementById('vLevel').value = w.level || 'A2';
    App.openModal('addVocabModal');
  },

  remove(id) {
    if (!confirm('Delete this word?')) return;
    const list = this.getList().filter(w => w.id !== id);
    Storage.setVocab(list);
    this.render();
    App.toast('Deleted', 'success');
  },

  clearForm() {
    ['vEditId','vWord','vTranslation','vDefinition','vExample'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('vocabList')) Vocabulary.init();
});
