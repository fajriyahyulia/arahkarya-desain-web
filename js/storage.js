/* ==========================================================================
   ArahKarya — storage.js
   Pembungkus localStorage yang aman: JSON.parse/stringify dengan try/catch,
   fallback memori bila localStorage diblokir, dan reset data demonstrasi.
   Catatan: localStorage BUKAN database dan BUKAN autentikasi. Jangan simpan
   password di sini.
   ========================================================================== */
(function () {
  'use strict';
  const AK = (window.AK = window.AK || {});

  AK.KEYS = {
    theme: 'arahkarya_theme',
    answers: 'arahkarya_test_answers',
    result: 'arahkarya_test_result',
    sim: 'arahkarya_simulation_progress',
    plan: 'arahkarya_learning_plan',
    saved: 'arahkarya_saved_recommendations',
    apps: 'arahkarya_applications',
    profile: 'arahkarya_profile',
    questions: 'arahkarya_my_questions',
    consult: 'arahkarya_consultations',
    prefs: 'arahkarya_preferences'
  };

  const memory = {};
  let canUse = false;
  try {
    const t = '__arahkarya_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    canUse = true;
  } catch (e) { canUse = false; }

  AK.storage = {
    available: canUse,
    /** Ambil nilai (sudah di-parse). Mengembalikan fallback jika kosong/rusak. */
    get(key, fallback = null) {
      try {
        const raw = canUse ? window.localStorage.getItem(key) : memory[key];
        if (raw === null || raw === undefined || raw === '') return fallback;
        return JSON.parse(raw);
      } catch (e) {
        // Data rusak: buang agar tidak merusak halaman
        this.remove(key);
        return fallback;
      }
    },
    /** Simpan nilai. Mengembalikan true bila berhasil. */
    set(key, value) {
      try {
        const raw = JSON.stringify(value);
        if (canUse) window.localStorage.setItem(key, raw); else memory[key] = raw;
        return true;
      } catch (e) { return false; }
    },
    remove(key) {
      try { if (canUse) window.localStorage.removeItem(key); else delete memory[key]; } catch (e) { /* abaikan */ }
    },
    /** Perbarui objek: this.update(key, obj => {...}, fallback) */
    update(key, fn, fallback = {}) {
      const cur = this.get(key, fallback);
      const next = fn(cur) ?? cur;
      this.set(key, next);
      return next;
    },
    /** Hapus semua data ArahKarya (reset data demonstrasi). Tema ikut dihapus. */
    resetAll() {
      Object.values(AK.KEYS).forEach((k) => this.remove(k));
    }
  };
})();
