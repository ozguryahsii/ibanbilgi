/**
 * TCMB'nin resmî banka-şube listesinden yerel şube dizinini üretir.
 *
 * Kullanım:  npm run subeler
 *
 * Kaynak: https://eftemkt.tcmb.gov.tr/bankasubelistesi/bankaSubeTumListe.xml
 * (EFT sistemine kayıtlı tüm banka ve şubelerin resmî listesi; TCMB
 * tarafından sürekli güncellenir.)
 *
 * Çıktı: public/data/subeler.json
 *   { "<5 haneli banka kodu>": { "<şube kodu (baştaki sıfırlar atılmış)>": "Şube Adı" } }
 *
 * KVKK notu: Bu betik yalnızca kamuya açık referans veriyi indirir; hiçbir
 * kullanıcı verisi veya IBAN dışarı gönderilmez. Uygulamanın kendisi çalışma
 * anında internete çıkmaz — dizin, derleme öncesi bu betikle tazelenir.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCES = [
  "https://eftemkt.tcmb.gov.tr/bankasubelistesi/bankaSubeTumListe.xml",
  // TCMB'ye erişilemezse bilinen bir ayna denenir.
  "https://mobilteg.com.tr/downloads/Bankalar/bankaSubeTumListe.xml",
];

async function download() {
  for (const url of SOURCES) {
    try {
      console.log(`İndiriliyor: ${url}`);
      const res = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (iban-bilgi sube dizini)" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      return decode(buf);
    } catch (err) {
      console.warn(`  başarısız: ${err.message}`);
    }
  }
  throw new Error(
    "Hiçbir kaynağa ulaşılamadı. Dosyayı elle indirip şu şekilde çalıştırabilirsiniz:\n" +
      "  node scripts/subeleri-guncelle.mjs /yol/bankaSubeTumListe.xml"
  );
}

function decode(buf) {
  // XML bildirimindeki karakter setine göre çöz (TCMB genelde ISO-8859-9 kullanır).
  const head = buf.subarray(0, 200).toString("latin1");
  const m = head.match(/encoding="([^"]+)"/i);
  const enc = (m?.[1] ?? "utf-8").toLowerCase();
  const label = enc.includes("8859-9") || enc.includes("1254") ? "windows-1254" : enc;
  try {
    return new TextDecoder(label).decode(buf);
  } catch {
    return buf.toString("utf-8");
  }
}

/**
 * Şema (bKd: banka kodu, sKd: şube kodu, sAd: şube adı) hem öznitelik hem
 * eleman biçiminde gelebilir; iki biçimi de destekleyen durum makinesi.
 */
function parse(xml) {
  const directory = {};
  let bank = null;
  let sube = null;
  let subeCount = 0;

  const add = (bankCode, subeKodu, subeAdi) => {
    if (!bankCode || !subeKodu || !subeAdi) return;
    const bKey = String(bankCode).replace(/\D/g, "").padStart(5, "0");
    const sKey = String(Number(String(subeKodu).replace(/\D/g, "")));
    if (sKey === "0" || sKey === "NaN") return;
    (directory[bKey] ??= {})[sKey] = subeAdi.trim().replace(/\s+/g, " ");
    subeCount++;
  };

  const tokens = xml.matchAll(
    /<[^>]*\bbKd="([^"]*)"[^>]*>|<bKd>([^<]*)<\/bKd>|<[^>]*\bsKd="([^"]*)"[^>]*\bsAd="([^"]*)"[^>]*>|<sKd>([^<]*)<\/sKd>|<sAd>([^<]*)<\/sAd>/g
  );
  for (const t of tokens) {
    const [, bAttr, bElem, sKdAttr, sAdAttr, sKdElem, sAdElem] = t;
    if (bAttr != null || bElem != null) {
      bank = bAttr ?? bElem;
      sube = null;
    } else if (sKdAttr != null) {
      add(bank, sKdAttr, sAdAttr);
    } else if (sKdElem != null) {
      sube = sKdElem;
    } else if (sAdElem != null && sube != null) {
      add(bank, sube, sAdElem);
      sube = null;
    }
  }
  return { directory, subeCount };
}

const localFile = process.argv[2];
const xml = localFile
  ? decode(await import("node:fs").then((fs) => fs.readFileSync(localFile)))
  : await download();

const { directory, subeCount } = parse(xml);
const bankCount = Object.keys(directory).length;
if (subeCount < 100) {
  console.error(
    `Yalnızca ${subeCount} şube çözümlenebildi — XML biçimi beklenenden farklı olabilir. Çıktı yazılmadı.`
  );
  process.exit(1);
}

const out = {
  _meta: {
    kaynak: "TCMB bankaSubeTumListe.xml",
    guncelleme: new Date().toISOString().slice(0, 10),
    banka: bankCount,
    sube: subeCount,
  },
  ...directory,
};

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const target = join(root, "public", "data", "subeler.json");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out));
console.log(`Tamam: ${bankCount} banka, ${subeCount} şube → public/data/subeler.json`);
console.log("Değişikliğin siteye yansıması için yeniden derleyin: npm run build");
