// 天文計算による旧暦（太陰太陽暦）エンジン。
// 太陽・月の黄経から朔（新月）と中気を求め、閏月を含む旧暦の月・日を算出する。
// 日界は日本標準時（JST=UT+9）基準。六曜・紫微斗数などで使用。

const D2R = Math.PI / 180;
const SYN = 29.530588861; // 朔望月

function julianDayNoon(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
    Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function sunLon(jd: number): number {
  const T = (jd - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = (357.52911 + 35999.05029 * T) * D2R;
  const C = (1.9146 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M) + 0.00029 * Math.sin(3 * M);
  return ((L0 + C) % 360 + 360) % 360;
}

// 高精度の月黄経（Meeus 主要27項・誤差約0.01°）
function moonLon(jd: number): number {
  const T = (jd - 2451545) / 36525;
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = (297.8501921 + 445267.1114034 * T) * D2R;
  const M = (357.5291092 + 35999.0502909 * T) * D2R;
  const Mp = (134.9633964 + 477198.8675055 * T) * D2R;
  const F = (93.272095 + 483202.0175233 * T) * D2R;
  const terms: [number, number][] = [
    [6.288774, Mp], [1.274027, 2 * D - Mp], [0.658314, 2 * D], [0.213618, 2 * Mp],
    [-0.185116, M], [-0.114332, 2 * F], [0.058793, 2 * D - 2 * Mp], [0.057066, 2 * D - M - Mp],
    [0.053322, 2 * D + Mp], [0.045758, 2 * D - M], [-0.040923, M - Mp], [-0.034720, D],
    [-0.030383, M + Mp], [0.015327, 2 * D - 2 * F], [-0.012528, Mp + 2 * F], [0.010980, Mp - 2 * F],
    [0.010675, 4 * D - Mp], [0.010034, 3 * Mp], [0.008548, 4 * D - 2 * Mp], [-0.007888, 2 * D + M - Mp],
    [-0.006766, 2 * D + M], [-0.005163, D - Mp], [0.004987, D + M], [0.004036, 2 * D - M + Mp],
    [0.003994, 2 * D + 2 * Mp], [0.003861, 4 * D], [0.003665, 2 * D - 3 * Mp],
  ];
  let s = 0;
  for (const [c, a] of terms) s += c * Math.sin(a);
  return ((Lp + s) % 360 + 360) % 360;
}

// JD(UT) → JST civil day number（julianDayNoon と同じ整数体系）
function dayIndex(jd: number): number {
  return Math.floor(jd + 0.5 + 9 / 24);
}

// 朔（新月）の JD。k は朔望月の通し番号
function newMoonJD(k: number): number {
  let jd = 2451550.09766 + SYN * k;
  for (let i = 0; i < 8; i++) {
    let e = moonLon(jd) - sunLon(jd);
    e = ((e % 360) + 360) % 360;
    if (e > 180) e -= 360;
    jd -= e / 12.190749;
  }
  return jd;
}

function newMoonIndexOnOrBefore(dn: number): number {
  let k = Math.floor((dn - 2451550.09766) / SYN);
  while (dayIndex(newMoonJD(k)) > dn) k--;
  while (dayIndex(newMoonJD(k + 1)) <= dn) k++;
  return k;
}

// 太陽黄経が target になる JD（中気・節気の計算）
function solarTermJD(target: number, guess: number): number {
  let jd = guess;
  for (let i = 0; i < 8; i++) {
    let diff = sunLon(jd) - target;
    diff = ((diff % 360) + 360) % 360;
    if (diff > 180) diff -= 360;
    jd -= diff / 0.985647;
  }
  return jd;
}

// 朔望月 [k, k+1) が中気（黄経30°の倍数）を含むか
function hasMajorTerm(kStart: number): boolean {
  const a = newMoonJD(kStart), b = newMoonJD(kStart + 1);
  let sa = sunLon(a), sb = sunLon(b);
  if (sb < sa) sb += 360;
  return Math.floor(sa / 30) !== Math.floor(sb / 30);
}

export type LunarDate = { month: number; day: number; isLeap: boolean; leapYear: boolean };

// 西暦(JST) → 旧暦（月・日・閏か）
export function toLunar(y: number, m: number, d: number): LunarDate {
  const dn = julianDayNoon(y, m, d);
  const k = newMoonIndexOnOrBefore(dn);
  const day = dn - dayIndex(newMoonJD(k)) + 1;

  // 冬至（黄経270°）を含む月＝十一月。当該「歳」の起点を求める
  const winterDec = solarTermJD(270, julianDayNoon(y, 12, 22));
  const winterPrev = solarTermJD(270, julianDayNoon(y - 1, 12, 22));
  const k11this = newMoonIndexOnOrBefore(dayIndex(winterDec));
  const k11prev = newMoonIndexOnOrBefore(dayIndex(winterPrev));

  let base: number, nextWinterK: number;
  if (k >= k11this) {
    base = k11this;
    nextWinterK = newMoonIndexOnOrBefore(dayIndex(solarTermJD(270, julianDayNoon(y + 1, 12, 22))));
  } else {
    base = k11prev;
    nextWinterK = k11this;
  }

  const monthsInSui = nextWinterK - base;
  const leapYear = monthsInSui === 13;
  let leapOffset = -1;
  if (leapYear) {
    for (let i = 1; i < 13; i++) {
      if (!hasMajorTerm(base + i)) { leapOffset = i; break; }
    }
  }

  const offset = k - base;
  let isLeap = false;
  let month: number;
  if (leapOffset >= 0 && offset === leapOffset) {
    isLeap = true;
    month = ((11 - 1 + (offset - 1)) % 12) + 1;
  } else {
    let adj = offset;
    if (leapOffset >= 0 && offset > leapOffset) adj -= 1;
    month = ((11 - 1 + adj) % 12) + 1;
  }
  return { month, day, isLeap, leapYear };
}
