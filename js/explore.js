/* ==========================================================================
   ArahKarya — explore.js
   Katalog bidang: pencarian, filter jenjang/kesulitan/durasi, pengurutan,
   detail bidang (course pemula), dan empty state. Semua berfungsi nyata.
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK; const esc = AK.ui.esc;
  const $ = (id) => document.getElementById(id);
  const LEVEL_ORDER = { Pemula: 0, Menengah: 1 };

  function filtered() {
    const q = $('f-q').value.trim().toLowerCase();
    const jenjang = $('f-jenjang').value; const level = $('f-level').value; const dur = $('f-dur').value; const sort = $('f-sort').value;
    let list = AK.FIELDS.filter((f) => {
      const hay = (f.name + ' ' + f.desc + ' ' + f.skills.join(' ') + ' ' + f.tools.join(' ')).toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (jenjang && !f.jenjang.includes(jenjang)) return false;
      if (level && f.level !== level) return false;
      if (dur === 'short' && f.minutes > 10) return false;
      if (dur === 'mid' && (f.minutes < 11 || f.minutes > 12)) return false;
      if (dur === 'long' && f.minutes <= 12) return false;
      return true;
    });
    list = list.slice().sort((a, b) => {
      if (sort === 'dur-asc') return a.minutes - b.minutes || a.name.localeCompare(b.name, 'id');
      if (sort === 'dur-desc') return b.minutes - a.minutes || a.name.localeCompare(b.name, 'id');
      if (sort === 'level') return LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.name.localeCompare(b.name, 'id');
      return a.name.localeCompare(b.name, 'id');
    });
    return list;
  }

  function card(f, recommended) {
    return '<div class="col-md-6 col-lg-4"><article class="ak-card ak-card-hover ak-field-card h-100 d-flex flex-column"><div class="ak-field-top"><div class="d-flex justify-content-between align-items-start mb-3"><span class="ak-icon-box"><i class="bi ' + f.icon + '" aria-hidden="true"></i></span>' + (recommended ? '<span class="ak-badge ak-badge-gold"><i class="bi bi-stars" aria-hidden="true"></i>Cocok untukmu</span>' : '') + '</div><h2 class="h5">' + esc(f.name) + '</h2><p class="text-muted small">' + esc(f.desc) + '</p><div class="ak-meta mb-3"><span class="ak-badge"><i class="bi bi-clock" aria-hidden="true"></i>' + f.minutes + ' menit</span><span class="ak-badge"><i class="bi bi-speedometer2" aria-hidden="true"></i>' + esc(f.level) + '</span><span class="ak-badge"><i class="bi bi-tools" aria-hidden="true"></i>' + f.skills.length + ' keterampilan</span></div></div>'
      + '<div class="p-3 pt-0 mt-auto d-flex flex-wrap gap-2"><a class="btn btn-primary btn-sm" href="simulasi.html?bidang=' + f.id + '">Mulai Simulasi</a><a class="btn btn-outline-primary btn-sm" href="jalur-karier.html?bidang=' + f.id + '">Jalur Karier</a><button class="btn btn-link btn-sm" type="button" data-detail="' + f.id + '">Detail</button></div></article></div>';
  }

  function render() {
    const list = filtered();
    const res = AK.ui.getResult();
    const topField = res ? AK.DIMS[res.topDims[0]].field : null;
    $('field-grid').innerHTML = list.map((f) => card(f, f.id === topField)).join('');
    $('field-empty').hidden = list.length > 0;
    $('f-count').textContent = list.length + ' dari ' + AK.FIELDS.length + ' bidang ditampilkan';
    document.querySelectorAll('[data-detail]').forEach((b) => b.addEventListener('click', () => detail(b.dataset.detail)));
  }

  function detail(id) {
    const f = AK.ui.field(id);
    AK.ui.modal({
      id: 'field-modal', title: f.name,
      body: '<p>' + esc(f.desc) + '</p><div class="ak-meta mb-3"><span class="ak-badge"><i class="bi bi-clock" aria-hidden="true"></i>' + f.minutes + ' menit simulasi</span><span class="ak-badge"><i class="bi bi-speedometer2" aria-hidden="true"></i>' + esc(f.level) + '</span><span class="ak-badge"><i class="bi bi-people" aria-hidden="true"></i>' + esc(f.jenjang.join(', ')) + '</span></div>'
        + '<h3 class="h6">Keterampilan</h3><ul class="ak-pill-list mb-3">' + f.skills.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>'
        + '<h3 class="h6">Alat yang biasa dipakai</h3><ul class="ak-pill-list mb-3">' + f.tools.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>'
        + '<h3 class="h6">Course pemula (urutan belajar yang disarankan)</h3><ol class="mb-0">' + f.course.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ol>',
      footer: '<a class="btn btn-outline-primary" href="jalur-karier.html?bidang=' + f.id + '">Jalur Karier</a><a class="btn btn-primary" href="simulasi.html?bidang=' + f.id + '">Mulai Simulasi</a>'
    });
  }

  function reset() {
    $('f-q').value = ''; $('f-jenjang').value = ''; $('f-level').value = ''; $('f-dur').value = ''; $('f-sort').value = 'name'; render();
  }

  AK.ui.onReady(function () {
    const q = AK.ui.param('q'); if (q) $('f-q').value = q;
    ['f-jenjang', 'f-level', 'f-dur', 'f-sort'].forEach((id) => $(id).addEventListener('change', render));
    $('f-q').addEventListener('input', AK.ui.debounce(render, 150));
    $('filter-form').addEventListener('submit', (e) => e.preventDefault());
    $('f-reset').addEventListener('click', reset); $('f-reset2').addEventListener('click', reset);
    render();
  });
})();
