// 入力プロフィール（生年月日・名前など）のローカル保存。
// 一度占った人を端末に保存し、2回目以降は選択で呼び出せるようにする。
// サーバーには送らず localStorage にのみ保存する。

export type Profile = {
  id: string;
  label: string;        // 表示名（名前 or 生年月日）
  birthday?: string;
  birthTime?: string;
  birthPlace?: string;
  name?: string;
};

const KEY = "uranai_profiles";

// プロフィールとして保存・利用するフィールド
const PROFILE_FIELDS = ["birthday", "birthTime", "birthPlace", "name"] as const;

export function getProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeProfiles(list: Profile[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30)));
  } catch {
    /* 容量超過などは無視 */
  }
}

// 同一人物の判定キー（名前＋生年月日）
function identity(p: Pick<Profile, "name" | "birthday">): string {
  return `${(p.name || "").trim()}|${p.birthday || ""}`;
}

// 入力値からプロフィールを抽出（生年月日も名前も無ければ null）
export function extractProfile(values: Record<string, string>): Omit<Profile, "id" | "label"> | null {
  const picked: Record<string, string> = {};
  for (const f of PROFILE_FIELDS) {
    if (values[f]) picked[f] = values[f];
  }
  if (!picked.birthday && !picked.name) return null;
  return picked;
}

function makeLabel(p: Omit<Profile, "id" | "label">): string {
  if (p.name && p.birthday) return `${p.name}（${p.birthday}）`;
  if (p.name) return p.name;
  return p.birthday || "名称未設定";
}

// 入力値を保存（同一人物は上書き）。保存したプロフィールを返す。
export function saveProfileFromValues(values: Record<string, string>): Profile | null {
  const data = extractProfile(values);
  if (!data) return null;
  const list = getProfiles();
  const key = identity(data);
  const existingIdx = list.findIndex((p) => identity(p) === key);
  const profile: Profile = {
    id: existingIdx >= 0 ? list[existingIdx].id : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: makeLabel(data),
    ...data,
  };
  if (existingIdx >= 0) list[existingIdx] = profile;
  else list.unshift(profile);
  writeProfiles(list);
  return profile;
}

export function deleteProfile(id: string) {
  writeProfiles(getProfiles().filter((p) => p.id !== id));
}
