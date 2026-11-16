/* ==========================================================================
   ArahKarya — navigation.js
   Membuat navbar (desktop + offcanvas mobile) dan footer yang konsisten
   di seluruh halaman, serta menandai menu aktif.
   ========================================================================== */
(function () {
  'use strict';
  const AK = (window.AK = window.AK || {});
  const esc = (s) => AK.ui.esc(s);

  const MENU = [
    { id: 'beranda', label: 'Beranda', href: 'index.html' },
    { id: 'tes', label: 'Tes Minat', href: 'tes-minat.html' },
    { id: 'jelajahi', label: 'Jelajahi Bidang', href: 'jelajahi.html' },
    { id: 'rencana', label: 'Rencana Saya', href: 'rencana-belajar.html' },
    { id: 'komunitas', label: 'Komunitas', href: 'komunitas.html' },
    { id: 'magang', label: 'Magang & Lowongan', href: 'magang.html' }
  ];
  // Halaman lanjutan dipetakan ke menu induknya
  const PARENT = { login: '', hasil: 'tes', simulasi: 'jelajahi', jalur: 'jelajahi' };

  function navHtml(page) {
    const active = PARENT[page] !== undefined ? PARENT[page] : page;
    const profile = AK.ui.getProfile();
    const items = MENU.map((m) => {
      const cur = m.id === active;
      return '<li class="nav-item"><a class="nav-link' + (cur ? ' active' : '') + '" href="' + m.href + '"' + (cur ? ' aria-current="page"' : '') + '>' + esc(m.label) + '</a></li>';
    }).join('');
    const account = profile
      ? '<div class="dropdown"><button class="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="account-btn"><i class="bi bi-person-circle" aria-hidden="true"></i><span class="text-truncate" style="max-width:110px">' + esc(profile.name) + '</span></button>'
        + '<ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="hasil.html"><i class="bi bi-stars me-2" aria-hidden="true"></i>Hasil saya</a></li><li><a class="dropdown-item" href="rencana-belajar.html"><i class="bi bi-calendar-check me-2" aria-hidden="true"></i>Rencana saya</a></li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item" type="button" id="logout-btn"><i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Keluar</button></li></ul></div>'
      : '<a class="btn btn-primary" href="login.html" id="login-link"><i class="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>Masuk</a>';
    return '<a class="skip-link" href="#main">Lewati ke konten utama</a>'
      + '<nav class="navbar navbar-expand-lg ak-navbar sticky-top" aria-label="Navigasi utama"><div class="container">'
      + '<a class="navbar-brand" href="index.html" aria-label="ArahKarya, ke beranda"><img class="ak-brand-logo" src="assets/logo/arahkarya-logo.png" alt="ArahKarya" width="160" height="44"></a>'
      + '<div class="d-flex align-items-center gap-2 order-lg-3"><button class="ak-icon-btn" type="button" id="theme-toggle" aria-pressed="false" aria-label="Ganti tema"><i class="bi bi-moon-stars" aria-hidden="true"></i></button>'
      + '<div class="d-none d-lg-block">' + account + '</div>'
      + '<button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mainMenu" aria-controls="mainMenu" aria-label="Buka menu"><i class="bi bi-list fs-4" aria-hidden="true"></i></button></div>'
      + '<div class="offcanvas offcanvas-end" tabindex="-1" id="mainMenu" aria-labelledby="mainMenuLabel"><div class="offcanvas-header"><h2 class="offcanvas-title h5" id="mainMenuLabel">Menu</h2><button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Tutup menu"></button></div>'
      + '<div class="offcanvas-body"><ul class="navbar-nav mx-lg-auto gap-lg-1">' + items + '</ul><div class="d-lg-none mt-3 pt-3 border-top">' + account.replace('id="account-btn"', '').replace('id="logout-btn"', 'id="logout-btn-m"').replace('id="login-link"', 'id="login-link-m"') + '</div></div></div>'
      + '</div></nav>';
  }

  function footerHtml() {
    return '<footer class="ak-footer"><div class="container py-5"><div class="row g-4">'
      + '<div class="col-lg-5"><img class="ak-footer-logo mb-3" src="assets/logo/arahkarya-logo.png" alt="ArahKarya" width="160" height="44"><p class="mb-2">Kenali Diri, Rancang Masa Depanmu.</p><p class="small mb-0">Platform eksplorasi pendidikan, minat, bakat, keterampilan, dan karier. Proyek mata kuliah Desain Web, PTIK UNS.</p></div>'
      + '<div class="col-6 col-lg-3"><h2>Jelajahi</h2><ul class="list-unstyled mb-0 d-grid gap-2"><li><a href="tes-minat.html">Tes Minat</a></li><li><a href="hasil.html">Hasil & Rekomendasi</a></li><li><a href="jelajahi.html">Jelajahi Bidang</a></li><li><a href="simulasi.html">Simulasi Tugas</a></li><li><a href="jalur-karier.html">Jalur Karier</a></li></ul></div>'
      + '<div class="col-6 col-lg-4"><h2>Lanjutkan</h2><ul class="list-unstyled mb-0 d-grid gap-2"><li><a href="rencana-belajar.html">Rencana Belajar 30 Hari</a></li><li><a href="komunitas.html">Konsultasi & Forum</a></li><li><a href="magang.html">Magang & Lowongan</a></li><li><a href="login.html">Masuk / Daftar</a></li></ul></div>'
      + '</div><hr class="my-4"><div class="d-flex flex-column flex-md-row justify-content-between gap-3 small"><span>Tes bukan diagnosis psikologis.</span>'
      + '<button type="button" class="btn btn-sm btn-outline-light-ak align-self-start" id="reset-demo"><i class="bi bi-arrow-counterclockwise me-1" aria-hidden="true"></i>Reset data</button></div></div></footer>';
  }

  AK.ui.onReady(function () {
    const page = document.body.dataset.page || '';
    const nav = document.getElementById('site-nav');
    const foot = document.getElementById('site-footer');
    if (nav) nav.innerHTML = navHtml(page);
    if (foot) foot.innerHTML = footerHtml();
    AK.ui.applyTheme(AK.ui.getTheme());

    const tt = document.getElementById('theme-toggle');
    if (tt) tt.addEventListener('click', AK.ui.toggleTheme);

    function logout() {
      AK.ui.confirm({ title: 'Keluar dari akun?', body: 'Profil di perangkat ini akan dihapus. Hasil tes dan rencana belajarmu tetap tersimpan.', okText: 'Keluar', onOk: function () { AK.storage.remove(AK.KEYS.profile); AK.ui.toast('Kamu telah keluar dari akun.', 'info'); setTimeout(() => (window.location.href = 'index.html'), 600); } });
    }
    ['logout-btn', 'logout-btn-m'].forEach((id) => { const b = document.getElementById(id); if (b) b.addEventListener('click', logout); });

    const reset = document.getElementById('reset-demo');
    if (reset) reset.addEventListener('click', function () {
      AK.ui.confirm({ title: 'Reset semua data?', body: 'Jawaban tes, hasil, progres simulasi, rencana belajar, rekomendasi tersimpan, pelacakan lamaran, dan profil akan dihapus dari perangkat ini. Tindakan ini tidak bisa dibatalkan.', okText: 'Ya, hapus semua', danger: true, onOk: function () { AK.storage.resetAll(); AK.ui.toast('Data telah dihapus.'); setTimeout(() => (window.location.href = 'index.html'), 700); } });
    });
  });
})();
