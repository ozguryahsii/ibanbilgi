"use client";

/**
 * Yerel şube dizini: şube kodu → şube adı.
 *
 * Veri, uygulamanın kendi sunduğu /data/subeler.json dosyasından okunur —
 * yani istek uygulamanın kendi kaynağına gider, harici hiçbir servise veri
 * gönderilmez. Dizin `npm run subeler` betiğiyle resmî TCMB listesinden
 * güncellenir.
 */

import { useEffect, useState } from "react";

type Directory = Record<string, Record<string, string>>;

let cache: Directory | null = null;
let pending: Promise<Directory> | null = null;

export async function loadDirectory(): Promise<Directory> {
  if (cache) return cache;
  pending ??= fetch("/data/subeler.json")
    .then((res) => (res.ok ? res.json() : {}))
    .catch(() => ({}))
    .then((data: Directory) => {
      cache = data;
      return data;
    });
  return pending;
}

export function lookupBranchName(
  directory: Directory | null,
  bankCode?: string,
  branchCode?: string
): string | undefined {
  if (!directory || !bankCode || !branchCode) return undefined;
  return directory[bankCode]?.[String(Number(branchCode))];
}

/** Şube adını asenkron çözen hook; dizin bir kez indirilip paylaşılır. */
export function useBranchName(
  bankCode?: string,
  branchCode?: string
): string | undefined {
  const [directory, setDirectory] = useState<Directory | null>(cache);

  useEffect(() => {
    if (!directory && bankCode && branchCode) {
      let alive = true;
      loadDirectory().then((d) => alive && setDirectory(d));
      return () => {
        alive = false;
      };
    }
  }, [directory, bankCode, branchCode]);

  return lookupBranchName(directory, bankCode, branchCode);
}
