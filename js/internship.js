/* ==========================================================================
   ArahKarya — internship.js
   Katalog lowongan DEMO: filter nyata, kecocokan keterampilan, detail,
   pelacakan lamaran lokal (bukan status resmi), dan unduhan templat.
   Tombol Lamar TIDAK mengirim apa pun.
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK; const esc = AK.ui.esc;
  const $ = (id) => document.getElementById(id);
  const apps = () => AK.storage.get(AK.KEYS.apps, []);
  const saveApps = (l) => AK.storage.set(AK.KEYS.apps, l);
  const prefs = () => AK.storage.get(AK.KEYS.prefs, {});
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const isClosed = (j) => new Date(j.deadline + 'T23:59:59') < today();

  /** Keterampilan pengguna dari hasil tes (2 dimensi teratas) dan rencana belajar. */
  function userSkills() {
    const set = new Set(); let source = null;
    const r = AK.ui.getResult();
    if (r) { r.topDims.slice(0, 2).forEach((d) => AK.ui.field(AK.DIMS[d].field).skills.forEach((s) => set.add(s))); source = 'hasil tesmu'; }
    const p = AK.storage.get(AK.KEYS.plan, null);
    if (p && AK.ui.field(p.field)) { AK.ui.field(p.field).skills.forEach((s) => set.add(s)); source = source ? source + ' dan rencana belajarmu' : 'rencana belajarmu'; }
    return { set: set, source: source };
  }
  const matchOf = (j, us) => (us.source ? Math.round((j.skills.filter((s) => us.set.has(s)).length / j.skills.length) * 100) : null);

  function filtered(us) {
    const q = $('j-q').value.trim().toLowerCase(); const fl = $('j-field').value; const ty = $('j-type').value; const lv = $('j-level').value;
    const remote = $('j-remote').checked; const near = $('j-near').checked; const city = $('j-city').value;
    let list = AK.JOBS.filter((j) => {
      if (q && !(j.title + ' ' + j.company + ' ' + j.skills.join(' ') + ' ' + j.desc).toLowerCase().includes(q)) return false;
      if (fl && j.field !== fl) return false; if (ty && j.type !== ty) return false; if (lv && j.level !== lv) return false;
      if (remote && j.mode !== 'Remote') return false;
      if (near && city && j.city !== city) return false;
      return true;
    });
    list = list.map((j) => ({ j: j, m: matchOf(j, us) })).sort((a, b) => (b.m ?? -1) - (a.m ?? -1) || a.j.deadline.localeCompare(b.j.deadline));
    return list;
  }

  function render() {
    const us = userSkills();
    $('match-note').innerHTML = us.source ? '<i class="bi bi-bullseye me-1" aria-hidden="true"></i>Kecocokan keterampilan dihitung dari ' + esc(us.source) + ' dan keterampilan yang dibutuhkan tiap posisi.' : '<i class="bi bi-info-circle me-1" aria-hidden="true"></i>Ikuti <a href="tes-minat.html">tes minat</a> atau buat <a href="rencana-belajar.html">rencana belajar</a> untuk melihat kecocokan keterampilan.';
    if ($('j-near').checked && !$('j-city').value) { AK.ui.toast('Pilih kotamu dulu agar filter "Dekat lokasiku" bekerja.', 'info'); }
    const list = filtered(us); const tracked = apps();
    $('j-count').textContent = list.length + ' dari ' + AK.JOBS.length + ' lowongan ditampilkan';
    $('job-empty').hidden = list.length > 0;
    $('job-list').innerHTML = list.map(({ j, m }) => {
      const t = tracked.find((x) => x.jobId === j.id); const closed = isClosed(j);
      return '<div class="col-lg-6"><article class="ak-card ak-card-hover p-4 h-100 d-flex flex-column"><div class="d-flex gap-3 mb-3"><span class="ak-job-logo" aria-hidden="true">' + esc(j.company.trim().slice(-1)) + '</span><div class="flex-grow-1"><h2 class="h6 mb-0">' + esc(j.title) + '</h2><div class="small text-muted">' + esc(j.company) + ' · ' + esc(j.city) + '</div></div></div>'
        + '<div class="d-flex flex-wrap gap-2 mb-2"><span class="ak-badge"><i class="bi bi-geo-alt" aria-hidden="true"></i>' + esc(j.mode) + '</span><span class="ak-badge"><i class="bi bi-briefcase" aria-hidden="true"></i>' + esc(j.type) + '</span><span class="ak-badge"><i class="bi bi-speedometer2" aria-hidden="true"></i>' + esc(j.level) + '</span>' + (closed ? '<span class="ak-badge ak-badge-gold">Ditutup</span>' : '') + (t ? '<span class="ak-badge ak-badge-ok"><i class="bi bi-bookmark-check" aria-hidden="true"></i>' + esc(t.status) + '</span>' : '') + '</div>'
        + '<p class="small text-muted mb-2">' + esc(j.desc) + '</p><ul class="ak-pill-list mb-3">' + j.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>'
        + '<div class="small text-muted mb-3">Dipublikasikan ' + esc(AK.ui.formatDate(j.posted)) + ' · Batas daftar ' + esc(AK.ui.formatDate(j.deadline)) + '</div>'
        + '<div class="d-flex flex-wrap align-items-center gap-2 mt-auto">' + (m === null ? '' : '<span class="small me-auto">Kecocokan keterampilan: <span class="ak-match">' + m + '%</span></span>') + '<button class="btn btn-sm btn-outline-primary' + (m === null ? ' ms-auto' : '') + '" type="button" data-detail="' + j.id + '">Detail</button><button class="btn btn-sm btn-primary" type="button" data-apply="' + j.id + '">' + (t ? 'Lihat Lamaran' : 'Lamar') + '</button></div></article></div>';
    }).join('');
    document.querySelectorAll('[data-detail]').forEach((b) => b.addEventListener('click', () => detail(b.dataset.detail)));
    document.querySelectorAll('[data-apply]').forEach((b) => b.addEventListener('click', () => apply(b.dataset.apply)));
  }

  function detail(id) {
    const j = AK.JOBS.find((x) => x.id === id); const us = userSkills(); const m = matchOf(j, us);
    AK.ui.modal({ id: 'job-modal', title: j.title, size: 'modal-lg',
      body: '<p class="mb-1"><strong>' + esc(j.company) + '</strong> · ' + esc(j.city) + ' · ' + esc(j.mode) + ' · ' + esc(j.type) + ' · ' + esc(j.level) + '</p><p class="small text-muted">Dipublikasikan ' + esc(AK.ui.formatDate(j.posted)) + ' · Batas pendaftaran ' + esc(AK.ui.formatDate(j.deadline)) + (m === null ? '' : ' · Kecocokan keterampilanmu ' + m + '%') + '</p><h3 class="h6">Deskripsi pekerjaan</h3><p>' + esc(j.desc) + '</p><h3 class="h6">Kualifikasi</h3><ul>' + j.quals.map((q) => '<li>' + esc(q) + '</li>').join('') + '</ul><h3 class="h6">Keterampilan yang dibutuhkan</h3><ul class="ak-pill-list mb-0">' + j.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>',
      footer: '<button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Tutup</button><button type="button" class="btn btn-primary" id="job-apply">Lamar</button>' });
    $('job-apply').addEventListener('click', () => { bootstrap.Modal.getInstance($('job-modal')).hide(); setTimeout(() => apply(id), 250); });
  }

  function apply(id) {
    const j = AK.JOBS.find((x) => x.id === id); const t = apps().find((x) => x.jobId === id);
    if (t) { AK.ui.toast('Lowongan ini sudah ada di pelacakanmu dengan status "' + t.status + '".', 'info'); document.getElementById('apps-h').scrollIntoView({ behavior: 'smooth' }); return; }
    AK.ui.confirm({ title: 'Catat lamaran ini?', body: '<p><strong>' + esc(j.title) + '</strong> di ' + esc(j.company) + '</p><p class="mb-0 text-muted">Tombol Lamar mencatat lamaranmu di <strong>pelacak pribadi</strong>. Kami hanya mencatatnya di pelacakan pribadimu dengan status "Disiapkan". Statusnya bukan status resmi dari perusahaan.</p>', okText: 'Catat di pelacakan',
      onOk: () => { const l = apps(); l.push({ id: 'a' + Date.now(), jobId: j.id, title: j.title, company: j.company, status: 'Disiapkan', createdAt: new Date().toISOString() }); saveApps(l); render(); renderApps(); AK.ui.toast('Dicatat di pelacakan sebagai "Disiapkan". Belum ada lamaran yang dikirim.', 'info'); } });
  }

  function renderApps() {
    const l = apps();
    if (!l.length) { $('apps-root').innerHTML = '<div class="ak-empty"><i class="bi bi-clipboard-check ak-empty-icon" aria-hidden="true"></i><h3 class="h6 mt-3">Belum ada lamaran yang dilacak</h3><p class="text-muted mb-0">Klik Lamar pada lowongan untuk mulai mencatat persiapanmu.</p></div>'; return; }
    $('apps-root').innerHTML = '<div class="ak-card p-3"><div class="table-responsive"><table class="table ak-table ak-table-stack align-middle mb-0"><thead><tr><th scope="col">Posisi</th><th scope="col">Perusahaan</th><th scope="col">Status (catatan pribadi)</th><th scope="col">Dicatat</th><th scope="col"><span class="visually-hidden">Aksi</span></th></tr></thead><tbody>' + l.map((a) => '<tr><td data-label="Posisi" class="fw-semibold">' + esc(a.title) + '</td><td data-label="Perusahaan">' + esc(a.company) + '</td><td data-label="Status"><label class="visually-hidden" for="st-' + a.id + '">Status lamaran ' + esc(a.title) + '</label><select class="form-select form-select-sm" id="st-' + a.id + '" data-status="' + a.id + '">' + AK.APP_STATUS.map((s) => '<option' + (a.status === s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td><td data-label="Dicatat">' + esc(AK.ui.formatDate(a.createdAt.slice(0, 10))) + '</td><td><button class="btn btn-sm btn-outline-primary" type="button" data-del-app="' + a.id + '" aria-label="Hapus pelacakan ' + esc(a.title) + '">Hapus</button></td></tr>').join('') + '</tbody></table></div><p class="small text-muted mt-3 mb-0">Status ini hanya catatan pribadimu di browser ini dan tidak mencerminkan status resmi dari perusahaan.</p></div>';
    document.querySelectorAll('[data-status]').forEach((s) => s.addEventListener('change', () => { const x = apps(); const it = x.find((a) => a.id === s.dataset.status); it.status = s.value; saveApps(x); render(); AK.ui.toast('Status dicatat: ' + s.value + '.', 'info'); }));
    document.querySelectorAll('[data-del-app]').forEach((b) => b.addEventListener('click', () => AK.ui.confirm({ title: 'Hapus dari pelacakan?', body: 'Catatan lamaran ini akan dihapus dari perangkatmu.', okText: 'Hapus', danger: true, onOk: () => { saveApps(apps().filter((a) => a.id !== b.dataset.delApp)); render(); renderApps(); AK.ui.toast('Dihapus dari pelacakan.', 'info'); } })));
  }

  const TEMPLATES = {
    cv: ['Template_CV_ArahKarya.txt', 'TEMPLAT CV (satu halaman)\n=========================\n\n[NAMA LENGKAP]\n[Kota] | [Email] | [Nomor telepon] | [Tautan portofolio / LinkedIn]\n\nRINGKASAN\nSatu sampai dua kalimat tentang minatmu dan apa yang ingin kamu pelajari atau kontribusikan.\n\nPENDIDIKAN\n[Nama kampus / sekolah] - [Jurusan], [Tahun masuk] - sekarang\n- IPK / nilai (opsional): [ ]\n- Mata kuliah atau proyek yang relevan: [ ]\n\nPENGALAMAN & PROYEK\n[Nama proyek / organisasi] - [Peran], [Periode]\n- Apa yang kamu kerjakan (gunakan kata kerja: merancang, membangun, menganalisis)\n- Hasil yang bisa diukur atau dilihat\n\nKETERAMPILAN\n[Keterampilan 1] | [Keterampilan 2] | [Keterampilan 3]\n\nSERTIFIKAT / PRESTASI (opsional)\n[ ]\n\nTips: gunakan satu halaman, bahasa jelas, dan sesuaikan isinya dengan posisi yang dilamar.\n'],
    letter: ['Template_Surat_Lamaran_ArahKarya.txt', 'TEMPLAT SURAT LAMARAN\n=====================\n\n[Kota], [Tanggal]\n\nKepada Yth.\n[Nama HRD / Tim Rekrutmen]\n[Nama Perusahaan]\n\nPerihal: Lamaran Posisi [Nama Posisi]\n\nDengan hormat,\n\nSaya [Nama Lengkap], mahasiswa/lulusan [Jurusan] di [Kampus]. Saya tertarik melamar posisi [Nama Posisi] karena [alasan spesifik yang berkaitan dengan perusahaan atau pekerjaan].\n\nSaya memiliki pengalaman [proyek / kegiatan relevan] yang melatih saya dalam [keterampilan 1] dan [keterampilan 2]. Saya ingin belajar lebih jauh dan berkontribusi pada tim melalui [hal yang bisa kamu tawarkan].\n\nTerlampir CV dan portofolio saya. Saya berharap dapat berdiskusi lebih lanjut pada waktu yang Bapak/Ibu tentukan.\n\nHormat saya,\n[Nama Lengkap]\n[Email] | [Nomor telepon]\n'],
    portfolio: ['Template_Portofolio_ArahKarya.txt', 'TEMPLAT PORTOFOLIO (per studi kasus)\n====================================\n\nJUDUL PROYEK: [ ]\nPeran: [ ]   Durasi: [ ]   Alat: [ ]\n\n1. MASALAH\nMasalah apa yang ingin dipecahkan dan untuk siapa?\n\n2. PROSES\nLangkah yang kamu ambil (riset, sketsa, percobaan). Sertakan gambar atau tangkapan layar.\n\n3. HASIL\nApa yang akhirnya kamu buat? Tunjukkan hasil akhirnya.\n\n4. DAMPAK\nBukti nyata: umpan balik, angka, atau pengamatan. Jangan mengarang angka.\n\n5. REFLEKSI\nApa yang kamu pelajari dan apa yang akan kamu perbaiki?\n\nTips: pilih 3 sampai 5 proyek terbaik dan ceritakan prosesnya, bukan hanya hasil akhirnya.\n']
  };

  function reset() { ['j-q', 'j-field', 'j-type', 'j-level'].forEach((id) => { $(id).value = ''; }); $('j-remote').checked = false; $('j-near').checked = false; render(); }

  AK.ui.onReady(function () {
    $('j-field').innerHTML = '<option value="">Semua bidang</option>' + AK.FIELDS.map((f) => '<option value="' + f.id + '">' + esc(f.name) + '</option>').join('');
    $('j-city').innerHTML = '<option value="">Pilih kota</option>' + AK.CITIES.map((c) => '<option>' + esc(c) + '</option>').join('');
    const pf = prefs(); if (pf.city) $('j-city').value = pf.city;
    const b = AK.ui.param('bidang'); if (b && AK.ui.field(b)) $('j-field').value = b;
    ['j-field', 'j-type', 'j-level', 'j-remote', 'j-near'].forEach((id) => $(id).addEventListener('change', render));
    $('j-city').addEventListener('change', () => { const p = prefs(); p.city = $('j-city').value; AK.storage.set(AK.KEYS.prefs, p); render(); });
    $('j-q').addEventListener('input', AK.ui.debounce(render, 150));
    $('job-filter').addEventListener('submit', (e) => e.preventDefault());
    $('j-reset').addEventListener('click', reset); $('j-reset2').addEventListener('click', reset);
    document.querySelectorAll('[data-tpl]').forEach((btn) => btn.addEventListener('click', () => { const t = TEMPLATES[btn.dataset.tpl]; AK.ui.download(t[0], t[1]); AK.ui.toast('Templat diunduh: ' + t[0]); }));
    render(); renderApps();
  });
})();
