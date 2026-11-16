/* ==========================================================================
   ArahKarya — career.js
   Roadmap karier 4 tahap, jurusan terkait + relevansi, keterampilan, tools,
   aktivitas, peluang magang, dan tombol tindak lanjut.
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK; const esc = AK.ui.esc;
  const $ = (id) => document.getElementById(id);
  let fieldId = 'desain-grafis';
  const REL = { Tinggi: 'ak-badge-ok', Sedang: 'ak-badge', Rendah: 'ak-badge-gold' };
  const ICONS = ['bi-mortarboard', 'bi-tools', 'bi-rocket-takeoff', 'bi-graph-up-arrow'];

  function render() {
    const f = AK.ui.field(fieldId); const c = AK.CAREERS[fieldId];
    $('car-title').textContent = 'Jalur Karier: ' + c.title;
    const jobs = AK.JOBS.filter((j) => j.field === fieldId).slice(0, 3);
    let html = '';
    html += '<div class="d-flex flex-wrap gap-2 mb-4 ak-btn-stack-mobile"><a class="btn btn-primary" href="simulasi.html?bidang=' + f.id + '"><i class="bi bi-lightning-charge me-1" aria-hidden="true"></i>Coba Simulasi</a><a class="btn btn-outline-primary" href="komunitas.html?q=' + encodeURIComponent(f.name) + '"><i class="bi bi-people me-1" aria-hidden="true"></i>Diskusi dengan Komunitas</a><a class="btn btn-outline-primary" href="hasil.html#bandingkan"><i class="bi bi-columns-gap me-1" aria-hidden="true"></i>Bandingkan Jurusan</a><a class="btn btn-outline-primary" href="rencana-belajar.html"><i class="bi bi-calendar-check me-1" aria-hidden="true"></i>Lihat Rencana Belajar</a><a class="btn btn-outline-primary" href="magang.html?bidang=' + f.id + '"><i class="bi bi-briefcase me-1" aria-hidden="true"></i>Lihat Lowongan</a></div>';
    html += '<section aria-labelledby="road-h" class="mb-4"><h2 id="road-h" class="h4 mb-3">Empat tahap perjalanan</h2><div class="ak-roadmap">' + c.stages.map((s, i) => '<div><div class="ak-card ak-road-step"><span class="ak-step-num">' + (i + 1) + '</span><h3 class="h6"><i class="bi ' + ICONS[i] + ' me-1" aria-hidden="true"></i>' + esc(s.t) + '</h3><ul class="small text-muted ps-3 mb-0">' + s.items.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>').join('') + '</div></section>';
    html += '<div class="row g-4 mb-4"><div class="col-lg-6"><section class="ak-card p-4 h-100" aria-labelledby="maj-h"><h2 id="maj-h" class="h5 mb-3">Jurusan terkait</h2><ul class="list-unstyled d-grid gap-2 mb-3">' + c.majors.map((m) => '<li class="d-flex justify-content-between align-items-center gap-2"><span class="fw-semibold">' + esc(m[0]) + '</span><span class="ak-badge ' + REL[m[1]] + '">Relevansi ' + esc(m[1].toLowerCase()) + '</span></li>').join('') + '</ul><a href="hasil.html#bandingkan">Bandingkan jurusan</a></section></div>'
      + '<div class="col-lg-6"><section class="ak-card p-4 h-100" aria-labelledby="skl-h"><h2 id="skl-h" class="h5 mb-3">Keterampilan utama</h2><ul class="ak-pill-list mb-3">' + f.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul><h3 class="h6">Alat yang digunakan</h3><ul class="ak-pill-list mb-0">' + f.tools.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul></section></div></div>';
    html += '<div class="row g-4 mb-4"><div class="col-lg-6"><section class="ak-card p-4 h-100" aria-labelledby="act-h"><h2 id="act-h" class="h5 mb-3">Gambaran aktivitas pekerjaan</h2><ul class="mb-0 d-grid gap-2">' + c.activities.map((a) => '<li>' + esc(a) + '</li>').join('') + '</ul></section></div>'
      + '<div class="col-lg-6"><section class="ak-card p-4 h-100" aria-labelledby="opp-h"><div class="d-flex justify-content-between align-items-start"><h2 id="opp-h" class="h5 mb-3">Peluang magang</h2></div>' + (jobs.length ? '<ul class="list-unstyled d-grid gap-2 mb-3">' + jobs.map((j) => '<li><div class="fw-semibold">' + esc(j.title) + '</div><div class="small text-muted">' + esc(j.company) + ' · ' + esc(j.city) + ' · ' + esc(j.mode) + '</div></li>').join('') + '</ul>' : '<p class="text-muted">Belum ada lowongan untuk bidang ini.</p>') + '<a href="magang.html?bidang=' + f.id + '">Lihat semua lowongan</a></section></div></div>';
    html += '<section class="ak-card-soft p-4 mb-4" aria-labelledby="grow-h"><h2 id="grow-h" class="h5">Perkembangan karier</h2><p class="mb-0">' + c.stages.slice(2).map((s) => esc(s.items.join(', '))).join(' → ') + '. Gaji dan prospek tidak ditampilkan karena belum ada sumber resmi yang bisa diverifikasi. Cek data terbaru ke sumber resmi sebelum mengambil keputusan.</p></section>';
    html += '<section class="ak-hero p-4 p-lg-5" aria-labelledby="go-h"><div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3"><div><h2 id="go-h" class="h4 text-white mb-1">Siap mencoba bidang ini?</h2><p class="mb-0" style="color:#DCE7F8">Ubah rasa penasaran menjadi rencana 30 hari.</p></div><a class="btn btn-gold btn-lg" href="rencana-belajar.html?bidang=' + f.id + '">Buat Rencana Belajar</a></div></section>';
    $('career-root').innerHTML = html;
  }

  AK.ui.onReady(function () {
    $('car-field').innerHTML = AK.FIELDS.map((f) => '<option value="' + f.id + '">' + esc(f.name) + '</option>').join('');
    const set = (id, push) => { fieldId = AK.CAREERS[id] ? id : 'desain-grafis'; $('car-field').value = fieldId; if (push) history.replaceState(null, '', 'jalur-karier.html?bidang=' + fieldId); render(); };
    $('car-field').addEventListener('change', () => set($('car-field').value, true));
    set(AK.ui.param('bidang') || 'desain-grafis', false);
  });
})();
