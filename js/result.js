/* ==========================================================================
   ArahKarya — result.js
   Halaman hasil: profil minat, rekomendasi jurusan + alasan, rekomendasi
   karier, perbandingan jurusan, simpan rekomendasi, dan langkah berikutnya.
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK; const esc = AK.ui.esc;
  const major = (id) => AK.MAJORS.find((m) => m.id === id);
  const dimLabel = (d) => AK.DIMS[d].label;
  let result = null;

  function appearCount(d) { let n = 0; AK.QUESTIONS.forEach((q) => q.options.forEach((o) => { if (o.dim === d) n++; })); return n; }
  function chosenCount(d) { let n = 0; AK.QUESTIONS.forEach((q, i) => { const a = result.answers && result.answers[i]; if (a !== undefined && q.options[a] && q.options[a].dim === d) n++; }); return n; }

  function reasonFor(m) {
    const heavy = Object.keys(m.w).sort((a, b) => m.w[b] - m.w[a]).slice(0, 2);
    const parts = heavy.map((d) => dimLabel(d) + ' (' + result.profile[d] + '%)');
    const picks = heavy.map((d) => chosenCount(d) + ' dari ' + appearCount(d) + ' pilihan bertema ' + dimLabel(d));
    return 'Inti ' + m.name + ' adalah ' + heavy.map(dimLabel).join(' dan ') + '. Skormu di sana: ' + parts.map((x) => x.replace(/^.*\(/, '').replace(')', '')).join(' dan ') + '. Kamu memilih ' + picks.join(' serta ') + '.';
  }

  function savedList() { return AK.storage.get(AK.KEYS.saved, []); }
  function isSaved(id) { return savedList().some((s) => s.id === id); }
  function toggleSave(id) {
    const list = savedList(); const m = major(id);
    const idx = list.findIndex((s) => s.id === id);
    if (idx >= 0) { list.splice(idx, 1); AK.ui.toast('Rekomendasi dihapus dari daftar tersimpan.', 'info'); }
    else { const sc = result.majors.find((x) => x.id === id).score; list.push({ id: id, type: 'jurusan', name: m.name, score: sc, savedAt: new Date().toISOString() }); AK.ui.toast(m.name + ' disimpan ke rekomendasimu.'); }
    AK.storage.set(AK.KEYS.saved, list);
  }

  function emptyState(root) {
    root.innerHTML = '<div class="ak-empty"><i class="bi bi-clipboard2-pulse ak-empty-icon" aria-hidden="true"></i><h2 class="h4 mt-3">Kamu belum menyelesaikan tes</h2><p class="text-muted mx-auto" style="max-width:46ch">Hasil dan rekomendasi muncul setelah kamu menjawab 12 pertanyaan tes minat. Hanya sekitar 8 menit.</p><a class="btn btn-primary btn-lg" href="tes-minat.html">Mulai Tes Minat</a></div>';
  }

  function compareTable(aId, bId) {
    const rows = [aId, bId].map((id) => { const m = major(id); const sc = result.majors.find((x) => x.id === id).score; return { m, sc }; });
    const f = (m) => AK.ui.field(m.field);
    const cell = (fn) => rows.map((r) => '<td data-label="' + esc(r.m.name) + '">' + fn(r) + '</td>').join('');
    return '<div class="table-responsive"><table class="table ak-table ak-table-stack align-middle mb-0"><thead><tr><th scope="col">Aspek</th>' + rows.map((r) => '<th scope="col">' + esc(r.m.name) + '</th>').join('') + '</tr></thead><tbody>'
      + '<tr><th scope="row">Kecocokan denganmu</th>' + cell((r) => '<span class="ak-match">' + r.sc + '</span> / 100') + '</tr>'
      + '<tr><th scope="row">Profil minat inti</th>' + cell((r) => Object.keys(r.m.w).sort((a, b) => r.m.w[b] - r.m.w[a]).slice(0, 2).map(dimLabel).join(', ')) + '</tr>'
      + '<tr><th scope="row">Keterampilan utama</th>' + cell((r) => r.m.skills.join(', ')) + '</tr>'
      + '<tr><th scope="row">Karier terkait</th>' + cell((r) => r.m.careers.join(', ')) + '</tr>'
      + '<tr><th scope="row">Coba lebih dulu</th>' + cell((r) => '<a href="simulasi.html?bidang=' + f(r.m).id + '">Simulasi ' + esc(f(r.m).name) + '</a>') + '</tr>'
      + '</tbody></table></div>';
  }

  function render() {
    const root = document.getElementById('result-root');
    result = AK.ui.getResult();
    if (!result) { emptyState(root); return; }
    const dims = result.topDims;
    const topField = AK.DIMS[dims[0]].field;
    const top3 = result.majors.slice(0, 3);
    const careers = []; top3.forEach((r) => major(r.id).careers.forEach((c) => { if (!careers.some((x) => x.c === c)) careers.push({ c: c, from: major(r.id).name, field: major(r.id).field }); }));
    const d = new Date(result.answeredAt);
    const when = isNaN(d) ? '' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let html = '';
    // Ringkasan
    html += '<section class="ak-card p-4 mb-4" aria-labelledby="sum-h"><div class="row g-3 align-items-center"><div class="col-lg-8"><h2 id="sum-h" class="h4">Ringkasan hasil tes</h2><p class="mb-2">Kecenderungan minat terkuatmu: <strong>' + esc(dimLabel(dims[0])) + '</strong>, diikuti <strong>' + esc(dimLabel(dims[1])) + '</strong> dan <strong>' + esc(dimLabel(dims[2])) + '</strong>.</p><p class="small text-muted mb-0">Diselesaikan ' + esc(when) + ' · ' + AK.QUESTIONS.length + ' dari ' + AK.QUESTIONS.length + ' pertanyaan terjawab. Hasil ini panduan awal untuk eksplorasi, <strong>bukan keputusan mutlak</strong> dan bukan diagnosis psikologis.</p></div><div class="col-lg-4 d-flex flex-wrap gap-2 justify-content-lg-end"><a class="btn btn-outline-primary" href="tes-minat.html"><i class="bi bi-arrow-repeat me-1" aria-hidden="true"></i>Ulangi tes</a></div></div></section>';

    // Profil + keterampilan menonjol
    html += '<div class="row g-4 mb-4"><div class="col-lg-6"><section class="ak-card p-4 h-100" aria-labelledby="prof-h"><h2 id="prof-h" class="h5 mb-3">Profil kecenderungan minat</h2>'
      + dims.map((dd) => '<div class="ak-score-row"><div class="d-flex justify-content-between small fw-semibold mb-1"><span><i class="bi ' + AK.DIMS[dd].icon + ' me-1" aria-hidden="true"></i>' + esc(dimLabel(dd)) + '</span><span>' + result.profile[dd] + '%</span></div><div class="progress" role="progressbar" aria-label="' + esc(dimLabel(dd)) + ' ' + result.profile[dd] + ' persen" aria-valuenow="' + result.profile[dd] + '" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:' + result.profile[dd] + '%"></div></div></div>').join('')
      + '</section></div><div class="col-lg-6"><section class="ak-card p-4 h-100" aria-labelledby="skill-h"><h2 id="skill-h" class="h5 mb-3">Keterampilan yang menonjol</h2><p class="small text-muted">Dari tiga dimensi minat terkuatmu:</p>'
      + dims.slice(0, 3).map((dd) => { const f = AK.ui.field(AK.DIMS[dd].field); return '<div class="mb-3"><div class="fw-semibold small mb-1">' + esc(dimLabel(dd)) + '</div><ul class="ak-pill-list">' + f.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul></div>'; }).join('')
      + '</section></div></div>';

    // Rekomendasi jurusan
    html += '<section class="mb-4" aria-labelledby="rec-h"><div class="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3"><h2 id="rec-h" class="h4 mb-0">Rekomendasi jurusan</h2></div><div class="row g-3">'
      + top3.map((r, i) => { const m = major(r.id); const sv = isSaved(m.id);
        return '<div class="col-lg-4"><article class="ak-card p-4 h-100 d-flex flex-column"><div class="d-flex justify-content-between align-items-start mb-2"><span class="ak-step-num">' + (i + 1) + '</span><div class="text-end"><div class="fs-3 fw-bold ak-match">' + r.score + '</div><div class="small text-muted">tingkat kecocokan / 100</div></div></div>'
          + '<h3 class="h5">' + esc(m.name) + '</h3><p class="small text-muted">' + esc(reasonFor(m)) + '</p>'
          + '<div class="small fw-semibold mb-1">Keterampilan relevan</div><ul class="ak-pill-list mb-3">' + m.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>'
          + '<p class="small text-muted mb-3 mt-auto">Sumber: ' + esc(AK.DATA_SOURCE) + ' · Diperbarui ' + esc(AK.DATA_UPDATED) + '.</p>'
          + '<div class="d-flex flex-wrap gap-2"><button class="btn btn-sm ' + (sv ? 'btn-primary' : 'btn-outline-primary') + '" type="button" data-save="' + m.id + '" aria-pressed="' + sv + '"><i class="bi ' + (sv ? 'bi-bookmark-check-fill' : 'bi-bookmark') + ' me-1" aria-hidden="true"></i>' + (sv ? 'Tersimpan' : 'Simpan Rekomendasi') + '</button><button class="btn btn-sm btn-outline-primary" type="button" data-compare="' + m.id + '"><i class="bi bi-columns-gap me-1" aria-hidden="true"></i>Bandingkan</button><a class="btn btn-sm btn-outline-primary" href="jalur-karier.html?bidang=' + m.field + '">Jalur karier</a></div></article></div>'; }).join('')
      + '</div></section>';

    // Rekomendasi karier
    html += '<section class="ak-card p-4 mb-4" aria-labelledby="car-h"><h2 id="car-h" class="h4 mb-3">Rekomendasi karier</h2><div class="row g-3">'
      + careers.slice(0, 6).map((c) => '<div class="col-sm-6 col-lg-4"><div class="d-flex gap-3 align-items-start"><span class="ak-icon-box ak-icon-box-gold"><i class="bi bi-briefcase" aria-hidden="true"></i></span><div><div class="fw-semibold">' + esc(c.c) + '</div><div class="small text-muted">Dari jurusan ' + esc(c.from) + '</div><a class="small" href="jalur-karier.html?bidang=' + c.field + '">Lihat jalurnya</a></div></div></div>').join('')
      + '</div><p class="small text-muted mt-3 mb-0">Informasi gaji dan prospek tidak ditampilkan karena belum ada sumber resmi yang terverifikasi.</p></section>';

    // Keterampilan yang perlu dikembangkan
    const tf = AK.ui.field(topField);
    html += '<section class="ak-card-soft p-4 mb-4" aria-labelledby="dev-h"><h2 id="dev-h" class="h5">Keterampilan yang perlu dikembangkan</h2><p class="mb-2">Jika tertarik pada bidang <strong>' + esc(tf.name) + '</strong>, mulai latih:</p><ul class="ak-pill-list">' + tf.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul></section>';

    // Perbandingan
    const opts = (sel) => AK.MAJORS.map((m) => '<option value="' + m.id + '"' + (m.id === sel ? ' selected' : '') + '>' + esc(m.name) + '</option>').join('');
    html += '<section class="ak-card p-4 mb-4" id="bandingkan" aria-labelledby="cmp-h"><h2 id="cmp-h" class="h4 mb-3">Bandingkan jurusan</h2><div class="row g-3 mb-3"><div class="col-md-6"><label for="cmp-a" class="form-label">Jurusan A</label><select class="form-select" id="cmp-a">' + opts(top3[0].id) + '</select></div><div class="col-md-6"><label for="cmp-b" class="form-label">Jurusan B</label><select class="form-select" id="cmp-b">' + opts(top3[1].id) + '</select></div></div><div id="cmp-out" aria-live="polite"></div></section>';

    // Langkah berikutnya
    html += '<section class="ak-hero p-4 p-lg-5 mb-2" aria-labelledby="next-h"><h2 id="next-h" class="h4 text-white mb-2">Langkah eksplorasi berikutnya</h2><p class="mb-4" style="color:#DCE7F8">Cobalah bidang ' + esc(tf.name) + ' lewat simulasi, lalu susun rencana belajarmu.</p><div class="d-flex flex-wrap gap-2 ak-btn-stack-mobile"><a class="btn btn-gold" href="simulasi.html?bidang=' + topField + '"><i class="bi bi-lightning-charge me-1" aria-hidden="true"></i>Coba Simulasi</a><a class="btn btn-gold" href="rencana-belajar.html?bidang=' + topField + '"><i class="bi bi-calendar-check me-1" aria-hidden="true"></i>Buat Rencana 30 Hari</a><a class="btn btn-outline-light-ak" href="komunitas.html#konsultasi"><i class="bi bi-chat-dots me-1" aria-hidden="true"></i>Tanya Konselor</a><a class="btn btn-outline-light-ak" href="magang.html?bidang=' + topField + '"><i class="bi bi-briefcase me-1" aria-hidden="true"></i>Cari Magang</a></div></section>';

    root.innerHTML = html;

    const upd = () => { document.getElementById('cmp-out').innerHTML = compareTable(document.getElementById('cmp-a').value, document.getElementById('cmp-b').value); };
    document.getElementById('cmp-a').addEventListener('change', upd);
    document.getElementById('cmp-b').addEventListener('change', upd);
    upd();

    root.querySelectorAll('[data-save]').forEach((b) => b.addEventListener('click', () => { toggleSave(b.dataset.save); render(); }));
    root.querySelectorAll('[data-compare]').forEach((b) => b.addEventListener('click', () => {
      const a = document.getElementById('cmp-a'); const bb = document.getElementById('cmp-b');
      if (a.value === b.dataset.compare) { /* sudah dipilih */ } else if (bb.value === b.dataset.compare) { /* sudah */ } else { bb.value = b.dataset.compare; }
      upd(); document.getElementById('bandingkan').scrollIntoView({ behavior: 'smooth', block: 'start' });
      AK.ui.toast('Jurusan ditambahkan ke tabel perbandingan.', 'info');
    }));
  }

  AK.ui.onReady(render);
})();
