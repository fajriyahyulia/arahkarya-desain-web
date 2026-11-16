/* ==========================================================================
   ArahKarya — main.js
   Utilitas bersama: escape HTML, parameter URL, toast, modal konfirmasi,
   tema gelap/terang, dan helper lain. Dimuat di semua halaman.
   ========================================================================== */
(function () {
  'use strict';
  const AK = (window.AK = window.AK || {});
  const ui = (AK.ui = {});

  /** Escape HTML agar teks pengguna aman ditampilkan lewat innerHTML. */
  ui.esc = function (value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };
  ui.param = (name) => new URLSearchParams(window.location.search).get(name);
  ui.debounce = function (fn, ms = 200) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  ui.pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
  ui.formatDate = function (iso) {
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  ui.field = (id) => (AK.FIELDS || []).find((f) => f.id === id);

  /* ---------- Tema ---------- */
  ui.getTheme = () => AK.storage.get(AK.KEYS.theme, 'light');
  ui.applyTheme = function (theme) {
    document.documentElement.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light');
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
      btn.innerHTML = '<i class="bi ' + (theme === 'dark' ? 'bi-sun' : 'bi-moon-stars') + '" aria-hidden="true"></i>';
    }
  };
  ui.toggleTheme = function () {
    const next = ui.getTheme() === 'dark' ? 'light' : 'dark';
    AK.storage.set(AK.KEYS.theme, next);
    ui.applyTheme(next);
  };

  /* ---------- Toast ---------- */
  function toastContainer() {
    let c = document.getElementById('toast-area');
    if (!c) {
      c = document.createElement('div');
      c.id = 'toast-area';
      c.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      c.setAttribute('aria-live', 'polite');
      c.setAttribute('aria-atomic', 'true');
      document.body.appendChild(c);
    }
    return c;
  }
  /** type: success | info | danger */
  ui.toast = function (message, type = 'success') {
    const icons = { success: 'bi-check-circle-fill', info: 'bi-info-circle-fill', danger: 'bi-exclamation-triangle-fill' };
    const el = document.createElement('div');
    el.className = 'toast is-' + type;
    el.setAttribute('role', type === 'danger' ? 'alert' : 'status');
    el.innerHTML = '<div class="toast-body"><i class="bi ' + icons[type] + ' ak-toast-icon" aria-hidden="true"></i><div class="flex-grow-1">' + ui.esc(message) + '</div><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Tutup notifikasi"></button></div>';
    toastContainer().appendChild(el);
    if (window.bootstrap && bootstrap.Toast) {
      const t = new bootstrap.Toast(el, { delay: 4000 });
      el.addEventListener('hidden.bs.toast', () => el.remove());
      t.show();
    } else { el.classList.add('show'); setTimeout(() => el.remove(), 4000); }
  };

  /* ---------- Modal konfirmasi ---------- */
  ui.confirm = function ({ title, body, okText = 'Ya, lanjut', cancelText = 'Batal', danger = false, onOk }) {
    let m = document.getElementById('confirm-modal');
    if (!m) {
      m = document.createElement('div');
      m.className = 'modal fade';
      m.id = 'confirm-modal';
      m.tabIndex = -1;
      m.setAttribute('aria-labelledby', 'confirm-title');
      m.setAttribute('aria-hidden', 'true');
      m.innerHTML = '<div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h2 class="modal-title h5" id="confirm-title"></h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button></div><div class="modal-body" id="confirm-body"></div><div class="modal-footer"><button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" id="confirm-cancel"></button><button type="button" class="btn btn-primary" id="confirm-ok"></button></div></div></div>';
      document.body.appendChild(m);
    }
    m.querySelector('#confirm-title').textContent = title;
    m.querySelector('#confirm-body').innerHTML = body;
    m.querySelector('#confirm-cancel').textContent = cancelText;
    const ok = m.querySelector('#confirm-ok');
    ok.textContent = okText;
    ok.className = 'btn ' + (danger ? 'btn-danger' : 'btn-primary');
    const fresh = ok.cloneNode(true); ok.replaceWith(fresh);
    const inst = bootstrap.Modal.getOrCreateInstance(m);
    fresh.addEventListener('click', () => { inst.hide(); if (onOk) onOk(); });
    inst.show();
  };

  /** Modal informasi bebas isi (dipakai detail bidang, detail diskusi, dll.). */
  ui.modal = function ({ id, title, body, footer = '', size = '' }) {
    let m = document.getElementById(id);
    if (m) { const old = bootstrap.Modal.getInstance(m); if (old) old.dispose(); m.remove(); }
    m = document.createElement('div');
    m.className = 'modal fade'; m.id = id; m.tabIndex = -1;
    m.setAttribute('aria-labelledby', id + '-title'); m.setAttribute('aria-hidden', 'true');
    m.innerHTML = '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable ' + size + '"><div class="modal-content"><div class="modal-header"><h2 class="modal-title h5" id="' + id + '-title">' + ui.esc(title) + '</h2><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button></div><div class="modal-body">' + body + '</div>' + (footer ? '<div class="modal-footer">' + footer + '</div>' : '') + '</div></div>';
    document.body.appendChild(m);
    const inst = new bootstrap.Modal(m);
    m.addEventListener('hidden.bs.modal', () => { inst.dispose(); m.remove(); });
    inst.show();
    return m;
  };

  /** Membuat berkas teks untuk diunduh (templat CV, dll.). */
  ui.download = function (filename, text, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob(['﻿' + text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };

  /** Hasil tes tersimpan (atau null). */
  ui.getResult = () => AK.storage.get(AK.KEYS.result, null);
  ui.getProfile = () => AK.storage.get(AK.KEYS.profile, null);

  /** Hitung hasil tes dari jawaban {indexPertanyaan: indexOpsi}. Transparan, tanpa angka acak. */
  ui.computeResult = function (answers) {
    const dims = Object.keys(AK.DIMS);
    const appear = {}; const points = {};
    dims.forEach((d) => { appear[d] = 0; points[d] = 0; });
    AK.QUESTIONS.forEach((qq, i) => {
      qq.options.forEach((o) => { appear[o.dim] += 1; });
      const a = answers[i];
      if (a !== undefined && qq.options[a]) points[qq.options[a].dim] += 1;
    });
    const profile = {};
    dims.forEach((d) => { profile[d] = appear[d] ? Math.round((points[d] / appear[d]) * 100) : 0; });
    // Kemiripan kosinus antara profil pengguna dan bobot jurusan
    const norm = (v) => Math.sqrt(Object.values(v).reduce((s, x) => s + x * x, 0));
    const nu = norm(profile) || 1;
    const majors = AK.MAJORS.map((m) => {
      const dot = dims.reduce((s, d) => s + (profile[d] || 0) * (m.w[d] || 0), 0);
      const score = Math.round((dot / (nu * (norm(m.w) || 1))) * 100);
      return { id: m.id, score };
    }).sort((a, b) => b.score - a.score);
    const topDims = dims.slice().sort((a, b) => profile[b] - profile[a] || a.localeCompare(b));
    return { profile, topDims, majors, answeredAt: new Date().toISOString(), version: 1 };
  };

  /* ---------- Inisialisasi umum ---------- */
  ui.onReady = (fn) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());

  ui.onReady(function () {
    ui.applyTheme(ui.getTheme());
    const main = document.getElementById('main');
    if (main) main.classList.add('fade-in-up');
    if (!AK.storage.available) {
      ui.toast('Penyimpanan lokal browser tidak tersedia. Data hanya bertahan selama halaman terbuka.', 'info');
    }
  });
})();
