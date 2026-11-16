/* ArahKarya — home.js: menampilkan tombol lanjutan di landing bila pengguna sudah punya hasil/jawaban. */
(function () {
  'use strict';
  const AK = window.AK;
  AK.ui.onReady(function () {
    const box = document.getElementById('home-resume');
    if (!box) return;
    const result = AK.ui.getResult();
    const answers = AK.storage.get(AK.KEYS.answers, null);
    const n = answers && answers.values ? Object.keys(answers.values).length : 0;
    if (result) {
      box.hidden = false;
      box.innerHTML = '<a class="btn btn-sm btn-light fw-semibold" href="hasil.html"><i class="bi bi-stars me-1" aria-hidden="true"></i>Lihat hasil tesmu</a>';
    } else if (n > 0) {
      box.hidden = false;
      box.innerHTML = '<a class="btn btn-sm btn-light fw-semibold" href="tes-minat.html"><i class="bi bi-arrow-repeat me-1" aria-hidden="true"></i>Lanjutkan tes (' + n + ' dari ' + (AK.QUESTIONS || []).length + ' terjawab)</a>';
    }
  });
})();
