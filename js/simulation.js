/* ==========================================================================
   ArahKarya — simulation.js
   Simulasi tugas: kanvas poster (layout A/B/C yang benar-benar berubah),
   skenario keputusan, hint, draf, refleksi, dan progres per bidang.
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK; const esc = AK.ui.esc;
  const $ = (id) => document.getElementById(id);
  let fieldId = 'desain-grafis';
  let current = 0;

  const allProgress = () => AK.storage.get(AK.KEYS.sim, {});
  const prog = () => { const p = allProgress(); return p[fieldId] || { done: {}, answers: {}, poster: null, reflection: null }; };
  function saveProg(p) { const all = allProgress(); all[fieldId] = p; AK.storage.set(AK.KEYS.sim, all); }
  const tasks = () => AK.SIMS[fieldId];
  const field = () => AK.ui.field(fieldId);
  const doneCount = () => Object.keys(prog().done).filter((k) => prog().done[k]).length;
  function nextPending(from) { const t = tasks().length; for (let k = 1; k <= t; k++) { const i = (from + k) % t; if (!prog().done[i]) return i; } return -1; }

  /* ----- Panel kiri ----- */
  function renderSide() {
    const n = tasks().length; const d = doneCount(); const pct = AK.ui.pct(d, n);
    $('sim-title').textContent = 'Simulasi: ' + field().name;
    $('sim-progress-text').textContent = 'Tugas ' + d + ' dari ' + n + ' selesai';
    $('sim-bar').style.width = pct + '%'; $('sim-progress').setAttribute('aria-valuenow', String(pct));
    $('sim-steps').innerHTML = tasks().map((t, i) => {
      const done = !!prog().done[i]; const cur = i === current;
      const title = t.kind === 'poster' ? t.title : t.title;
      return '<li><button type="button" class="btn w-100 text-start d-flex gap-2 align-items-center ' + (cur ? 'btn-primary' : 'btn-outline-primary') + '" data-step="' + i + '"' + (cur ? ' aria-current="step"' : '') + '><i class="bi ' + (done ? 'bi-check-circle-fill' : 'bi-circle') + '" aria-hidden="true"></i><span>' + (i + 1) + '. ' + esc(title) + (done ? ' <span class="visually-hidden">(selesai)</span>' : '') + '</span></button></li>';
    }).join('');
    $('sim-steps').querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => { current = Number(b.dataset.step); render(); }));
    const t = tasks()[current]; const mins = t.kind === 'poster' ? t.minutes : Math.max(2, Math.round(field().minutes / n));
    const goal = t.kind === 'poster' ? t.goal : 'Berlatih mengambil keputusan seperti yang dilakukan di bidang ' + field().name + '.';
    const crit = t.kind === 'poster' ? t.criteria : ['Memilih opsi yang paling beralasan', 'Memahami alasan di balik pilihan terbaik'];
    $('sim-info').innerHTML = '<h2 class="h6">Tentang tugas ini</h2><dl class="small mb-0"><dt>Tujuan</dt><dd class="text-muted">' + esc(goal) + '</dd><dt>Estimasi waktu</dt><dd class="text-muted">sekitar ' + mins + ' menit</dd><dt>Kriteria penilaian</dt><dd class="mb-0"><ul class="list-unstyled ak-criteria mb-0">' + crit.map((c) => '<li><i class="bi bi-check2-circle" aria-hidden="true"></i><span>' + esc(c) + '</span></li>').join('') + '</ul></dd></dl>';
  }

  /* ----- Poster ----- */
  function posterHtml(p) {
    const title = esc(p.title || 'Judul Acara'); const info = esc([p.date, p.place].filter(Boolean).join(' · ') || 'Tanggal · Lokasi');
    const tag = '<div class="p-tag">ACARA SEKOLAH</div>'; const vis = '<div class="p-visual" aria-hidden="true"></div>';
    const t = '<div class="p-title">' + title + '</div>'; const i = '<div class="p-info">' + info + '</div>';
    if (p.layout === 'B') return '<div class="ak-poster" data-layout="B">' + vis + '<div class="p-body">' + tag + t + i + '</div></div>';
    if (p.layout === 'C') return '<div class="ak-poster" data-layout="C">' + vis + t + i + tag + '</div>';
    return '<div class="ak-poster" data-layout="A">' + tag + t + vis + i + '</div>';
  }
  function renderPoster() {
    const t = tasks()[current]; const pr = prog();
    const p = pr.poster || { title: '', date: '', place: '', layout: 'A', checks: [false, false, false] };
    const done = !!pr.done[current];
    $('sim-main').innerHTML = '<div class="ak-card p-4"><div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3"><div><span class="ak-badge ak-badge-gold mb-2">Tugas ' + (current + 1) + (done ? ' · selesai' : '') + '</span><h2 class="h4 mb-1">' + esc(t.title) + '</h2><p class="text-muted mb-0">Susun poster acara sekolah agar informasinya mudah dipahami. Pilih layout, isi teks, lalu periksa kriteria.</p></div><button class="btn btn-outline-primary btn-sm" type="button" id="hint-btn" aria-expanded="false" aria-controls="hint-box"><i class="bi bi-lightbulb me-1" aria-hidden="true"></i>Buka Hint</button></div>'
      + '<div id="hint-box" class="ak-card-gold p-3 mb-3" hidden><strong>Petunjuk:</strong> ' + esc(t.hint) + '</div>'
      + '<div class="row g-4"><div class="col-md-6"><div class="mb-3"><label for="p-title" class="form-label">Judul acara</label><input class="form-control" id="p-title" maxlength="40" value="' + esc(p.title) + '" placeholder="mis. Pentas Seni Sekolah"></div><div class="row g-2 mb-3"><div class="col-6"><label for="p-date" class="form-label">Tanggal</label><input class="form-control" id="p-date" maxlength="24" value="' + esc(p.date) + '" placeholder="mis. 12 Des 2026"></div><div class="col-6"><label for="p-place" class="form-label">Lokasi</label><input class="form-control" id="p-place" maxlength="30" value="' + esc(p.place) + '" placeholder="mis. Aula"></div></div>'
      + '<fieldset class="mb-3"><legend class="form-label">Pilih layout</legend><div class="btn-group w-100" role="group" aria-label="Pilihan layout">' + ['A', 'B', 'C'].map((l) => '<input type="radio" class="btn-check" name="layout" id="lay-' + l + '" value="' + l + '"' + (p.layout === l ? ' checked' : '') + '><label class="btn btn-outline-primary" for="lay-' + l + '">Layout ' + l + '</label>').join('') + '</div><div class="form-text">A: vertikal klasik · B: visual besar di atas · C: tengah dengan latar gelap</div></fieldset>'
      + '<fieldset><legend class="form-label">Periksa kriteria sendiri</legend>' + t.criteria.map((c, k) => '<div class="form-check"><input class="form-check-input" type="checkbox" id="crit-' + k + '"' + (p.checks[k] ? ' checked' : '') + '><label class="form-check-label" for="crit-' + k + '">' + esc(c) + '</label></div>').join('') + '</fieldset></div>'
      + '<div class="col-md-6"><div class="ak-canvas-wrap" id="poster-wrap" aria-label="Pratinjau poster">' + posterHtml(p) + '</div></div></div>'
      + '<div id="sim-warn" class="text-danger small fw-semibold mt-3" role="alert" hidden></div>'
      + '<div class="d-flex flex-wrap gap-2 mt-4"><button class="btn btn-outline-primary" type="button" id="draft-btn"><i class="bi bi-save me-1" aria-hidden="true"></i>Simpan Draf</button><button class="btn btn-primary" type="button" id="finish-btn"><i class="bi bi-check2-circle me-1" aria-hidden="true"></i>Selesai</button><button class="btn btn-gold" type="button" id="next-btn"' + (done && nextPending(current) !== -1 ? '' : ' hidden') + '>Lanjut Tugas <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i></button></div></div>';

    const read = () => ({ title: $('p-title').value.trim(), date: $('p-date').value.trim(), place: $('p-place').value.trim(), layout: (document.querySelector('input[name="layout"]:checked') || {}).value || 'A', checks: t.criteria.map((_, k) => $('crit-' + k).checked) });
    const live = () => { $('poster-wrap').innerHTML = posterHtml(read()); };
    ['p-title', 'p-date', 'p-place'].forEach((id) => $(id).addEventListener('input', live));
    document.querySelectorAll('input[name="layout"]').forEach((r) => r.addEventListener('change', live));
    $('hint-btn').addEventListener('click', () => { const b = $('hint-box'); b.hidden = !b.hidden; $('hint-btn').setAttribute('aria-expanded', String(!b.hidden)); $('hint-btn').innerHTML = '<i class="bi bi-lightbulb me-1" aria-hidden="true"></i>' + (b.hidden ? 'Buka Hint' : 'Tutup Hint'); });
    $('draft-btn').addEventListener('click', () => { const q = prog(); q.poster = read(); saveProg(q); AK.ui.toast('Draf poster disimpan di browser ini.'); });
    $('finish-btn').addEventListener('click', () => {
      const v = read();
      if (!v.title) { const w = $('sim-warn'); w.textContent = 'Isi judul acara dulu supaya posternya punya pesan utama.'; w.hidden = false; $('p-title').focus(); return; }
      const q = prog(); q.poster = v; q.done[current] = true; saveProg(q);
      AK.ui.toast('Tugas ' + (current + 1) + ' selesai. Kerja bagus!'); const nx = nextPending(current); if (nx !== -1) { current = nx; } render();
    });
    $('next-btn').addEventListener('click', () => { const nx = nextPending(current); if (nx !== -1) { current = nx; render(); } });
  }

  /* ----- Skenario ----- */
  function renderScenario() {
    const t = tasks()[current]; const pr = prog(); const chosen = pr.answers[current]; const done = !!pr.done[current];
    $('sim-main').innerHTML = '<div class="ak-card p-4"><span class="ak-badge ak-badge-gold mb-2">Tugas ' + (current + 1) + (done ? ' · selesai' : '') + '</span><h2 class="h4">' + esc(t.title) + '</h2><p class="mb-4">' + esc(t.scenario) + '</p>'
      + '<fieldset><legend class="visually-hidden">Pilihan jawaban</legend><div class="d-grid gap-2">' + t.opts.map((o, k) => '<div class="ak-option"><input type="radio" name="scn" id="scn-' + k + '" value="' + k + '"' + (chosen === k ? ' checked' : '') + '><label for="scn-' + k + '"><span class="ak-option-mark"><i class="bi bi-check-lg" aria-hidden="true"></i></span><span>' + esc(o) + '</span></label></div>').join('') + '</div></fieldset>'
      + '<div id="scn-fb" class="mt-3" aria-live="polite"></div>'
      + '<div class="d-flex flex-wrap gap-2 mt-4"><button class="btn btn-outline-primary" type="button" id="hint-btn" aria-expanded="false"><i class="bi bi-lightbulb me-1" aria-hidden="true"></i>Buka Hint</button><button class="btn btn-primary" type="button" id="check-btn">Periksa Jawaban</button><button class="btn btn-gold" type="button" id="finish-btn"' + (chosen === undefined ? ' disabled' : '') + '>Selesai</button><button class="btn btn-outline-primary" type="button" id="next-btn"' + (done && nextPending(current) !== -1 ? '' : ' hidden') + '>Lanjut Tugas <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i></button></div>'
      + '<div id="hint-box" class="ak-card-gold p-3 mt-3" hidden><strong>Petunjuk:</strong> Pikirkan pilihan yang paling masuk akal bagi orang yang terdampak dan bisa kamu pertanggungjawabkan alasannya, bukan yang paling cepat.</div></div>';
    const showFb = (k) => {
      const ok = k === t.best;
      $('scn-fb').innerHTML = '<div class="ak-feedback ' + (ok ? 'is-good' : 'is-mid') + '"><i class="bi ' + (ok ? 'bi-check-circle-fill' : 'bi-lightbulb-fill') + ' me-2" aria-hidden="true"></i>' + (ok ? 'Pilihanmu tepat. ' : 'Pilihan lain lebih kuat. Opsi terbaiknya: "' + esc(t.opts[t.best]) + '". ') + esc(t.why) + '</div>';
    };
    if (chosen !== undefined) showFb(chosen);
    document.querySelectorAll('input[name="scn"]').forEach((r) => r.addEventListener('change', () => { $('finish-btn').disabled = false; $('scn-fb').innerHTML = ''; }));
    $('check-btn').addEventListener('click', () => { const sel = document.querySelector('input[name="scn"]:checked'); if (!sel) { AK.ui.toast('Pilih salah satu jawaban dulu.', 'info'); return; } const k = Number(sel.value); const q = prog(); q.answers[current] = k; saveProg(q); showFb(k); });
    $('hint-btn').addEventListener('click', () => { const b = $('hint-box'); b.hidden = !b.hidden; $('hint-btn').setAttribute('aria-expanded', String(!b.hidden)); $('hint-btn').innerHTML = '<i class="bi bi-lightbulb me-1" aria-hidden="true"></i>' + (b.hidden ? 'Buka Hint' : 'Tutup Hint'); });
    $('finish-btn').addEventListener('click', () => {
      const sel = document.querySelector('input[name="scn"]:checked'); if (!sel) return;
      const q = prog(); q.answers[current] = Number(sel.value); q.done[current] = true; saveProg(q);
      AK.ui.toast('Tugas ' + (current + 1) + ' selesai.'); const nx = nextPending(current); if (nx !== -1) current = nx; render();
    });
    $('next-btn').addEventListener('click', () => { const nx = nextPending(current); if (nx !== -1) { current = nx; render(); } });
  }

  /* ----- Penutup + refleksi ----- */
  function renderFooterCards() {
    const f = field(); const pr = prog(); const r = pr.reflection || { hard: '', rate: 0, notes: '' };
    const all = doneCount() === tasks().length;
    let html = '';
    if (all) html += '<div class="ak-card-gold p-4 mt-3"><h2 class="h5"><i class="bi bi-trophy me-2" aria-hidden="true"></i>Simulasi ' + esc(f.name) + ' selesai</h2><p class="mb-3">Kamu sudah mencoba gambaran tugas di bidang ini. Ingat, ini baru pengenalan dan belum menandakan penguasaan keterampilan. Lanjutkan ke langkah berikutnya untuk memperdalam.</p><div class="d-flex flex-wrap gap-2"><a class="btn btn-primary" href="jalur-karier.html?bidang=' + f.id + '">Lihat Jalur Karier</a><a class="btn btn-gold" href="rencana-belajar.html?bidang=' + f.id + '">Buat Rencana Belajar</a><a class="btn btn-outline-primary" href="jelajahi.html">Coba bidang lain</a></div></div>';
    html += '<div class="ak-card p-4 mt-3"><h2 class="h5">Refleksi pengalamanmu</h2><div class="row g-3"><div class="col-md-6"><label for="r-hard" class="form-label">Apa yang paling menantang?</label><select class="form-select" id="r-hard"><option value="">Pilih salah satu</option>' + ['Memahami tugas', 'Menentukan pilihan', 'Mengatur waktu', 'Menjaga kualitas hasil', 'Tidak ada yang sulit'].map((o) => '<option' + (r.hard === o ? ' selected' : '') + '>' + o + '</option>').join('') + '</select></div><div class="col-md-6"><fieldset><legend class="form-label">Seberapa kamu menikmatinya?</legend><div class="btn-group" role="group" aria-label="Tingkat kenikmatan 1 sampai 5">' + [1, 2, 3, 4, 5].map((n) => '<input type="radio" class="btn-check" name="rate" id="rate-' + n + '" value="' + n + '"' + (r.rate === n ? ' checked' : '') + '><label class="btn btn-outline-primary" for="rate-' + n + '">' + n + '</label>').join('') + '</div><div class="form-text">1 = kurang, 5 = sangat menikmati</div></fieldset></div><div class="col-12"><label for="r-notes" class="form-label">Catatan (opsional)</label><textarea class="form-control" id="r-notes" rows="3" maxlength="400" placeholder="Apa yang kamu pelajari tentang dirimu?">' + esc(r.notes) + '</textarea></div></div><button class="btn btn-primary mt-3" type="button" id="refl-save"><i class="bi bi-save me-1" aria-hidden="true"></i>Simpan Refleksi</button> <button class="btn btn-link mt-3" type="button" id="sim-reset">Ulangi simulasi ini</button></div>';
    $('sim-extra').innerHTML = html;
    $('refl-save').addEventListener('click', () => { const q = prog(); const rate = document.querySelector('input[name="rate"]:checked'); q.reflection = { hard: $('r-hard').value, rate: rate ? Number(rate.value) : 0, notes: $('r-notes').value.trim() }; saveProg(q); AK.ui.toast('Refleksi disimpan.'); });
    $('sim-reset').addEventListener('click', () => AK.ui.confirm({ title: 'Ulangi simulasi ini?', body: 'Progres, draf, dan refleksi untuk bidang ' + esc(f.name) + ' akan dihapus.', okText: 'Ya, ulangi', danger: true, onOk: () => { const all2 = allProgress(); delete all2[fieldId]; AK.storage.set(AK.KEYS.sim, all2); current = 0; render(); AK.ui.toast('Simulasi diulang.', 'info'); } }));
  }

  function render() {
    renderSide();
    if (tasks()[current].kind === 'poster') renderPoster(); else renderScenario();
    renderFooterCards();
  }

  function setField(id, pushUrl) {
    fieldId = AK.SIMS[id] ? id : 'desain-grafis';
    $('sim-field').value = fieldId;
    const p = prog(); const firstPending = tasks().findIndex((_, i) => !p.done[i]);
    current = firstPending === -1 ? 0 : firstPending;
    if (pushUrl) history.replaceState(null, '', 'simulasi.html?bidang=' + fieldId);
    render();
  }

  AK.ui.onReady(function () {
    const extra = document.createElement('div'); extra.id = 'sim-extra'; $('sim-main').after(extra);
    $('sim-field').innerHTML = AK.FIELDS.map((f) => '<option value="' + f.id + '">' + esc(f.name) + '</option>').join('');
    $('sim-field').addEventListener('change', () => setField($('sim-field').value, true));
    setField(AK.ui.param('bidang') || 'desain-grafis', false);
  });
})();
