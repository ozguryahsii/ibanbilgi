# IBAN Bilgi — Banka & Şube Tespiti

TR IBAN'larından banka ve (tespit edilebiliyorsa) şube bilgisini çıkaran, modern
ve gizlilik odaklı bir web uygulaması.

**Temel ilke (KVKK):** IBAN doğrulama, banka tespiti ve toplu CSV analizi dahil
tüm işlemler **tamamen tarayıcıda** çalışır. Sorgulanan IBAN'lar veya yüklenen
dosyalar hiçbir sunucuya ya da harici servise gönderilmez, hiçbir yerde
saklanmaz.

## Özellikler

- **Tekil sorgu** — IBAN girin; format + mod-97 (ISO 13616) doğrulaması, banka
  adı/türü ve tahmini şube kodu anında gösterilir.
- **Toplu sorgu** — CSV yükleyin; tüm satırlar analiz edilir, KPI kartları ve
  grafiklerle (banka dağılımı, geçerlilik özeti) sunulur, sonuçlar CSV olarak
  indirilir. Örnek şablon uygulamadan indirilebilir.
- **Banka rehberi** — Uygulamaya gömülü TCMB banka kodu referansının aranabilir
  listesi.
- **Şube tespiti (best-effort)** — Şube kodu TR IBAN standardında resmî bir alan
  olmadığından, yalnızca bankaya özgü bilinen yerleşim kalıplarına göre
  *tahmini* olarak gösterilir; kalıbı bilinmeyen bankalarda "tespit edilemedi"
  denir.
- Karanlık öncelikli, aydınlık tema destekli, tamamen responsive arayüz.

## Teknoloji

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui tarzı bileşen
mimarisi · Magic UI uyarlaması animasyon bileşenleri · Motion · Lucide Icons ·
Recharts · PapaParse

```
src/
  app/               Sayfalar (tekil, toplu-sorgu, bankalar, gizlilik)
  components/
    ui/              shadcn/ui tarzı temel bileşenler
    layout/          Sidebar, topbar, tema, sayfa kabuğu
    dashboard/       Sorgu modülleri, KPI kartları, tablolar
    charts/          Recharts grafik bileşenleri
    magicui/         Animasyon bileşenleri (border-beam, ticker, ...)
  lib/               IBAN algoritması, banka listesi, CSV yardımcıları
```

## Geliştirme (macOS / Linux / Windows)

Gereksinim: Node.js 20+

```bash
npm install
npm run dev       # http://localhost:3001
npm run lint      # ESLint
npm run build     # Üretim çıktısı (statik) → out/
npm run preview   # out/ klasörünü http://localhost:3001 üzerinde sunar
```

Geliştirme sunucusu, 3000 portunu kullanan diğer uygulamalarla çakışmamak için
**3001** portunda çalışır.

## Yayınlama

`next.config.ts` içinde `output: "export"` etkin olduğundan `npm run build`
komutu **pür statik** bir site üretir (`out/` klasörü). Çalışma zamanında
Node.js gerekmez; herhangi bir statik dosya sunucusu yeterlidir.

### Linux + Nginx

```nginx
server {
    listen 80;
    server_name ornek.alanadi;
    root /var/www/ibanbilgi/out;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
```

### Windows + IIS

1. `out/` klasörünü sunucuya kopyalayın ve IIS'te bir site/sanal dizin olarak
   gösterin.
2. Uzantısız URL'lerin (`/toplu-sorgu` gibi) `toplu-sorgu.html` dosyasına
   gitmesi için URL Rewrite modülüyle basit bir kural ekleyin (ya da yalnızca
   ana sayfadan gezinme yeterliyse buna gerek kalmaz; sayfa geçişleri istemci
   taraflıdır).

### Şube dizinini güncelleme (şube adları)

Şube kodlarının adlarla eşleşmesi (`88 → Kadıköy` gibi) `public/data/subeler.json`
dosyasından okunur. Depoda yalnızca elle doğrulanmış küçük bir başlangıç seti
bulunur; **tam listeyi** TCMB'nin resmî banka-şube listesinden tek komutla
üretebilirsiniz:

```bash
npm run subeler     # TCMB bankaSubeTumListe.xml → public/data/subeler.json
npm run build       # yeni dizinle siteyi yeniden derle
```

Betik yalnızca kamuya açık referans veriyi indirir; IBAN veya kullanıcı verisi
hiçbir yere gönderilmez. İnternet erişimi olmayan ortamlar için XML'i elle
indirip `node scripts/subeleri-guncelle.mjs /yol/bankaSubeTumListe.xml`
biçiminde de çalıştırabilirsiniz.

### Banka listesini güncelleme

Banka kodu referansı `src/lib/banks.ts` dosyasına gömülüdür. Yeni banka
eklemek/güncellemek için bu dosyayı düzenleyip yeniden derlemeniz yeterlidir.
Güncelleme sürecinde de kullanıcı verisi taşınmaz; yalnızca kamuya açık banka
kodu referansı değişir.
