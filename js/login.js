/* ==========================================================================
   ArahKarya — login.js
   Login & daftar versi DEMO: hanya memvalidasi input dan menyimpan profil
   (nama + email) di localStorage. Kata sandi TIDAK disimpan dan tidak ada
   autentikasi sungguhan.
   ========================================================================== */
(function () {
  'use strict';
  const AK = window.AK;
  const $ = (id) => document.getElementById(id);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function mark(el, ok) { el.classList.toggle('is-invalid', !ok); el.classList.toggle('is-valid', ok); return ok; }

  function safeNext() {
    const n = AK.ui.param('next');
    return n && /^[a-z0-9-]+\.html$/i.test(n) ? n : 'index.html';
  }

  function finish(name, email) {
    AK.storage.set(AK.KEYS.profile, { name: name, email: email, demo: true, createdAt: new Date().toISOString() });
    AK.ui.toast('Selamat datang, ' + name + '! ');
    setTimeout(() => (window.location.href = safeNext()), 700);
  }

  AK.ui.onReady(function () {
    // Tampilkan/sembunyikan kata sandi
    document.querySelectorAll('[data-toggle-pass]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = $(btn.dataset.togglePass);
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-pressed', show ? 'true' : 'false');
        btn.setAttribute('aria-label', (show ? 'Sembunyikan' : 'Tampilkan') + ' kata sandi');
        btn.firstElementChild.className = 'bi ' + (show ? 'bi-eye-slash' : 'bi-eye');
      });
    });

    // Masuk
    $('form-masuk').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('m-email'); const pass = $('m-pass');
      const a = mark(email, EMAIL.test(email.value.trim()));
      const b = mark(pass, pass.value.length >= 8);
      if (!(a && b)) { (a ? pass : email).focus(); return; }
      const name = email.value.trim().split('@')[0].replace(/[._-]+/g, ' ');
      finish(name.charAt(0).toUpperCase() + name.slice(1), email.value.trim());
    });

    // Daftar
    $('form-daftar').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('d-name'); const email = $('d-email'); const p1 = $('d-pass'); const p2 = $('d-pass2'); const ag = $('d-agree');
      const checks = [
        mark(name, name.value.trim().length >= 2),
        mark(email, EMAIL.test(email.value.trim())),
        mark(p1, p1.value.length >= 8),
        mark(p2, p2.value.length > 0 && p2.value === p1.value),
        mark(ag, ag.checked)
      ];
      if (p2.value.length === 0) $('d-pass2-fb').textContent = 'Konfirmasi kata sandi wajib diisi.'; else $('d-pass2-fb').textContent = 'Konfirmasi harus sama dengan kata sandi.';
      if (checks.includes(false)) { [name, email, p1, p2, ag][checks.indexOf(false)].focus(); return; }
      finish(name.value.trim(), email.value.trim());
    });

    $('forgot-btn').addEventListener('click', () => {
      AK.ui.modal({ id: 'forgot-modal', title: 'Lupa kata sandi', body: '<p>Pemulihan kata sandi memerlukan server dan layanan email, sedangkan ArahKarya versi ini belum memilikinya.</p><p class="mb-0">Di versi ini, kata sandi tidak pernah disimpan. Kamu bisa langsung masuk dengan kata sandi apa pun yang memenuhi syarat atau memilih <strong>Lanjut tanpa akun</strong>.</p>', footer: '<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Mengerti</button>' });
    });

    $('google-btn').addEventListener('click', () => AK.ui.toast('Masuk dengan Google belum tersedia. Ini hanya placeholder untuk integrasi di masa depan.', 'info'));

    // Buka tab Daftar bila diminta lewat hash
    if (window.location.hash === '#daftar' && window.bootstrap) bootstrap.Tab.getOrCreateInstance($('tab-daftar')).show();
  });
})();
