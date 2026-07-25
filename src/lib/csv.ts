/**
 * Toplu sorgu için CSV okuma/yazma yardımcıları.
 * Tüm işlem tarayıcıda gerçekleşir; dosya hiçbir sunucuya yüklenmez.
 */

import Papa from "papaparse";
import { IbanResult, parseIban } from "./iban";
import { BANK_TYPE_LABELS } from "./banks";

export interface BulkRow {
  /** CSV'deki satır numarası (başlık hariç, 1'den başlar) */
  line: number;
  /** Kullanıcının IBAN dışı verdiği etiket/açıklama kolonu */
  label?: string;
  result: IbanResult;
}

export interface BulkSummary {
  total: number;
  valid: number;
  invalid: number;
  bankCount: number;
  byBank: { name: string; count: number }[];
}

// "I" harfi Türkçe locale ile küçültüldüğünde "ı" olur; iki biçim de kabul edilir.
const IBAN_HEADER_RE = /^\s*[iı]ban\s*$/i;
const LABEL_HEADERS = ["etiket", "aciklama", "açıklama", "ad", "isim", "label", "name"];

/** CSV metnini satırlara çözer. Başlıklı ve başlıksız dosyaları destekler. */
export function parseBulkCsv(text: string): BulkRow[] {
  const parsed = Papa.parse<string[]>(text.trim(), {
    skipEmptyLines: "greedy",
  });

  const rows = parsed.data.filter((r) => r.some((c) => c && c.trim()));
  if (rows.length === 0) return [];

  let ibanCol = 0;
  let labelCol = -1;
  let startIndex = 0;

  const header = rows[0].map((c) => c.trim().toLocaleLowerCase("tr"));
  const headerIbanIdx = header.findIndex((h) => IBAN_HEADER_RE.test(h));
  if (headerIbanIdx >= 0) {
    ibanCol = headerIbanIdx;
    labelCol = header.findIndex((h) => LABEL_HEADERS.includes(h));
    startIndex = 1;
  } else if (rows[0].length > 1) {
    // Başlık yoksa: TR ile başlayan ilk kolon IBAN kabul edilir.
    const trIdx = rows[0].findIndex((c) => /^\s*tr/i.test(c));
    if (trIdx >= 0) {
      ibanCol = trIdx;
      labelCol = trIdx === 0 && rows[0].length > 1 ? 1 : 0;
    }
  }

  return rows.slice(startIndex).map((cells, i) => ({
    line: i + 1,
    label: labelCol >= 0 ? cells[labelCol]?.trim() || undefined : undefined,
    result: parseIban(cells[ibanCol] ?? ""),
  }));
}

export function summarizeBulk(rows: BulkRow[]): BulkSummary {
  const byBankMap = new Map<string, number>();
  let valid = 0;
  for (const row of rows) {
    if (!row.result.valid) continue;
    valid++;
    const name =
      row.result.bank?.shortName ?? `Bilinmeyen (${row.result.bankCode})`;
    byBankMap.set(name, (byBankMap.get(name) ?? 0) + 1);
  }
  const byBank = [...byBankMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total: rows.length,
    valid,
    invalid: rows.length - valid,
    bankCount: byBank.length,
    byBank,
  };
}

export function buildResultsCsv(rows: BulkRow[]): string {
  const data = rows.map(({ line, label, result }) => ({
    Satir: line,
    Etiket: label ?? "",
    IBAN: result.formatted,
    Gecerli: result.valid ? "EVET" : "HAYIR",
    Hata: result.errorMessage ?? "",
    "Banka Kodu": result.bankCode ?? "",
    Banka: result.bank?.name ?? (result.valid ? "Bilinmeyen banka" : ""),
    "Banka Turu": result.bank ? BANK_TYPE_LABELS[result.bank.type] : "",
    "Sube Kodu (Tahmini)": result.branchCodeGuess ?? "",
  }));
  // BOM, Excel'in Türkçe karakterleri doğru açması için eklenir.
  return "\uFEFF" + Papa.unparse(data, { delimiter: ";" });
}

export const SAMPLE_CSV =
  "\uFEFF" +
  [
    "IBAN;Etiket",
    "TR830004601234567890123456;Ornek Tedarikci A",
    "TR190006404501001234567890;Ornek Tedarikci B",
    "TR200001000768012345678901;Ornek Musteri C",
    "TR960020500142000123456789;Ornek Musteri D",
    "TR000000000000000000000000;Hatali IBAN ornegi",
  ].join("\r\n");

export function downloadTextFile(name: string, content: string, mime = "text/csv") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
