import formulas from "@/data/formulas.json";

export type CheckItem =
  | "cold"
  | "constipation"
  | "edema"
  | "fatigue"
  | "stress"
  | "insomnia"
  | "headache"
  | "poorAppetite"
  | "dryness"
  | "dryCough"
  | "runnyNose"
  | "cough"
  | "chills"
  | "fever"
  | "abdominalFullness"
  | "irritability"
  | "dizziness"
  | "bodyAche";

export type RedFlag = "chestPain" | "dyspnea" | "consciousness" | "melena" | "persistentHighFever";

type Formula = {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: CheckItem[];
};

const ruleWeights: Partial<Record<CheckItem, number>> = {
  cold: 3,
  constipation: 4,
  edema: 3,
  fatigue: 2,
  stress: 3,
  insomnia: 2,
  headache: 2,
  poorAppetite: 3,
  dryness: 3,
  dryCough: 3,
  runnyNose: 2,
  cough: 2,
  chills: 2,
  fever: 1,
  abdominalFullness: 2,
  irritability: 2,
  dizziness: 2,
  bodyAche: 2
};

const ruleReasons: Partial<Record<CheckItem, string>> = {
  cold: "「冷え」があるため、体を温める方向の方剤を加点",
  constipation: "「便秘」があるため、瀉下・潤腸系を加点",
  edema: "「むくみ」があるため、水分代謝を整える方剤を加点",
  fatigue: "「疲労感」があるため、補気系を加点",
  stress: "「ストレス」を伴うため、気の巡りを整える方剤を加点",
  dryness: "「乾燥傾向」があるため、潤す方向の方剤を加点",
  poorAppetite: "「食欲低下」があるため、胃腸機能を補う方剤を加点"
};

export const checkOptions: { key: CheckItem; label: string }[] = [
  { key: "cold", label: "冷えがつらい" },
  { key: "constipation", label: "便秘がある" },
  { key: "edema", label: "むくみがある" },
  { key: "fatigue", label: "疲れやすい" },
  { key: "stress", label: "ストレス・緊張が強い" },
  { key: "insomnia", label: "眠りが浅い" },
  { key: "headache", label: "頭痛がある" },
  { key: "poorAppetite", label: "食欲が落ちている" },
  { key: "dryness", label: "口や喉、便の乾燥感がある" },
  { key: "dryCough", label: "乾いた咳が出る" },
  { key: "runnyNose", label: "水っぽい鼻水が出る" },
  { key: "cough", label: "咳が出る" },
  { key: "chills", label: "悪寒がある" },
  { key: "fever", label: "発熱がある" }
];

export const redFlagOptions: { key: RedFlag; label: string }[] = [
  { key: "chestPain", label: "胸痛がある" },
  { key: "dyspnea", label: "呼吸困難（息苦しさ）がある" },
  { key: "consciousness", label: "意識障害・もうろうがある" },
  { key: "melena", label: "黒色便がある" },
  { key: "persistentHighFever", label: "高熱（目安38.5℃以上）が持続する" }
];

export function hasRedFlags(redFlags: RedFlag[]): boolean {
  return redFlags.length > 0;
}

export function scoreFormulas(selected: CheckItem[]) {
  const selectedSet = new Set(selected);

  return (formulas as Formula[])
    .map((formula) => {
      const matched = formula.tags.filter((tag) => selectedSet.has(tag));
      const score = matched.reduce((acc, tag) => acc + (ruleWeights[tag] ?? 1), 0);
      const reasons = matched.map(
        (tag) => ruleReasons[tag] ?? `「${checkOptions.find((c) => c.key === tag)?.label ?? tag}」に一致`
      );

      return {
        ...formula,
        score,
        reasons
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
