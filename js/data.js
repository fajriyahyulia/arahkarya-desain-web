/* ==========================================================================
   ArahKarya — data.js
   Data konten. SEMUA data lowongan, forum, dan konsultan adalah DEMONSTRASI.
   Informasi jurusan/karier bersifat panduan umum, bukan data resmi.
   ========================================================================== */
(function () {
  'use strict';
  const AK = (window.AK = window.AK || {});

  AK.DATA_UPDATED = '15 November 2026';
  AK.DATA_SOURCE = 'Ringkasan internal tim ArahKarya . Verifikasi ke situs resmi kampus dan PDDikti sebelum mengambil keputusan.';

  /* ---------- Dimensi minat ---------- */
  AK.DIMS = {
    DES: { label: 'Kreatif & Desain', icon: 'bi-palette', field: 'desain-grafis' },
    TEK: { label: 'Teknologi & Logika', icon: 'bi-cpu', field: 'pengembangan-web' },
    BIS: { label: 'Bisnis & Strategi', icon: 'bi-graph-up-arrow', field: 'analisis-bisnis' },
    KOM: { label: 'Komunikasi & Konten', icon: 'bi-chat-square-text', field: 'konten-komunikasi' },
    DAT: { label: 'Data & Riset', icon: 'bi-bar-chart-line', field: 'analisis-data' },
    SOS: { label: 'Kesehatan & Sosial', icon: 'bi-heart-pulse', field: 'studi-kasus-kesehatan' }
  };

  /* ---------- Tes minat: 12 pertanyaan x 4 pilihan. Tiap pilihan = 1 poin untuk 1 dimensi ---------- */
  const q = (text, opts) => ({ text, options: opts.map(([t, d]) => ({ text: t, dim: d })) });
  AK.QUESTIONS = [
    q('Aktivitas mana yang paling kamu nikmati di waktu luang?', [['Merancang tampilan atau membuat karya visual', 'DES'], ['Membongkar cara kerja aplikasi atau perangkat', 'TEK'], ['Menulis, berbicara, atau membuat konten', 'KOM'], ['Membantu atau merawat orang lain', 'SOS']]),
    q('Dalam kerja kelompok, peran apa yang biasanya kamu ambil?', [['Pencetus ide tampilan dan gaya', 'DES'], ['Penyusun rencana dan pembagi tugas', 'BIS'], ['Pengumpul dan pemeriksa data atau fakta', 'DAT'], ['Penengah yang mendengarkan semua pihak', 'SOS']]),
    q('Jenis tugas sekolah atau kuliah mana yang paling kamu sukai?', [['Soal logika atau pemrograman', 'TEK'], ['Presentasi atau esai', 'KOM'], ['Penelitian dengan tabel dan grafik', 'DAT'], ['Proyek simulasi usaha', 'BIS']]),
    q('Kapan kamu merasa paling bangga?', [['Saat karyaku terlihat indah dan orisinal', 'DES'], ['Saat masalah teknis rumit akhirnya terpecahkan', 'TEK'], ['Saat orang lain terbantu olehku', 'SOS'], ['Saat idenya benar-benar berjalan dan menghasilkan', 'BIS']]),
    q('Konten apa yang paling sering kamu cari atau tonton?', [['Desain, ilustrasi, dan video kreatif', 'DES'], ['Infografik dan analisis data', 'DAT'], ['Artikel, podcast, dan cerita', 'KOM'], ['Tutorial teknologi dan pemrograman', 'TEK']]),
    q('Ketika menghadapi masalah, kamu cenderung…', [['Mencari data untuk menemukan penyebabnya', 'DAT'], ['Membuat beberapa sketsa solusi', 'DES'], ['Menanyakan kondisi orang-orang yang terdampak', 'SOS'], ['Menghitung biaya dan manfaat tiap pilihan', 'BIS']]),
    q('Cara belajar mana yang paling nyaman bagimu?', [['Melihat contoh visual lalu mencoba sendiri', 'DES'], ['Langsung mengutak-atik sampai berhasil', 'TEK'], ['Berdiskusi dan menjelaskan ke orang lain', 'KOM'], ['Membaca ringkasan yang penuh angka dan fakta', 'DAT']]),
    q('Lingkungan kerja seperti apa yang kamu bayangkan?', [['Studio kreatif atau agensi desain', 'DES'], ['Tim pengembang teknologi', 'TEK'], ['Layanan kesehatan, sekolah, atau lembaga sosial', 'SOS'], ['Perusahaan atau usaha rintisan sendiri', 'BIS']]),
    q('Kegiatan ekstrakurikuler yang paling menarik bagimu?', [['Jurnalistik, MC, atau debat', 'KOM'], ['PMR atau kegiatan relawan', 'SOS'], ['Robotika atau komputer', 'TEK'], ['Seni, fotografi, atau multimedia', 'DES']]),
    q('Kemampuan apa yang paling ingin kamu kembangkan?', [['Kepemimpinan dan strategi', 'BIS'], ['Berpikir analitis dan kritis', 'DAT'], ['Bercerita dan meyakinkan orang', 'KOM'], ['Empati dan kepedulian', 'SOS']]),
    q('Jika diberi proyek satu minggu, kamu memilih…', [['Membuat identitas visual untuk sebuah komunitas', 'DES'], ['Membuat aplikasi atau situs sederhana', 'TEK'], ['Menyusun rencana bisnis kecil', 'BIS'], ['Melakukan survei kecil lalu menganalisisnya', 'DAT']]),
    q('Kamu ingin dikenal orang sebagai…', [['Penyampai pesan yang jelas dan menarik', 'KOM'], ['Penolong yang bisa diandalkan', 'SOS'], ['Kreator dengan karya yang khas', 'DES'], ['Pemecah masalah di bidang teknologi', 'TEK']])
  ];

  /* ---------- Jurusan: bobot profil minat (0-5) ---------- */
  AK.MAJORS = [
    { id: 'dkv', name: 'Desain Komunikasi Visual', w: { DES: 5, KOM: 2, TEK: 1 }, skills: ['Desain visual', 'Tipografi', 'Ilustrasi', 'Branding'], careers: ['UI/UX Designer', 'Desainer Grafis', 'Art Director'], field: 'desain-grafis' },
    { id: 'ti', name: 'Teknik Informatika', w: { TEK: 5, DAT: 3, DES: 1 }, skills: ['Pemrograman', 'Algoritma', 'Basis data', 'Logika'], careers: ['Web Developer', 'Software Engineer', 'Quality Assurance'], field: 'pengembangan-web' },
    { id: 'si', name: 'Sistem Informasi', w: { TEK: 3, BIS: 3, DAT: 2 }, skills: ['Analisis sistem', 'Basis data', 'Proses bisnis', 'Manajemen proyek'], careers: ['Business Analyst', 'System Analyst', 'Product Owner'], field: 'analisis-bisnis' },
    { id: 'ikom', name: 'Ilmu Komunikasi', w: { KOM: 5, DES: 2, BIS: 1, SOS: 1 }, skills: ['Penulisan', 'Public speaking', 'Media sosial', 'Produksi konten'], careers: ['Content Strategist', 'Humas', 'Jurnalis'], field: 'konten-komunikasi' },
    { id: 'mnj', name: 'Manajemen / Bisnis', w: { BIS: 5, KOM: 2, DAT: 1 }, skills: ['Strategi', 'Keuangan dasar', 'Pemasaran', 'Kepemimpinan'], careers: ['Business Development', 'Marketing Specialist', 'Wirausaha'], field: 'analisis-bisnis' },
    { id: 'sd', name: 'Statistika / Sains Data', w: { DAT: 5, TEK: 3 }, skills: ['Statistika', 'Analisis data', 'Pemrograman data', 'Visualisasi data'], careers: ['Data Analyst', 'Data Scientist', 'Peneliti'], field: 'analisis-data' },
    { id: 'psi', name: 'Psikologi', w: { SOS: 4, DAT: 2, KOM: 2 }, skills: ['Observasi', 'Empati', 'Riset perilaku', 'Konseling dasar'], careers: ['Psikolog (jalur profesi)', 'HR Specialist', 'Peneliti perilaku'], field: 'studi-kasus-kesehatan' },
    { id: 'kes', name: 'Kesehatan Masyarakat / Keperawatan', w: { SOS: 5, DAT: 1 }, skills: ['Pelayanan pasien', 'Edukasi kesehatan', 'Kerja tim', 'Analisis kasus'], careers: ['Perawat', 'Tenaga Promosi Kesehatan', 'Epidemiolog'], field: 'studi-kasus-kesehatan' },
    { id: 'pend', name: 'Pendidikan', w: { SOS: 3, KOM: 3, TEK: 2 }, skills: ['Perancangan pembelajaran', 'Komunikasi', 'Evaluasi', 'Teknologi pembelajaran'], careers: ['Guru', 'Instructional Designer', 'Pengembang Kurikulum'], field: 'konten-komunikasi' }
  ];

  /* ---------- Bidang eksplorasi (katalog) ---------- */
  AK.FIELDS = [
    { id: 'desain-grafis', name: 'Desain Grafis', icon: 'bi-palette', desc: 'Komposisi, tipografi, warna, dan hierarki visual untuk menyampaikan pesan lewat gambar.', minutes: 10, level: 'Pemula', jenjang: ['SMA/SMK', 'Mahasiswa', 'Umum'], skills: ['Komposisi', 'Tipografi', 'Teori warna'], tools: ['Figma', 'Canva', 'Adobe Illustrator'], dim: 'DES',
      course: ['Pengantar prinsip desain', 'Warna dan tipografi dasar', 'Latihan membuat poster', 'Meminta dan memakai masukan'] },
    { id: 'pengembangan-web', name: 'Pengembangan Web', icon: 'bi-code-slash', desc: 'Logika pemrograman, struktur halaman, dan dasar HTML, CSS, serta JavaScript.', minutes: 15, level: 'Pemula', jenjang: ['SMA/SMK', 'Mahasiswa', 'Umum'], skills: ['HTML & CSS', 'Logika pemrograman', 'JavaScript dasar', 'Git'], tools: ['VS Code', 'Git & GitHub', 'Browser DevTools'], dim: 'TEK',
      course: ['Struktur halaman HTML', 'Gaya dengan CSS dan Bootstrap', 'Interaksi dengan JavaScript', 'Menyimpan proyek di GitHub'] },
    { id: 'analisis-bisnis', name: 'Analisis Bisnis', icon: 'bi-briefcase', desc: 'Membaca kebutuhan pengguna, menentukan prioritas, dan menghubungkan masalah dengan solusi.', minutes: 12, level: 'Menengah', jenjang: ['Mahasiswa', 'Umum'], skills: ['Analisis kebutuhan', 'Prioritas', 'Dokumentasi'], tools: ['Spreadsheet', 'Diagram alur', 'Papan tugas'], dim: 'BIS',
      course: ['Mengenali masalah bisnis', 'Menulis kebutuhan pengguna', 'Menentukan prioritas fitur', 'Menyajikan rekomendasi'] },
    { id: 'konten-komunikasi', name: 'Konten & Komunikasi', icon: 'bi-megaphone', desc: 'Menulis, bercerita, dan merancang pesan yang jelas untuk media sosial maupun publikasi.', minutes: 12, level: 'Pemula', jenjang: ['SMA/SMK', 'Mahasiswa', 'Umum'], skills: ['Penulisan', 'Penyusunan pesan', 'Media sosial'], tools: ['Aplikasi catatan', 'Editor video dasar', 'Jadwal konten'], dim: 'KOM',
      course: ['Mengenali target audiens', 'Menulis judul dan pembuka', 'Merancang kalender konten', 'Mengukur respon'] },
    { id: 'analisis-data', name: 'Analisis Data', icon: 'bi-bar-chart-line', desc: 'Membaca pola dari angka dan tabel, lalu menyajikannya dalam grafik yang mudah dipahami.', minutes: 15, level: 'Menengah', jenjang: ['Mahasiswa', 'Umum'], skills: ['Statistika dasar', 'Spreadsheet', 'Visualisasi data', 'Berpikir kritis'], tools: ['Spreadsheet', 'Python (dasar)', 'Looker Studio'], dim: 'DAT',
      course: ['Mengenal jenis data', 'Membersihkan data di spreadsheet', 'Membuat grafik yang jujur', 'Menyampaikan temuan'] },
    { id: 'studi-kasus-kesehatan', name: 'Studi Kasus Kesehatan', icon: 'bi-heart-pulse', desc: 'Memahami peran tenaga kesehatan dan sosial lewat kasus sederhana, tanpa saran medis.', minutes: 12, level: 'Pemula', jenjang: ['SMA/SMK', 'Mahasiswa', 'Umum'], skills: ['Observasi', 'Empati', 'Komunikasi pasien'], tools: ['Catatan kasus', 'Pedoman etika', 'Diskusi tim'], dim: 'SOS',
      course: ['Peran tenaga kesehatan', 'Etika dan privasi', 'Membaca kasus sederhana', 'Komunikasi yang empatik'] }
  ];

  /* ---------- Jalur karier per bidang ---------- */
  AK.CAREERS = {
    'desain-grafis': { title: 'Desainer Grafis / UI-UX', stages: [
      { t: 'Pendidikan', items: ['SMA/SMK Multimedia atau DKV', 'S1 DKV, Desain Produk, atau Sistem Informasi'] },
      { t: 'Pengembangan keterampilan', items: ['Prinsip desain dan tipografi', 'Portofolio 3-5 karya', 'Dasar UX dan riset pengguna'] },
      { t: 'Karier awal', items: ['Magang desain', 'Junior Graphic Designer', 'Junior UI Designer'] },
      { t: 'Karier lanjutan', items: ['Senior Designer', 'Product Designer', 'Art Director / UX Lead'] }],
      majors: [['Desain Komunikasi Visual', 'Tinggi'], ['Sistem Informasi', 'Sedang'], ['Teknik Informatika', 'Sedang']],
      activities: ['Membuat poster, logo, dan materi promosi', 'Merancang wireframe dan prototipe aplikasi', 'Menerima dan merevisi masukan dari klien'] },
    'pengembangan-web': { title: 'Web Developer', stages: [
      { t: 'Pendidikan', items: ['SMK RPL/TKJ atau SMA', 'S1 Teknik Informatika, Sistem Informasi, atau PTIK'] },
      { t: 'Pengembangan keterampilan', items: ['HTML, CSS, JavaScript', 'Git dan GitHub', 'Proyek web pribadi'] },
      { t: 'Karier awal', items: ['Magang developer', 'Junior Front-End Developer', 'Junior Web Developer'] },
      { t: 'Karier lanjutan', items: ['Full-Stack Developer', 'Tech Lead', 'Software Architect'] }],
      majors: [['Teknik Informatika', 'Tinggi'], ['Sistem Informasi', 'Tinggi'], ['Pendidikan Teknologi Informasi', 'Sedang']],
      activities: ['Menulis dan merapikan kode', 'Menguji dan memperbaiki bug', 'Berkolaborasi dengan desainer dan tim produk'] },
    'analisis-bisnis': { title: 'Business Analyst', stages: [
      { t: 'Pendidikan', items: ['SMA IPS/IPA atau SMK Bisnis', 'S1 Sistem Informasi, Manajemen, atau Teknik Industri'] },
      { t: 'Pengembangan keterampilan', items: ['Analisis kebutuhan', 'Pemodelan proses', 'Presentasi rekomendasi'] },
      { t: 'Karier awal', items: ['Magang analis', 'Junior Business Analyst', 'Associate Product'] },
      { t: 'Karier lanjutan', items: ['Senior Analyst', 'Product Manager', 'Konsultan Manajemen'] }],
      majors: [['Sistem Informasi', 'Tinggi'], ['Manajemen / Bisnis', 'Tinggi'], ['Teknik Industri', 'Sedang']],
      activities: ['Mewawancarai pengguna dan pemangku kepentingan', 'Menulis kebutuhan dan menentukan prioritas', 'Menyajikan rekomendasi kepada tim'] },
    'konten-komunikasi': { title: 'Content & Communication Specialist', stages: [
      { t: 'Pendidikan', items: ['SMA atau SMK Multimedia', 'S1 Ilmu Komunikasi, Sastra, atau Pendidikan'] },
      { t: 'Pengembangan keterampilan', items: ['Penulisan dan penyuntingan', 'Media sosial dan analitik', 'Produksi foto atau video dasar'] },
      { t: 'Karier awal', items: ['Magang konten', 'Content Writer', 'Social Media Officer'] },
      { t: 'Karier lanjutan', items: ['Content Strategist', 'Communication Manager', 'Editor'] }],
      majors: [['Ilmu Komunikasi', 'Tinggi'], ['Pendidikan', 'Sedang'], ['Desain Komunikasi Visual', 'Sedang']],
      activities: ['Menulis artikel dan naskah', 'Merencanakan kalender konten', 'Membaca respon audiens dan memperbaiki pesan'] },
    'analisis-data': { title: 'Data Analyst', stages: [
      { t: 'Pendidikan', items: ['SMA IPA atau SMK', 'S1 Statistika, Sains Data, atau Informatika'] },
      { t: 'Pengembangan keterampilan', items: ['Statistika dasar', 'Spreadsheet dan SQL', 'Visualisasi data'] },
      { t: 'Karier awal', items: ['Magang data', 'Junior Data Analyst', 'Business Intelligence Associate'] },
      { t: 'Karier lanjutan', items: ['Senior Data Analyst', 'Data Scientist', 'Analytics Manager'] }],
      majors: [['Statistika / Sains Data', 'Tinggi'], ['Teknik Informatika', 'Sedang'], ['Sistem Informasi', 'Sedang']],
      activities: ['Membersihkan dan mengolah data', 'Membuat dasbor dan laporan', 'Menjelaskan temuan kepada tim non-teknis'] },
    'studi-kasus-kesehatan': { title: 'Tenaga Kesehatan & Sosial', stages: [
      { t: 'Pendidikan', items: ['SMA IPA atau SMK Kesehatan', 'D3/S1 Keperawatan, Kesehatan Masyarakat, atau Psikologi'] },
      { t: 'Pengembangan keterampilan', items: ['Komunikasi empatik', 'Etika dan privasi', 'Praktik lapangan terbimbing'] },
      { t: 'Karier awal', items: ['Relawan atau magang klinik', 'Perawat pelaksana', 'Tenaga promosi kesehatan'] },
      { t: 'Karier lanjutan', items: ['Spesialisasi / profesi', 'Koordinator program', 'Peneliti atau pendidik'] }],
      majors: [['Kesehatan Masyarakat / Keperawatan', 'Tinggi'], ['Psikologi', 'Sedang'], ['Pendidikan', 'Rendah']],
      activities: ['Mendampingi dan mengedukasi pasien atau masyarakat', 'Mencatat dan menganalisis kasus', 'Bekerja dalam tim lintas profesi'] }
  };

  /* ---------- Simulasi tugas (selain kanvas poster) ----------
     Tiap tugas: skenario singkat, 3 pilihan, 'best' = indeks pilihan terbaik, umpan balik per pilihan. */
  const T = (title, scenario, opts, best, why) => ({ title, scenario, opts, best, why });
  AK.SIMS = {
    'desain-grafis': [
      { kind: 'poster', title: 'Desain poster acara sekolah', goal: 'Menyusun informasi acara agar mudah dipahami dalam beberapa detik.', minutes: 10, criteria: ['Judul mudah terlihat', 'Informasi utama jelas (tanggal dan lokasi)', 'Tata letak teratur dan tidak ramai'], hint: 'Mulai dari hierarki: apa yang harus dibaca pertama kali? Judul biasanya paling besar, informasi pendukung lebih kecil.' },
      T('Memilih kombinasi warna', 'Poster seminar teknologi perlu terlihat modern dan mudah dibaca dari jauh.', ['Teks kuning muda di atas latar putih', 'Teks navy tua di atas latar putih dengan satu aksen kuning', 'Lima warna cerah berbeda agar meriah'], 1, 'Kontras tinggi dan aksen terbatas membuat pesan mudah dibaca. Warna terlalu banyak membuat mata bingung.'),
      T('Menanggapi masukan klien', 'Klien berkata, "Logonya kurang besar." Menurut kamu, apa langkah terbaik?', ['Langsung memperbesar logo dua kali lipat tanpa melihat tata letak', 'Menanyakan tujuannya, lalu mencoba dua ukuran dan menunjukkan perbandingannya', 'Mengabaikan karena menurutmu sudah bagus'], 1, 'Desainer yang baik menggali alasan di balik masukan, lalu menawarkan opsi yang bisa dibandingkan.')
    ],
    'pengembangan-web': [
      T('Menyusun struktur halaman', 'Kamu membuat halaman profil. Elemen mana yang paling tepat sebagai judul utama halaman?', ['Tag <h1> berisi nama pemilik profil', 'Teks biasa yang diperbesar dengan CSS', 'Gambar berisi tulisan nama'], 0, 'Tag heading memberi struktur yang dipahami mesin pencari dan pembaca layar.'),
      T('Mencari penyebab bug', 'Tombol tidak bereaksi saat diklik. Langkah pertama yang paling masuk akal?', ['Menulis ulang seluruh halaman', 'Membuka Console di browser untuk melihat pesan kesalahan', 'Menunggu sampai bug hilang sendiri'], 1, 'Console menunjukkan error JavaScript dan lokasi barisnya, sehingga masalah bisa dipersempit dengan cepat.'),
      T('Menyimpan perubahan kode', 'Kamu selesai mengerjakan satu fitur kecil. Langkah yang baik?', ['Commit dengan pesan yang menjelaskan perubahan', 'Menyalin folder dan menamainya "final_fix_2"', 'Membiarkan tanpa menyimpan riwayat'], 0, 'Commit yang jelas membuat riwayat perubahan mudah dilacak dan dikembalikan bila perlu.')
    ],
    'analisis-bisnis': [
      T('Membaca kebutuhan pengguna', 'Pengguna mengeluh aplikasi pemesanan "lambat". Apa yang sebaiknya ditanyakan pertama?', ['Di langkah mana mereka merasa lambat, dan kapan terjadi?', 'Langsung membeli server yang lebih besar', 'Meminta mereka menggunakan aplikasi lain'], 0, 'Analis memahami masalah sebenarnya sebelum memilih solusi.'),
      T('Menentukan prioritas', 'Ada empat permintaan fitur dan waktu hanya cukup untuk dua. Cara memilih yang terbaik?', ['Memilih yang paling mudah dibuat saja', 'Menilai dampak bagi pengguna dan usaha yang dibutuhkan, lalu menyepakatinya dengan tim', 'Memilih berdasarkan siapa yang paling keras meminta'], 1, 'Prioritas yang adil memakai kriteria yang jelas dan disepakati bersama.'),
      T('Menyajikan rekomendasi', 'Kamu harus menjelaskan hasil analisis kepada pimpinan dalam 3 menit.', ['Membaca seluruh dokumen 30 halaman', 'Menyampaikan masalah, 2 pilihan solusi, dan rekomendasi singkat disertai alasan', 'Menunjukkan tabel mentah tanpa penjelasan'], 1, 'Ringkas, berstruktur, dan berorientasi keputusan.')
    ],
    'konten-komunikasi': [
      T('Menulis judul', 'Kamu menulis artikel tentang cara belajar efektif untuk pelajar. Judul mana yang paling jelas?', ['"Hal Ini Akan Mengubah Hidupmu!!!"', '"5 Cara Mengatur Jadwal Belajar agar Tidak Kewalahan"', '"Belajar"'], 1, 'Judul yang spesifik menjanjikan manfaat yang nyata tanpa melebih-lebihkan.'),
      T('Memahami audiens', 'Konten ditujukan untuk siswa SMA. Gaya bahasa yang tepat?', ['Bahasa santai, jelas, dan sopan', 'Bahasa sangat formal dengan banyak istilah asing', 'Bahasa kasar agar terlihat gaul'], 0, 'Selaraskan gaya dengan audiens tanpa mengorbankan kejelasan dan kesopanan.'),
      T('Menanggapi komentar kritis', 'Ada komentar yang menunjukkan kesalahan faktual di kontenmu. Langkahmu?', ['Menghapus komentar', 'Memeriksa fakta, memperbaiki, dan berterima kasih atas koreksinya', 'Membalas dengan marah'], 1, 'Kredibilitas dibangun dari kesediaan mengoreksi diri secara terbuka.')
    ],
    'analisis-data': [
      T('Memilih jenis grafik', 'Kamu ingin menunjukkan perubahan jumlah pengunjung tiap bulan selama setahun.', ['Grafik garis', 'Diagram lingkaran dengan 12 irisan', 'Tabel tanpa grafik'], 0, 'Grafik garis paling cocok untuk melihat tren dari waktu ke waktu.'),
      T('Menemukan data janggal', 'Satu baris menunjukkan usia pengguna 250 tahun. Langkah yang tepat?', ['Menghapus seluruh data tanpa catatan', 'Menandai sebagai kemungkinan salah input, memeriksa sumber, lalu mencatat keputusan perbaikan', 'Membiarkan karena tidak terlalu berpengaruh'], 1, 'Data dibersihkan secara transparan agar hasil analisis bisa dipertanggungjawabkan.'),
      T('Menyimpulkan hasil', 'Penjualan es krim dan jumlah kasus tenggelam sama-sama naik di musim panas. Kesimpulan terbaik?', ['Es krim menyebabkan orang tenggelam', 'Keduanya mungkin dipengaruhi faktor ketiga, yaitu cuaca panas; perlu analisis lebih lanjut', 'Data pasti salah'], 1, 'Korelasi tidak otomatis berarti sebab-akibat.')
    ],
    'studi-kasus-kesehatan': [
      T('Menyapa dengan empatik', 'Seorang pasien tampak cemas sebelum pemeriksaan. Respons yang tepat?', ['"Jangan khawatir, itu bukan apa-apa."', '"Sepertinya Anda cemas. Boleh saya jelaskan apa yang akan kita lakukan?"', 'Langsung memulai pemeriksaan tanpa bicara'], 1, 'Mengakui perasaan dan menjelaskan langkah membangun rasa percaya.'),
      T('Menjaga privasi', 'Temanmu bertanya tentang kondisi pasien yang kamu dampingi di tempat praktik.', ['Menceritakan sedikit karena temanmu bisa dipercaya', 'Menolak dengan sopan karena informasi pasien bersifat rahasia', 'Membagikan di grup agar mendapat saran'], 1, 'Kerahasiaan pasien adalah prinsip dasar etika layanan kesehatan.'),
      T('Mengetahui batas peran', 'Seorang relawan ditanya tentang dosis obat tertentu. Respons terbaik?', ['Menjawab berdasarkan pengalaman pribadi', 'Mengarahkan ke tenaga kesehatan berwenang seperti dokter atau apoteker', 'Mencari jawaban di forum internet dan menyampaikannya'], 1, 'Setiap peran punya batas kewenangan. Pertanyaan medis dijawab oleh tenaga yang berwenang.')
    ]
  };

  /* ---------- Rencana 30 hari: templat 12 aktivitas ---------- */
  AK.PLAN_WEEKS = [
    { week: 1, title: 'Pengenalan', target: 'Memahami gambaran bidang dan apakah kamu tertarik.' },
    { week: 2, title: 'Dasar keterampilan', target: 'Mempelajari keterampilan inti secara bertahap.' },
    { week: 3, title: 'Praktik', target: 'Mencoba langsung dan meminta masukan.' },
    { week: 4, title: 'Evaluasi dan proyek kecil', target: 'Merangkum hasil dan menentukan langkah berikutnya.' }
  ];
  AK.planTemplate = function (field) {
    const s = field.skills; const tl = field.tools;
    return [
      ['Baca gambaran pekerjaan di bidang ' + field.name, 'Tulis tiga hal yang menarik dan tiga hal yang membuatmu ragu', 'Ikuti simulasi tugas bidang ' + field.name],
      ['Pelajari keterampilan: ' + s[0], 'Pelajari keterampilan: ' + (s[1] || s[0]), 'Latihan kecil memakai ' + tl[0]],
      ['Kerjakan satu latihan mandiri berdurasi 1 jam', 'Buat satu karya atau hasil kecil dan simpan', 'Minta masukan dari teman atau komunitas'],
      ['Rapikan hasil menjadi proyek kecil', 'Tulis refleksi: apa yang berhasil dan apa yang sulit', 'Tentukan langkah berikutnya (course lanjutan atau magang)']
    ];
  };

  /* ---------- Lowongan  ---------- */
  AK.CITIES = ['Surakarta', 'Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya'];
  const J = (id, field, title, company, city, mode, type, level, skills, desc, quals, posted, deadline) => ({ id, field, title, company, city, mode, type, level, skills, desc, quals, posted, deadline, source: 'Data demonstrasi ArahKarya , bukan lowongan resmi' });
  AK.JOBS = [
    J('j1', 'desain-grafis', 'UI/UX Design Intern', 'Nusa Kreasi Digital', 'Jakarta', 'Remote', 'Magang', 'Pemula', ['Figma', 'Tipografi', 'Komposisi'], 'Membantu tim produk merancang wireframe dan prototipe layar aplikasi.', ['Mahasiswa semester 3 ke atas', 'Memiliki portofolio sederhana', 'Mampu bekerja dalam tim'], '2026-11-05', '2026-12-20'),
    J('j2', 'desain-grafis', 'Graphic Designer Junior', 'Studio Garis Warna', 'Yogyakarta', 'Onsite', 'Penuh waktu', 'Menengah', ['Komposisi', 'Adobe Illustrator', 'Teori warna'], 'Membuat materi visual untuk kampanye dan media sosial klien.', ['D3/S1 desain atau setara', 'Portofolio minimal 5 karya', 'Teliti dan tepat waktu'], '2026-11-02', '2026-12-10'),
    J('j3', 'pengembangan-web', 'Web Developer Intern', 'Cakra Teknologi', 'Surakarta', 'Hybrid', 'Magang', 'Pemula', ['HTML & CSS', 'JavaScript dasar', 'Git'], 'Membantu membangun halaman web internal dan memperbaiki bug ringan.', ['Memahami HTML, CSS, dan JavaScript dasar', 'Terbiasa memakai Git', 'Mau belajar'], '2026-11-08', '2026-12-31'),
    J('j4', 'pengembangan-web', 'Junior Front-End Developer', 'Bumi Aplikasi', 'Bandung', 'Remote', 'Penuh waktu', 'Menengah', ['JavaScript dasar', 'HTML & CSS', 'Logika pemrograman'], 'Mengembangkan antarmuka web responsif bersama tim desain.', ['Pengalaman proyek web pribadi atau magang', 'Memahami desain responsif', 'Komunikatif'], '2026-11-01', '2026-12-05'),
    J('j5', 'analisis-bisnis', 'Business Analyst Intern', 'Mitra Strategi Nusantara', 'Jakarta', 'Hybrid', 'Magang', 'Pemula', ['Analisis kebutuhan', 'Dokumentasi', 'Prioritas'], 'Membantu mencatat kebutuhan pengguna dan menyusun dokumen persyaratan.', ['Mahasiswa Sistem Informasi, Manajemen, atau terkait', 'Teliti dan komunikatif'], '2026-11-06', '2026-12-18'),
    J('j6', 'konten-komunikasi', 'Content Writer Freelance', 'Media Kata Kita', 'Surabaya', 'Remote', 'Freelance', 'Pemula', ['Penulisan', 'Media sosial', 'Penyusunan pesan'], 'Menulis artikel dan naskah media sosial dengan tenggat mingguan.', ['Tulisan rapi dan bebas plagiarisme', 'Mampu memeriksa fakta'], '2026-11-09', '2026-12-25'),
    J('j7', 'analisis-data', 'Data Analyst Intern', 'Data Cendekia', 'Surakarta', 'Onsite', 'Magang', 'Pemula', ['Statistika dasar', 'Spreadsheet', 'Visualisasi data'], 'Membersihkan data dan menyiapkan laporan ringkas bulanan.', ['Menguasai spreadsheet', 'Dasar statistika', 'Teliti'], '2026-11-04', '2026-12-15'),
    J('j8', 'analisis-data', 'Junior Data Analyst', 'Analitika Prima', 'Jakarta', 'Remote', 'Penuh waktu', 'Menengah', ['Visualisasi data', 'Spreadsheet', 'Berpikir kritis'], 'Membuat dasbor dan menjelaskan temuan kepada tim bisnis.', ['S1 Statistika, Informatika, atau terkait', 'Pengalaman proyek data'], '2026-11-03', '2026-12-12'),
    J('j9', 'studi-kasus-kesehatan', 'Relawan Edukasi Kesehatan', 'Yayasan Sehat Bersama', 'Yogyakarta', 'Onsite', 'Magang', 'Pemula', ['Observasi', 'Empati', 'Komunikasi pasien'], 'Mendampingi kegiatan penyuluhan kesehatan masyarakat (tidak memberi saran medis).', ['Bersedia mengikuti pelatihan etika', 'Komunikatif'], '2026-11-07', '2026-12-22'),
    J('j10', 'konten-komunikasi', 'Social Media Officer', 'Sosial Kreatif Indonesia', 'Bandung', 'Hybrid', 'Penuh waktu', 'Menengah', ['Media sosial', 'Penulisan', 'Penyusunan pesan'], 'Mengelola kalender konten dan membaca analitik akun perusahaan.', ['Pengalaman mengelola akun', 'Kreatif dan rapi'], '2026-11-01', '2026-12-08')
  ];
  AK.APP_STATUS = ['Disiapkan', 'Dikirim', 'Diproses', 'Diterima', 'Ditolak'];

  /* ---------- Forum  ---------- */
  const TH = (id, title, body, major, industry, author, replies, when, answers) => ({ id, title, body, major, industry, author, replies, when, answers });
  AK.THREADS = [
    TH('t1', 'Bagaimana memilih antara DKV dan Informatika?', 'Aku suka menggambar tapi juga penasaran dengan pemrograman. Apa yang bisa jadi pertimbangan?', 'Desain Komunikasi Visual', 'Teknologi', 'Rani', 8, '2 hari lalu', ['Coba ikuti simulasi dua bidang itu dulu lalu bandingkan mana yang lebih menyenangkan.', 'Perhatikan juga mata kuliahnya, lihat kurikulum di situs resmi kampus.']),
    TH('t2', 'Apa saja keterampilan awal untuk UI/UX?', 'Mau mulai belajar UI/UX dari nol. Prioritasnya apa?', 'Desain Komunikasi Visual', 'Teknologi', 'Dimas', 3, '5 hari lalu', ['Mulai dari prinsip desain dan satu alat seperti Figma, lalu buat 1 proyek kecil.']),
    TH('t3', 'Tips konsisten belajar 30 hari', 'Selalu berhenti di minggu kedua. Ada saran?', 'Umum', 'Pendidikan', 'Alya', 12, '1 minggu lalu', ['Pecah target jadi tugas 30 menit.', 'Centang progres tiap hari supaya terlihat.']),
    TH('t4', 'Prospek jurusan Statistika bagi yang suka data', 'Apakah statistika terlalu banyak teori?', 'Statistika / Sains Data', 'Teknologi', 'Bagas', 5, '1 minggu lalu', ['Ada teori dan praktik. Coba simulasi Analisis Data untuk merasakannya.']),
    TH('t5', 'Persiapan magang pertama untuk mahasiswa semester 3', 'CV masih kosong. Mulai dari mana?', 'Umum', 'Pendidikan', 'Nadia', 9, '2 minggu lalu', ['Tulis proyek kuliah dan organisasi.', 'Unduh templat CV di halaman Magang lalu sesuaikan.']),
    TH('t6', 'Apa bedanya Keperawatan dan Kesehatan Masyarakat?', 'Bingung memilih di antara dua jurusan ini.', 'Kesehatan Masyarakat / Keperawatan', 'Kesehatan', 'Fikri', 4, '3 minggu lalu', ['Keperawatan berfokus pada perawatan individu, kesehatan masyarakat pada pencegahan di tingkat populasi.']),
    TH('t7', 'Cara menulis konten yang tidak membosankan', 'Tulisanku terasa kaku. Ada latihan?', 'Ilmu Komunikasi', 'Media', 'Salsa', 6, '3 minggu lalu', ['Tulis seolah bercerita ke satu orang.', 'Baca ulang dengan suara keras.'])
  ];
  AK.CONSULTANTS = [
    { id: 'c1', name: 'Dra. Maya Lestari', role: 'Konselor pendidikan', focus: 'Pemilihan jurusan', slots: ['Senin, 16.00', 'Rabu, 19.00'] },
    { id: 'c2', name: 'Raka Pratama', role: 'UI/UX Designer', focus: 'Karier desain dan portofolio', slots: ['Selasa, 19.30', 'Sabtu, 10.00'] },
    { id: 'c3', name: 'Intan Permata', role: 'Web Developer', focus: 'Karier pemrograman', slots: ['Kamis, 20.00', 'Sabtu, 13.00'] },
    { id: 'c4', name: 'Arief Wibowo', role: 'Data Analyst', focus: 'Karier data', slots: ['Senin, 19.00', 'Jumat, 16.00'] }
  ];
})();
