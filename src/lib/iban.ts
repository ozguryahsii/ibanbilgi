/**
 * TR IBAN doğrulama ve çözümleme.
 *
 * Tüm işlemler tamamen lokaldir — hiçbir veri ağa gönderilmez.
 *
 * TR IBAN yapısı (26 karakter):
 *   TR | 2 kontrol hanesi | 5 hane banka kodu | 1 hane rezerv | 16 hane hesap bölümü
 */

import { Bank, findBankByCode } from "./banks";

export type IbanErrorCode =
  | "empty"
  | "not-tr"
  | "invalid-length"
  | "invalid-chars"
  | "checksum-failed";

export const IBAN_ERROR_MESSAGES: Record<IbanErrorCode, string> = {
  empty: "IBAN boş olamaz.",
  "not-tr": "Yalnızca TR ile başlayan Türkiye IBAN'ları desteklenir.",
  "invalid-length": "TR IBAN 26 karakter olmalıdır.",
  "invalid-chars": "IBAN yalnızca harf ve rakamlardan oluşmalıdır.",
  "checksum-failed": "IBAN kontrol basamağı doğrulanamadı (mod-97).",
};

export interface IbanResult {
  input: string;
  /** Boşluksuz, büyük harfe çevrilmiş IBAN */
  normalized: string;
  /** 4'lü gruplanmış görünüm */
  formatted: string;
  valid: boolean;
  errorCode?: IbanErrorCode;
  errorMessage?: string;
  checkDigits?: string;
  bankCode?: string;
  bank?: Bank;
  /** Rezerv hane + 16 haneli hesap bölümü */
  accountPart?: string;
  /** Bankaya özgü kalıptan çıkarılan tahmini şube kodu */
  branchCodeGuess?: string;
  /** Şube tahmini yapılamama nedeni */
  branchNote: string;
}

export function normalizeIban(raw: string): string {
  return raw.replace(/[\s-]/g, "").toUpperCase();
}

export function formatIban(normalized: string): string {
  return normalized.replace(/(.{4})/g, "$1 ").trim();
}

/** ISO 13616 mod-97 kontrolü. BigInt yerine parça parça mod alınır. */
function mod97(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const value =
      ch >= "0" && ch <= "9" ? ch : (ch.charCodeAt(0) - 55).toString();
    for (const digit of String(value)) {
      remainder = (remainder * 10 + (digit.charCodeAt(0) - 48)) % 97;
    }
  }
  return remainder;
}

const BRANCH_STANDARD_NOTE =
  "TR IBAN standardında şube kodu resmî bir alan değildir; gösterilen değer, bu banka için gerçek örnek IBAN'larla doğrulanmış yerleşim kalıbına dayalı bir tahmindir.";
const BRANCH_UNKNOWN_NOTE =
  "Bu banka için IBAN içinde doğrulanmış bir şube kodu kalıbı bilinmiyor; şube bilgisi IBAN'dan güvenilir şekilde çıkarılamaz.";

function fail(input: string, normalized: string, code: IbanErrorCode): IbanResult {
  return {
    input,
    normalized,
    formatted: formatIban(normalized),
    valid: false,
    errorCode: code,
    errorMessage: IBAN_ERROR_MESSAGES[code],
    branchNote: "",
  };
}

export function parseIban(raw: string): IbanResult {
  const input = raw.trim();
  const normalized = normalizeIban(input);

  if (!normalized) return fail(input, normalized, "empty");
  if (!/^[A-Z0-9]+$/.test(normalized)) return fail(input, normalized, "invalid-chars");
  if (!normalized.startsWith("TR")) return fail(input, normalized, "not-tr");
  if (normalized.length !== 26) return fail(input, normalized, "invalid-length");
  if (!/^TR\d{24}$/.test(normalized)) return fail(input, normalized, "invalid-chars");
  if (mod97(normalized) !== 1) return fail(input, normalized, "checksum-failed");

  const checkDigits = normalized.slice(2, 4);
  const bankCode = normalized.slice(4, 9);
  const accountPart = normalized.slice(9);
  const bank = findBankByCode(bankCode);

  let branchCodeGuess: string | undefined;
  let branchNote = BRANCH_UNKNOWN_NOTE;
  if (bank?.branchPattern) {
    // Rezerv haneyi atlayıp 16 haneli hesap bölümünden okunur.
    const account16 = accountPart.slice(1);
    const guess = account16.slice(
      bank.branchPattern.offset,
      bank.branchPattern.offset + bank.branchPattern.length
    );
    if (/^\d+$/.test(guess) && Number(guess) > 0) {
      // Baştaki sıfırlar atılır: "00088" → "88", "09408" → "9408".
      branchCodeGuess = String(Number(guess));
      branchNote = BRANCH_STANDARD_NOTE;
    } else {
      branchNote =
        "Bu IBAN'da beklenen konumda geçerli bir şube kodu bulunamadı; şube tespiti yapılamadı.";
    }
  }

  return {
    input,
    normalized,
    formatted: formatIban(normalized),
    valid: true,
    checkDigits,
    bankCode,
    bank,
    accountPart,
    branchCodeGuess,
    branchNote,
  };
}
