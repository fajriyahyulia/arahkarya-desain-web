/* ==========================================================================
   ArahKarya — community.js
   Forum (data demo), konsultasi (jadwal simulasi lokal), dan pertanyaan
   pribadi yang disimpan di localStorage. Tidak ada pengiriman ke server.
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK; const esc = AK.ui.esc;
  const $ = (id) => document.getElementById(id);
  const uniq = (arr) => Array.from(new Set(arr));

  /* ----- Forum ----- */
  function renderThreads() {
    const q = $('t-q').value.trim().toLowerCase(); const m = $('t-major').value; const ind = $('t-ind').value;
    const list = AK.THREADS.filter((t) => (!q || (t.title + ' ' + t.body + ' ' + t.major).toLowerCase().includes(q)) && (!m || t.major === m) && (!ind || t.industry === ind));
    $('t-count').textContent = list.length + ' diskusi ditampilkan';
    $('thread-empty').hidden = list.length > 0;
    $('thread-list').innerHTML = list.map((t) => '<article class="ak-card ak-card-hover ak-thread"><div class="d-flex gap-3"><span class="ak-avatar" aria-hidden="true">' + esc(t.author.slice(-1)) + '</span><div class="flex-grow-1"><div class="d-flex flex-wrap justify-content-between gap-2"><h2 class="h6 mb-1">' + esc(t.title) + '</h2></div><p class="small text-muted mb-2">' + esc(t.body) + '</p><div class="d-flex flex-wrap align-items-center gap-2 small"><span class="ak-badge">' + esc(t.major) + '</span><span class="ak-badge">' + esc(t.industry) + '</span><span class="text-muted"><i class="bi bi-chat me-1" aria-hidden="true"></i>' + t.replies + ' balasan</span><span class="text-muted"><i class="bi bi-clock me-1" aria-hidden="true"></i>' + esc(t.when) + '</span><button class="btn btn-sm btn-outline-primary ms-auto" type="button" data-open="' + t.id + '">Buka diskusi</button></div></div></div></article>').join('');
    document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => openThread(b.dataset.open)));
  }
  function openThread(id) {
    const t = AK.THREADS.find((x) => x.id === id);
    AK.ui.modal({ id: 'thread-modal', title: t.title, size: 'modal-lg',
      body: '<div class="d-flex flex-wrap gap-2 mb-3"><span class="ak-badge">' + esc(t.major) + '</span><span class="ak-badge">' + esc(t.industry) + '</span><span class="small text-muted">oleh ' + esc(t.author) + ' · ' + esc(t.when) + '</span></div><p>' + esc(t.body) + '</p><h3 class="h6 mt-4">Balasan (' + t.answers.length + ' ditampilkan dari ' + t.replies + ')</h3>' + t.answers.map((a, i) => '<div class="ak-card-soft p-3 mt-2"><div class="small fw-semibold mb-1">Pengguna ' + (i + 8) + '</div><div>' + esc(a) + '</div></div>').join('') + '<p class="small text-muted mt-3 mb-0">Membalas diskusi belum tersedia karena belum ada server. Kamu bisa menyimpan pertanyaanmu sendiri di tab Pertanyaanku.</p>',
      footer: '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Tutup</button>' });
  }

  /* ----- Konsultasi ----- */
  const sched = () => AK.storage.get(AK.KEYS.consult, []);
  function renderConsultants() {
    $('consultant-list').innerHTML = AK.CONSULTANTS.map((c) => '<div class="col-md-6"><article class="ak-card p-4 h-100"><div class="d-flex gap-3 mb-3"><span class="ak-avatar" aria-hidden="true">' + esc(c.name.slice(-1)) + '</span><div><h2 class="h6 mb-0">' + esc(c.name) + '</h2><div class="small text-muted">' + esc(c.role) + '</div></div></div><p class="small mb-3"><strong>Fokus:</strong> ' + esc(c.focus) + '</p><div class="small fw-semibold mb-2">Pilih jadwal (simulasi)</div><div class="d-flex flex-wrap gap-2">' + c.slots.map((s) => '<button class="btn btn-sm btn-outline-primary" type="button" data-book="' + c.id + '|' + esc(s) + '">' + esc(s) + '</button>').join('') + '</div></article></div>').join('');
    document.querySelectorAll('[data-book]').forEach((b) => b.addEventListener('click', () => {
      const [cid, slot] = b.dataset.book.split('|'); const c = AK.CONSULTANTS.find((x) => x.id === cid);
      AK.ui.confirm({ title: 'Simpan jadwal simulasi?', body: 'Kamu memilih <strong>' + esc(c.name) + '</strong>, <strong>' + esc(slot) + '</strong>.<br><span class="text-muted">Ini hanya catatan di browser ini. Sesi konsultasi <strong>belum dipesan</strong> dan tidak ada pihak yang menerima permintaan ini.</span>', okText: 'Simpan catatan',
        onOk: () => { const l = sched(); if (l.some((x) => x.cid === cid && x.slot === slot)) { AK.ui.toast('Jadwal itu sudah ada di catatanmu.', 'info'); return; } l.push({ id: 'sc' + Date.now(), cid: cid, name: c.name, slot: slot, savedAt: new Date().toISOString() }); AK.storage.set(AK.KEYS.consult, l); renderSchedule(); AK.ui.toast('Jadwal simulasi dicatat. Belum ada sesi yang dipesan.', 'info'); } });
    }));
  }
  function renderSchedule() {
    const l = sched();
    $('my-schedule').innerHTML = l.length ? '<ul class="list-unstyled d-grid gap-2 mb-0">' + l.map((x) => '<li class="d-flex flex-wrap justify-content-between align-items-center gap-2 ak-card-soft p-3"><span><strong>' + esc(x.name) + '</strong> · ' + esc(x.slot) + ' </span><button class="btn btn-sm btn-outline-primary" type="button" data-del-sc="' + x.id + '" aria-label="Hapus catatan jadwal ' + esc(x.name) + '">Hapus</button></li>').join('') + '</ul>' : '<div class="text-muted">Belum ada catatan jadwal. Pilih salah satu jadwal di atas.</div>';
    document.querySelectorAll('[data-del-sc]').forEach((b) => b.addEventListener('click', () => { AK.storage.set(AK.KEYS.consult, sched().filter((x) => x.id !== b.dataset.delSc)); renderSchedule(); AK.ui.toast('Catatan jadwal dihapus.', 'info'); }));
  }

  /* ----- Pertanyaanku ----- */
  const myQs = () => AK.storage.get(AK.KEYS.questions, []);
  function renderMyQs() {
    const l = myQs(); $('q-count').textContent = String(l.length);
    $('my-questions').innerHTML = l.length ? l.map((x) => '<article class="ak-card p-3 mb-2"><div class="d-flex justify-content-between gap-2"><h3 class="h6 mb-1">' + esc(x.title) + '</h3></div><p class="small text-muted mb-2">' + esc(x.body) + '</p><div class="d-flex flex-wrap align-items-center gap-2 small"><span class="ak-badge">' + esc(x.major) + '</span><span class="ak-badge">' + esc(x.industry) + '</span><span class="text-muted">' + esc(AK.ui.formatDate(x.createdAt.slice(0, 10))) + '</span><button class="btn btn-sm btn-outline-primary ms-auto" type="button" data-del-q="' + x.id + '">Hapus</button></div></article>').join('') : '<div class="ak-empty"><i class="bi bi-question-circle ak-empty-icon" aria-hidden="true"></i><h3 class="h6 mt-3">Belum ada pertanyaan</h3><p class="text-muted mb-0">Tulis pertanyaan pertamamu di formulir.</p></div>';
    document.querySelectorAll('[data-del-q]').forEach((b) => b.addEventListener('click', () => AK.ui.confirm({ title: 'Hapus pertanyaan?', body: 'Pertanyaan ini akan dihapus dari perangkatmu.', okText: 'Hapus', danger: true, onOk: () => { AK.storage.set(AK.KEYS.questions, myQs().filter((x) => x.id !== b.dataset.delQ)); renderMyQs(); AK.ui.toast('Pertanyaan dihapus.', 'info'); } })));
  }

  function showTab(id) { const el = $(id); if (el && window.bootstrap) bootstrap.Tab.getOrCreateInstance(el).show(); }

  AK.ui.onReady(function () {
    const majors = uniq(AK.THREADS.map((t) => t.major)).sort(); const inds = uniq(AK.THREADS.map((t) => t.industry)).sort();
    $('t-major').innerHTML = '<option value="">Semua jurusan</option>' + majors.map((m) => '<option>' + esc(m) + '</option>').join('');
    $('t-ind').innerHTML = '<option value="">Semua industri</option>' + inds.map((m) => '<option>' + esc(m) + '</option>').join('');
    const allMajors = uniq(AK.MAJORS.map((m) => m.name).concat(['Umum'])); const allInds = ['Teknologi', 'Pendidikan', 'Kesehatan', 'Media', 'Bisnis', 'Lainnya'];
    $('a-major').innerHTML = allMajors.map((m) => '<option>' + esc(m) + '</option>').join(''); $('a-ind').innerHTML = allInds.map((m) => '<option>' + esc(m) + '</option>').join('');
    const q = AK.ui.param('q'); if (q) $('t-q').value = q;
    $('t-q').addEventListener('input', AK.ui.debounce(renderThreads, 150)); $('t-major').addEventListener('change', renderThreads); $('t-ind').addEventListener('change', renderThreads);
    $('forum-filter').addEventListener('submit', (e) => e.preventDefault());
    $('goto-ask').addEventListener('click', () => { showTab('tab-pertanyaan'); $('a-title').focus(); });
    renderThreads(); renderConsultants(); renderSchedule(); renderMyQs();

    $('ask-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = $('a-title'); const b = $('a-body');
      const ok1 = t.value.trim().length >= 8; const ok2 = b.value.trim().length >= 15;
      t.classList.toggle('is-invalid', !ok1); b.classList.toggle('is-invalid', !ok2);
      if (!(ok1 && ok2)) { (ok1 ? b : t).focus(); return; }
      const l = myQs(); l.unshift({ id: 'q' + Date.now(), title: t.value.trim(), body: b.value.trim(), major: $('a-major').value, industry: $('a-ind').value, createdAt: new Date().toISOString() });
      AK.storage.set(AK.KEYS.questions, l); t.value = ''; b.value = ''; renderMyQs();
      AK.ui.toast('Pertanyaan disimpan di browser ini. Belum dikirim ke pengguna lain.', 'info');
    });

    const h = window.location.hash;
    if (h === '#konsultasi') showTab('tab-konsultasi'); else if (h === '#pertanyaan') showTab('tab-pertanyaan');
  });
})();
