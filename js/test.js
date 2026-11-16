/* ==========================================================================
   ArahKarya — test.js
   Tes minat 12 pertanyaan: navigasi, simpan sementara, konfirmasi akhir,
   dan perhitungan hasil (lihat AK.ui.computeResult di main.js).
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK;
  const $ = (id) => document.getElementById(id);
  const Q = () => AK.QUESTIONS;
  let state = { values: {}, current: 0 };

  function persist() { AK.storage.set(AK.KEYS.answers, { values: state.values, current: state.current, updatedAt: new Date().toISOString() }); }
  function answeredCount() { return Object.keys(state.values).length; }
  function firstUnanswered() { for (let i = 0; i < Q().length; i++) if (state.values[i] === undefined) return i; return -1; }
  function warn(msg) { const w = $('q-warning'); w.textContent = msg || ''; w.hidden = !msg; }

  function render() {
    const total = Q().length; const i = state.current; const q = Q()[i];
    $('q-indicator').textContent = 'Pertanyaan ' + (i + 1) + ' dari ' + total;
    const pct = Math.round((answeredCount() / total) * 100);
    $('q-percent').textContent = pct + '% terjawab';
    $('q-bar').style.width = pct + '%';
    $('q-progress').setAttribute('aria-valuenow', String(pct));
    $('q-text').textContent = q.text;
    $('q-options').innerHTML = q.options.map((o, k) => {
      const id = 'opt-' + i + '-' + k; const checked = state.values[i] === k;
      return '<div class="ak-option"><input type="radio" name="q-' + i + '" id="' + id + '" value="' + k + '"' + (checked ? ' checked' : '') + '><label for="' + id + '"><span class="ak-option-mark"><i class="bi bi-check-lg" aria-hidden="true"></i></span><span>' + AK.ui.esc(o.text) + '</span></label></div>';
    }).join('');
    $('q-options').querySelectorAll('input').forEach((inp) => inp.addEventListener('change', () => {
      state.values[i] = Number(inp.value); state.current = i; persist(); warn(''); renderChrome();
    }));
    $('q-dots').innerHTML = Q().map((_, k) => {
      const cls = k === i ? 'is-current' : (state.values[k] !== undefined ? 'is-done' : '');
      return '<button type="button" class="ak-dot ' + cls + '" data-go="' + k + '" aria-label="Pertanyaan ' + (k + 1) + (state.values[k] !== undefined ? ', sudah dijawab' : ', belum dijawab') + '"' + (k === i ? ' aria-current="step"' : '') + '>' + (k + 1) + '</button>';
    }).join('');
    $('q-dots').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.go))));
    $('q-prev').disabled = i === 0;
    $('q-next').innerHTML = i === total - 1 ? 'Selesai &amp; Lihat Hasil <i class="bi bi-check2-circle ms-1" aria-hidden="true"></i>' : 'Selanjutnya <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>';
  }
  function renderChrome() { // pembaruan ringan tanpa merender ulang opsi
    const total = Q().length; const pct = Math.round((answeredCount() / total) * 100);
    $('q-percent').textContent = pct + '% terjawab'; $('q-bar').style.width = pct + '%'; $('q-progress').setAttribute('aria-valuenow', String(pct));
    $('q-dots').querySelectorAll('button').forEach((b, k) => {
      b.classList.toggle('is-done', k !== state.current && state.values[k] !== undefined);
      b.classList.toggle('is-current', k === state.current);
    });
  }
  function go(k) { state.current = Math.max(0, Math.min(Q().length - 1, k)); persist(); warn(''); render(); $('q-text').scrollIntoView({ block: 'center', behavior: 'smooth' }); }

  function finish() {
    const first = firstUnanswered();
    if (first !== -1) {
      warn('Masih ada pertanyaan yang belum dijawab. Aku arahkan ke pertanyaan ' + (first + 1) + '.');
      go(first); warn('Pertanyaan ' + (first + 1) + ' belum dijawab. Jawab semuanya agar hasil akurat.');
      return;
    }
    AK.ui.confirm({
      title: 'Selesaikan tes?',
      body: 'Kamu sudah menjawab <strong>' + Q().length + ' dari ' + Q().length + '</strong> pertanyaan. Setelah selesai, hasilmu dihitung dan ditampilkan. Kamu masih bisa mengulang tes kapan saja.',
      okText: 'Ya, lihat hasil',
      onOk: function () {
        const result = AK.ui.computeResult(state.values);
        result.answers = Object.assign({}, state.values);
        AK.storage.set(AK.KEYS.result, result);
        persist();
        window.location.href = 'hasil.html';
      }
    });
  }

  AK.ui.onReady(function () {
    const saved = AK.storage.get(AK.KEYS.answers, null);
    if (saved && saved.values) {
      state.values = saved.values;
      const first = firstUnanswered();
      state.current = typeof saved.current === 'number' ? saved.current : (first === -1 ? 0 : first);
      if (answeredCount() > 0 && answeredCount() < Q().length && typeof saved.current !== 'number') state.current = first;
    }
    if (AK.ui.getResult()) {
      const quiz = $('quiz');
      const note = document.createElement('div');
      note.className = 'alert alert-info d-flex flex-wrap justify-content-between align-items-center gap-2';
      note.innerHTML = '<span>Kamu sudah punya hasil tes. Mengubah jawaban lalu menyelesaikan tes akan memperbarui hasilnya.</span><a class="btn btn-sm btn-primary" href="hasil.html">Lihat hasil saya</a>';
      quiz.parentNode.insertBefore(note, quiz);
    }
    $('q-prev').addEventListener('click', () => go(state.current - 1));
    $('q-next').addEventListener('click', () => {
      if (state.values[state.current] === undefined) { warn('Pilih salah satu jawaban dulu. Tidak ada jawaban benar atau salah.'); return; }
      if (state.current === Q().length - 1) finish(); else go(state.current + 1);
    });
    $('q-save').addEventListener('click', () => { persist(); AK.ui.toast('Jawaban sementara disimpan di browser ini. Kamu bisa melanjutkannya nanti.'); });
    $('q-restart').addEventListener('click', () => AK.ui.confirm({
      title: 'Ulangi tes dari awal?', body: 'Jawaban sementara akan dihapus. Hasil tes yang sudah ada tetap tersimpan sampai kamu menyelesaikan tes baru.', okText: 'Ya, ulangi', danger: true,
      onOk: () => { state = { values: {}, current: 0 }; AK.storage.remove(AK.KEYS.answers); warn(''); render(); AK.ui.toast('Tes diulang dari awal.', 'info'); }
    }));
    render();
  });
})();
