SOP INPUT TRANSAKSI BAHASA S3 TAHAP 2 (NEXT JS) MENGGUNAKAN BACKOFFICE (versi dev linux)

akun yang digunakan:

1. mge: tan@tan.com / Saturnus4919
2. zo: ruben@az.com / Az12345678
3. internal: andy@az.com Az12345678
4. lead/spv: andy2@az.com Az12345678

5. akses https://bf-az.assetlogistik.com/adminlogin
6. Pilih menu setting umum
7. Di sidebar pilih Transaksi Bahasa ( Jika tidak menemukan menu sidebar ini, maka berarti akun tersebut tidak memiliki hak akses untuk mengedit transaksi bahasa).
   atau akses di asd
8. Di pilihan super menu, pilih button detail super menu yang mau ditambahkan. contoh: MuatParts.
9. Tekan tombol tambah di kanan atas.

Untuk menu muat diisi berdasarkan link ini, list ini ditambahkan oleh Internal secara inject DB langsung) berdasarkan https://docs.google.com/spreadsheets/d/1_mW4RJ14CXlu1_0mMfnK_V8i4VyQss_V0KVUfyt6vjo/edit?gid=1535858101#gid=1535858101 6. Aturan Penginputan:
Super Menu muat: diisi dari Modul yang dipilih tadi contoih: MuatParts, MuatTrans

❖ PageLink : diisi berdasarkan Sub menu dari link di

1. Untuk MuatParts Seller: List Menu.
2. Untuk MuatParts Buyer: (on progress)
   ❖ Class : diisi berdasarkan /Url terakhir dari routing halaman yang digunakan. Misalkan muatparts seller register berada di {muatparts_seller_url}/register, maka Class diisi register
   ❖ Form : diisi informasi gabungan PageLink Menu dan Sub Menu. contoh generalLanding
   ❖ Label: diisi dari specific ID yang akan digunakan, gunakan CamelCase dan dimulai dari small letter, dimulai dari nama komponen lalu tujuan spesifik dengan bahasa inggris. Contoh: buttonYes, labelSuccess.
   notes: Label ini harus unique di dalam 1 module super Menu, jika sudah digunakan maka di BO bahasa tidak dapat digunakan lagi, bisa gunakan yang sama dengan kolom pencarian/filter untuk mencari label yang sudah dibuat. (Jika tidak dapat menggunakan label tersebut).
3. Tekan Publish untuk meng-export data language yang telah dibuat. Maka language dapat digunakan di Website dan Apps.
4. Untuk Implementasi di Next JS bisa lihat pada folder ini:
   8.1 Import UseTranslation dari TranslationProvider
   8.2 Deklarasi UseTranslation
   8.3 Translate Siap digunakan
   programmerdev/muatparts-seller-dev/app/kelolaproduk/daftarproduk/DaftarProduk.js

- programmerdev/muatparts-seller-dev/app/kelolaproduk/daftarproduk/page.jsx
- file terkait:lib/S3utils,languageTranslate,env,\* Untuk Ubah Language: programmerdev/muatparts-seller-dev/app/container/HeaderContainer/HeaderContainer.jsx

NB: List language yang sudah ditambahkan bisa dicheck di
env:dev/xdemo/rc/live
nation:id/en
https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/locales/{env}/{nation}/common.jsonMERGIN

Untuk check merging Dev linux:
https://docs.google.com/document/d/1zl4-ho-hmm4YhspXHNbo-rJ52c3xRtVe/edit#heading=h.gjdgxs(agar dapat check diluar RDP)

FlowChart Transaksi Bahasa:
