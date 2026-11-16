/* ==========================================================================
   ArahKarya — learning-plan.js
   Rencana belajar 30 hari: pembuatan rencana, checklist 4 minggu (12
   aktivitas), progres otomatis, catatan mingguan, bagikan, dan penyimpanan
   di localStorage sehingga bisa dilanjutkan setelah browser dibuka kembali.
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK; const esc = AK.ui.esc;
  const $ = (id) => document.getElementById(id);
  const root = () => $('plan-root');
  let plan = null;

  const load = () => AK.storage.get(AK.KEYS.plan, null);
  const save = () => AK.storage.set(AK.KEYS.plan, plan);
  const field = () => AK.ui.field(plan.field);
  const total = () => AK.PLAN_WEEKS.length * 3;
  const doneAll = () => Object.keys(plan.done).filter((k) => plan.done[k]).length;
  const doneWeek = (w) => [0, 1, 2].filter((i) => plan.done[w + '-' + i]).length;

  function suggestedField() {
    const p = AK.ui.param('bidang'); if (p && AK.ui.field(p)) return p;
    const r = AK.ui.getResult(); if (r) return AK.DIMS[r.topDims[0]].field;
    return AK.FIELDS[0].id;
  }

  /* ----- Pembuatan rencana ----- */
  function renderSetup() {
    const sel = suggestedField();
    root().innerHTML = '<div class="row g-4"><div class="col-lg-7"><form class="ak-card p-4 p-lg-5" id="setup-form" novalidate><h2 class="h4 mb-1">Buat rencana belajarmu</h2><p class="text-muted mb-4">Pilih bidang dan tulis tujuanmu. Kami menyiapkan 12 aktivitas dalam 4 minggu.</p>'
      + '<div class="mb-3"><label for="s-field" class="form-label">Bidang yang ingin kamu pelajari</label><select class="form-select" id="s-field">' + AK.FIELDS.map((f) => '<option value="' + f.id + '"' + (f.id === sel ? ' selected' : '') + '>' + esc(f.name) + '</option>').join('') + '</select></div>'
      + '<div class="mb-4"><label for="s-goal" class="form-label">Tujuan belajarmu</label><textarea class="form-control" id="s-goal" rows="3" maxlength="200" required placeholder="mis. Memahami dasar desain dan membuat 1 poster yang rapi"></textarea><div class="invalid-feedback">Tulis tujuan belajarmu (minimal 8 karakter).</div></div>'
      + '<button class="btn btn-primary btn-lg" type="submit">Buat Rencana 30 Hari</button></form></div>'
      + '<div class="col-lg-5"><div class="ak-card-soft p-4"><h2 class="h5">Isi rencananya</h2><ul class="list-unstyled d-grid gap-2 mb-0 small">' + AK.PLAN_WEEKS.map((w) => '<li><strong>Minggu ' + w.week + ': ' + esc(w.title) + '.</strong> ' + esc(w.target) + '</li>').join('') + '</ul></div></div></div>';
    $('setup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const g = $('s-goal'); const ok = g.value.trim().length >= 8; g.classList.toggle('is-invalid', !ok);
      if (!ok) { g.focus(); return; }
      plan = { field: $('s-field').value, goal: g.value.trim(), startedAt: new Date().toISOString(), done: {}, notes: {} };
      save(); AK.ui.toast('Rencana belajar 30 hari dibuat dan tersimpan.'); render();
    });
  }

  /* ----- Dashboard ----- */
  function weekCard(w, tasks) {
    const n = doneWeek(w.week);
    return '<section class="ak-card p-4 mb-3" aria-labelledby="wk' + w.week + '"><div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2"><div><span class="ak-badge ak-badge-gold mb-2">Minggu ' + w.week + '</span><h3 class="h5 mb-1" id="wk' + w.week + '">' + esc(w.title) + '</h3><p class="small text-muted mb-0">Target: ' + esc(w.target) + '</p></div><span class="ak-badge" id="wk-badge-' + w.week + '">' + n + ' / 3 selesai</span></div>'
      + '<div class="mt-3">' + tasks.map((t, i) => { const id = 'task-' + w.week + '-' + i; const d = !!plan.done[w.week + '-' + i]; return '<div class="ak-task' + (d ? ' is-done' : '') + '" data-task-row="' + w.week + '-' + i + '"><input class="form-check-input" type="checkbox" id="' + id + '" data-task="' + w.week + '-' + i + '"' + (d ? ' checked' : '') + '><label class="ak-task-label" for="' + id + '">' + esc(t) + '</label></div>'; }).join('') + '</div>'
      + '<div class="mt-3"><label for="note-' + w.week + '" class="form-label small">Catatan refleksi minggu ' + w.week + '</label><textarea class="form-control" id="note-' + w.week + '" data-note="' + w.week + '" rows="2" maxlength="500" placeholder="Apa yang kamu pelajari atau rasakan minggu ini?">' + esc(plan.notes[w.week] || '') + '</textarea><div class="d-flex justify-content-between align-items-center mt-2"><span class="small text-muted" id="note-status-' + w.week + '">Tersimpan otomatis saat kamu selesai mengetik.</span><button class="btn btn-sm btn-outline-primary" type="button" data-save-note="' + w.week + '">Simpan Catatan</button></div></div></section>';
  }

  function renderDashboard() {
    const f = field(); const tpl = AK.planTemplate(f); const pct = AK.ui.pct(doneAll(), total());
    root().innerHTML = '<div class="row g-4"><div class="col-lg-8">'
      + '<section class="ak-card p-4 mb-3" aria-labelledby="goal-h"><div class="d-flex flex-wrap justify-content-between align-items-start gap-2"><div><span class="ak-badge mb-2"><i class="bi ' + f.icon + '" aria-hidden="true"></i>' + esc(f.name) + '</span><h2 id="goal-h" class="h5 mb-1">Tujuan belajar</h2><p class="mb-0" id="goal-text">' + esc(plan.goal) + '</p></div><div class="d-flex gap-2"><button class="btn btn-sm btn-outline-primary" type="button" id="goal-edit"><i class="bi bi-pencil me-1" aria-hidden="true"></i>Ubah tujuan</button><button class="btn btn-sm btn-outline-primary" type="button" id="field-change"><i class="bi bi-arrow-left-right me-1" aria-hidden="true"></i>Ganti bidang</button></div></div></section>'
      + '<section class="ak-card p-4 mb-3" aria-labelledby="prog-h"><div class="d-flex justify-content-between align-items-center mb-2"><h2 id="prog-h" class="h5 mb-0">Progres keseluruhan</h2><span class="fw-bold" id="prog-pct">' + pct + '%</span></div><div class="progress progress-lg" role="progressbar" aria-label="Progres rencana belajar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" id="prog-wrap"><div class="progress-bar bg-ok" id="prog-bar" style="width:' + pct + '%"></div></div><p class="small text-muted mt-2 mb-0" id="prog-text">' + doneAll() + ' dari ' + total() + ' aktivitas selesai</p></section>'
      + AK.PLAN_WEEKS.map((w, i) => weekCard(w, tpl[i])).join('')
      + '</div><div class="col-lg-4">'
      + '<section class="ak-card p-4 mb-3" aria-labelledby="mat-h"><h2 id="mat-h" class="h5">Materi pembelajaran</h2><p class="small text-muted">Urutan course pemula yang disarankan:</p><ol class="small ps-3 mb-3">' + f.course.map((c) => '<li class="mb-1">' + esc(c) + '</li>').join('') + '</ol><div class="small fw-semibold mb-1">Keterampilan</div><ul class="ak-pill-list mb-3">' + f.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul><div class="small fw-semibold mb-1">Alat yang dipakai</div><ul class="ak-pill-list mb-3">' + f.tools.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul><p class="small text-muted mb-0">Cari sumber belajar resmi atau terpercaya untuk tiap topik.</p></section>'
      + '<section class="ak-card p-4" aria-labelledby="act-h"><h2 id="act-h" class="h5 mb-3">Tindakan</h2><div class="d-grid gap-2"><button class="btn btn-primary" type="button" id="plan-save"><i class="bi bi-save me-1" aria-hidden="true"></i>Simpan Rencana</button><button class="btn btn-outline-primary" type="button" id="plan-share"><i class="bi bi-share me-1" aria-hidden="true"></i>Bagikan</button><a class="btn btn-outline-primary" href="magang.html?bidang=' + f.id + '"><i class="bi bi-briefcase me-1" aria-hidden="true"></i>Cari Magang Relevan</a><a class="btn btn-outline-primary" href="komunitas.html?q=' + encodeURIComponent(f.name) + '"><i class="bi bi-people me-1" aria-hidden="true"></i>Tanya di Komunitas</a><a class="btn btn-outline-primary" href="simulasi.html?bidang=' + f.id + '"><i class="bi bi-lightning-charge me-1" aria-hidden="true"></i>Coba Simulasi</a></div><hr><button class="btn btn-link text-danger p-0" type="button" id="plan-reset">Hapus rencana ini</button></section>'
      + '</div></div>';
    bind();
  }

  function refreshProgress() {
    const pct = AK.ui.pct(doneAll(), total());
    $('prog-pct').textContent = pct + '%'; $('prog-bar').style.width = pct + '%'; $('prog-wrap').setAttribute('aria-valuenow', String(pct));
    $('prog-text').textContent = doneAll() + ' dari ' + total() + ' aktivitas selesai';
    AK.PLAN_WEEKS.forEach((w) => { $('wk-badge-' + w.week).textContent = doneWeek(w.week) + ' / 3 selesai'; });
  }

  function summaryText() {
    const f = field();
    return 'Rencana Belajar 30 Hari ArahKarya\nBidang: ' + f.name + '\nTujuan: ' + plan.goal + '\nProgres: ' + doneAll() + ' dari ' + total() + ' aktivitas (' + AK.ui.pct(doneAll(), total()) + '%)\n\nKenali Diri, Rancang Masa Depanmu.';
  }
  function share() {
    const text = summaryText();
    if (navigator.share) { navigator.share({ title: 'Rencana Belajar ArahKarya', text: text }).catch(() => {}); return; }
    const done = () => AK.ui.toast('Ringkasan rencana disalin. Tempel di aplikasi mana pun untuk membagikannya.');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done)); else fallbackCopy(text, done);
  }
  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; } ta.remove();
    if (ok) cb(); else AK.ui.modal({ id: 'share-modal', title: 'Salin ringkasan rencana', body: '<textarea class="form-control" rows="6" readonly>' + esc(text) + '</textarea>' });
  }

  function bind() {
    root().querySelectorAll('[data-task]').forEach((cb) => cb.addEventListener('change', () => {
      plan.done[cb.dataset.task] = cb.checked; save();
      const row = root().querySelector('[data-task-row="' + cb.dataset.task + '"]'); if (row) row.classList.toggle('is-done', cb.checked);
      refreshProgress();
    }));
    const saveNote = (w) => { plan.notes[w] = $('note-' + w).value.trim(); save(); $('note-status-' + w).textContent = 'Catatan tersimpan.'; };
    root().querySelectorAll('[data-note]').forEach((t) => { t.addEventListener('blur', () => saveNote(t.dataset.note)); t.addEventListener('input', () => { $('note-status-' + t.dataset.note).textContent = 'Belum disimpan...'; }); });
    root().querySelectorAll('[data-save-note]').forEach((b) => b.addEventListener('click', () => { saveNote(b.dataset.saveNote); AK.ui.toast('Catatan minggu ' + b.dataset.saveNote + ' disimpan.'); }));
    $('plan-save').addEventListener('click', () => { save(); AK.ui.toast('Rencana tersimpan di browser ini. Kamu bisa melanjutkannya kapan saja.'); });
    $('plan-share').addEventListener('click', share);
    $('goal-edit').addEventListener('click', () => {
      AK.ui.modal({ id: 'goal-modal', title: 'Ubah tujuan belajar', body: '<label for="g-new" class="form-label">Tujuan belajarmu</label><textarea class="form-control" id="g-new" rows="3" maxlength="200">' + esc(plan.goal) + '</textarea><div class="invalid-feedback">Minimal 8 karakter.</div>', footer: '<button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Batal</button><button type="button" class="btn btn-primary" id="g-save">Simpan</button>' });
      $('g-save').addEventListener('click', () => { const g = $('g-new'); if (g.value.trim().length < 8) { g.classList.add('is-invalid'); return; } plan.goal = g.value.trim(); save(); bootstrap.Modal.getInstance($('goal-modal')).hide(); $('goal-text').textContent = plan.goal; AK.ui.toast('Tujuan diperbarui.'); });
    });
    $('field-change').addEventListener('click', () => AK.ui.confirm({ title: 'Ganti bidang?', body: 'Rencana saat ini (centang dan catatan) akan dihapus dan kamu membuat rencana baru.', okText: 'Ya, buat rencana baru', danger: true, onOk: () => { AK.storage.remove(AK.KEYS.plan); plan = null; render(); } }));
    $('plan-reset').addEventListener('click', () => AK.ui.confirm({ title: 'Hapus rencana ini?', body: 'Semua centang dan catatan akan dihapus dari perangkat ini.', okText: 'Ya, hapus', danger: true, onOk: () => { AK.storage.remove(AK.KEYS.plan); plan = null; render(); AK.ui.toast('Rencana dihapus.', 'info'); } }));
  }

  function render() {
    plan = load();
    if (!plan || !AK.ui.field(plan.field)) { plan = null; renderSetup(); return; }
    plan.done = plan.done || {}; plan.notes = plan.notes || {};
    renderDashboard();
    const p = AK.ui.param('bidang');
    if (p && p !== plan.field && AK.ui.field(p)) {
      const a = document.createElement('div'); a.className = 'alert alert-info d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3';
      a.innerHTML = '<span>Kamu sudah punya rencana untuk <strong>' + esc(field().name) + '</strong>. Ingin membuat rencana baru untuk <strong>' + esc(AK.ui.field(p).name) + '</strong>?</span><button class="btn btn-sm btn-primary" type="button" id="swap-plan">Buat rencana baru</button>';
      root().prepend(a);
      $('swap-plan').addEventListener('click', () => AK.ui.confirm({ title: 'Buat rencana baru?', body: 'Rencana yang ada akan dihapus.', okText: 'Ya, ganti', danger: true, onOk: () => { AK.storage.remove(AK.KEYS.plan); history.replaceState(null, '', 'rencana-belajar.html?bidang=' + p); render(); } }));
    }
  }

  AK.ui.onReady(render);
})();
