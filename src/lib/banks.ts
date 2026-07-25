/**
 * Türkiye banka kayıt listesi.
 *
 * IBAN'ın 5.–9. haneleri (TR + 2 kontrol hanesinden sonra) TCMB tarafından
 * atanan 5 haneli banka kodudur. Bu liste uygulamaya gömülüdür; sorgular
 * hiçbir zaman dışarı gönderilmez. Listenin kendisi gerekirse yeni bir
 * sürümle ya da bu dosya güncellenerek tazelenir.
 *
 * `branchPattern`: bankanın hesap bölümüne şube kodunu gömdüğü biliniyorsa
 * şube kodunun konumu. TR IBAN standardında şube kodu resmî bir alan
 * OLMADIĞI için bu her zaman "tahmini" olarak sunulur.
 */

export type BankType = "mevduat" | "katilim" | "kalkinma-yatirim" | "diger";

export interface BranchPattern {
  /** Hesap bölümü (16 hane) içinde şube kodunun başladığı indeks */
  offset: number;
  /** Şube kodu uzunluğu */
  length: number;
}

export interface Bank {
  /** 5 haneli TCMB banka kodu */
  code: string;
  name: string;
  shortName: string;
  type: BankType;
  branchPattern?: BranchPattern;
}

export const BANK_TYPE_LABELS: Record<BankType, string> = {
  mevduat: "Mevduat Bankası",
  katilim: "Katılım Bankası",
  "kalkinma-yatirim": "Kalkınma ve Yatırım Bankası",
  diger: "Diğer Kuruluş",
};

const LEADING_BRANCH_4: BranchPattern = { offset: 0, length: 4 };

export const BANKS: Bank[] = [
  { code: "00001", name: "Türkiye Cumhuriyet Merkez Bankası", shortName: "TCMB", type: "diger" },
  { code: "00004", name: "İller Bankası A.Ş.", shortName: "İller Bankası", type: "kalkinma-yatirim" },
  { code: "00010", name: "T.C. Ziraat Bankası A.Ş.", shortName: "Ziraat Bankası", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00012", name: "Türkiye Halk Bankası A.Ş.", shortName: "Halkbank", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00014", name: "Türkiye Sınai Kalkınma Bankası A.Ş.", shortName: "TSKB", type: "kalkinma-yatirim" },
  { code: "00015", name: "Türkiye Vakıflar Bankası T.A.O.", shortName: "VakıfBank", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00016", name: "Türkiye İhracat Kredi Bankası A.Ş.", shortName: "Eximbank", type: "kalkinma-yatirim" },
  { code: "00017", name: "Türkiye Kalkınma ve Yatırım Bankası A.Ş.", shortName: "TKYB", type: "kalkinma-yatirim" },
  { code: "00029", name: "Birleşik Fon Bankası A.Ş.", shortName: "Birleşik Fon", type: "mevduat" },
  { code: "00032", name: "Türk Ekonomi Bankası A.Ş.", shortName: "TEB", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00046", name: "Akbank T.A.Ş.", shortName: "Akbank", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00059", name: "Şekerbank T.A.Ş.", shortName: "Şekerbank", type: "mevduat" },
  { code: "00062", name: "Türkiye Garanti Bankası A.Ş.", shortName: "Garanti BBVA", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00064", name: "Türkiye İş Bankası A.Ş.", shortName: "İş Bankası", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00067", name: "Yapı ve Kredi Bankası A.Ş.", shortName: "Yapı Kredi", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00091", name: "Arap Türk Bankası A.Ş.", shortName: "Arap Türk Bankası", type: "mevduat" },
  { code: "00092", name: "Citibank A.Ş.", shortName: "Citibank", type: "mevduat" },
  { code: "00094", name: "Bank Mellat", shortName: "Bank Mellat", type: "mevduat" },
  { code: "00096", name: "Turkish Bank A.Ş.", shortName: "Turkish Bank", type: "mevduat" },
  { code: "00097", name: "Habib Bank Limited", shortName: "Habib Bank", type: "mevduat" },
  { code: "00098", name: "JPMorgan Chase Bank N.A.", shortName: "JPMorgan", type: "mevduat" },
  { code: "00099", name: "ING Bank A.Ş.", shortName: "ING", type: "mevduat" },
  { code: "00100", name: "Adabank A.Ş.", shortName: "Adabank", type: "mevduat" },
  { code: "00103", name: "Fibabanka A.Ş.", shortName: "Fibabanka", type: "mevduat" },
  { code: "00108", name: "Turkland Bank A.Ş.", shortName: "T-Bank", type: "mevduat" },
  { code: "00109", name: "ICBC Turkey Bank A.Ş.", shortName: "ICBC Turkey", type: "mevduat" },
  { code: "00111", name: "QNB Bank A.Ş.", shortName: "QNB", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00115", name: "Deutsche Bank A.Ş.", shortName: "Deutsche Bank", type: "mevduat" },
  { code: "00116", name: "Pasha Yatırım Bankası A.Ş.", shortName: "Pasha Yatırım", type: "kalkinma-yatirim" },
  { code: "00121", name: "Standard Chartered Yatırım Bankası Türk A.Ş.", shortName: "Standard Chartered", type: "kalkinma-yatirim" },
  { code: "00122", name: "Société Générale (SA)", shortName: "Société Générale", type: "mevduat" },
  { code: "00123", name: "HSBC Bank A.Ş.", shortName: "HSBC", type: "mevduat" },
  { code: "00124", name: "Alternatif Bank A.Ş.", shortName: "Alternatif Bank", type: "mevduat" },
  { code: "00125", name: "Burgan Bank A.Ş.", shortName: "Burgan Bank", type: "mevduat" },
  { code: "00129", name: "Merrill Lynch Yatırım Bank A.Ş.", shortName: "Merrill Lynch", type: "kalkinma-yatirim" },
  { code: "00132", name: "İstanbul Takas ve Saklama Bankası A.Ş.", shortName: "Takasbank", type: "kalkinma-yatirim" },
  { code: "00134", name: "DenizBank A.Ş.", shortName: "DenizBank", type: "mevduat", branchPattern: LEADING_BRANCH_4 },
  { code: "00135", name: "Anadolubank A.Ş.", shortName: "Anadolubank", type: "mevduat" },
  { code: "00137", name: "Rabobank A.Ş.", shortName: "Rabobank", type: "mevduat" },
  { code: "00138", name: "Diler Yatırım Bankası A.Ş.", shortName: "Diler Yatırım", type: "kalkinma-yatirim" },
  { code: "00139", name: "GSD Yatırım Bankası A.Ş.", shortName: "GSD Yatırım", type: "kalkinma-yatirim" },
  { code: "00141", name: "Nurol Yatırım Bankası A.Ş.", shortName: "Nurol Yatırım", type: "kalkinma-yatirim" },
  { code: "00142", name: "BankPozitif Kredi ve Kalkınma Bankası A.Ş.", shortName: "BankPozitif", type: "kalkinma-yatirim" },
  { code: "00143", name: "Aktif Yatırım Bankası A.Ş.", shortName: "Aktif Bank", type: "kalkinma-yatirim" },
  { code: "00146", name: "Odea Bank A.Ş.", shortName: "Odeabank", type: "mevduat" },
  { code: "00147", name: "MUFG Bank Turkey A.Ş.", shortName: "MUFG", type: "mevduat" },
  { code: "00148", name: "Intesa Sanpaolo S.p.A.", shortName: "Intesa Sanpaolo", type: "mevduat" },
  { code: "00149", name: "Bank of China Turkey A.Ş.", shortName: "Bank of China", type: "mevduat" },
  { code: "00150", name: "Golden Global Yatırım Bankası A.Ş.", shortName: "Golden Global", type: "kalkinma-yatirim" },
  { code: "00151", name: "D Yatırım Bankası A.Ş.", shortName: "D Yatırım", type: "kalkinma-yatirim" },
  { code: "00152", name: "Destek Yatırım Bankası A.Ş.", shortName: "Destek Yatırım", type: "kalkinma-yatirim" },
  { code: "00153", name: "Misyon Yatırım Bankası A.Ş.", shortName: "Misyon Yatırım", type: "kalkinma-yatirim" },
  { code: "00154", name: "Tera Yatırım Bankası A.Ş.", shortName: "Tera Yatırım", type: "kalkinma-yatirim" },
  { code: "00157", name: "Enpara Bank A.Ş.", shortName: "Enpara", type: "mevduat" },
  { code: "00158", name: "Colendi Bank A.Ş.", shortName: "Colendi Bank", type: "mevduat" },
  { code: "00159", name: "FUPS Bank A.Ş.", shortName: "FUPS Bank", type: "mevduat" },
  { code: "00203", name: "Albaraka Türk Katılım Bankası A.Ş.", shortName: "Albaraka Türk", type: "katilim" },
  { code: "00205", name: "Kuveyt Türk Katılım Bankası A.Ş.", shortName: "Kuveyt Türk", type: "katilim", branchPattern: LEADING_BRANCH_4 },
  { code: "00206", name: "Türkiye Finans Katılım Bankası A.Ş.", shortName: "Türkiye Finans", type: "katilim" },
  { code: "00209", name: "Ziraat Katılım Bankası A.Ş.", shortName: "Ziraat Katılım", type: "katilim" },
  { code: "00210", name: "Vakıf Katılım Bankası A.Ş.", shortName: "Vakıf Katılım", type: "katilim" },
  { code: "00211", name: "Türkiye Emlak Katılım Bankası A.Ş.", shortName: "Emlak Katılım", type: "katilim" },
  { code: "00212", name: "Hayat Finans Katılım Bankası A.Ş.", shortName: "Hayat Finans", type: "katilim" },
  { code: "00213", name: "T.O.M. Katılım Bankası A.Ş.", shortName: "TOM Bank", type: "katilim" },
  { code: "00214", name: "Dünya Katılım Bankası A.Ş.", shortName: "Dünya Katılım", type: "katilim" },
  { code: "00215", name: "Adil Katılım Bankası A.Ş.", shortName: "Adil Katılım", type: "katilim" },
  { code: "00807", name: "Posta ve Telgraf Teşkilatı A.Ş. (PTT)", shortName: "PTT", type: "diger" },
];

const bankIndex = new Map(BANKS.map((b) => [b.code, b]));

export function findBankByCode(code: string): Bank | undefined {
  return bankIndex.get(code.padStart(5, "0"));
}
