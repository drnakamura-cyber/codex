import { checkOptions, hasRedFlags, redFlagOptions, scoreFormulas, type CheckItem, type RedFlag } from "@/lib/rules";

type ResultPageProps = {
  searchParams: {
    symptoms?: string;
    checks?: string | string[];
    redFlags?: string | string[];
  };
};

function normalizeParam(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default function ResultPage({ searchParams }: ResultPageProps) {
  const selectedChecks = normalizeParam(searchParams.checks).filter((item): item is CheckItem =>
    checkOptions.some((option) => option.key === item)
  );
  const selectedRedFlags = normalizeParam(searchParams.redFlags).filter((item): item is RedFlag =>
    redFlagOptions.some((option) => option.key === item)
  );
  const symptoms = searchParams.symptoms ?? "";

  const redFlagHit = hasRedFlags(selectedRedFlags);

  if (redFlagHit) {
    return (
      <main>
        <h1>提案結果（参考情報）</h1>
        <section className="card red-flag">
          <h2>受診を強くおすすめします</h2>
          <p>
            胸痛・呼吸困難・意識障害・黒色便・持続する高熱などの赤旗症状があるため、このツールでは漢方候補を表示しません。
            できるだけ早く医療機関を受診してください。症状が強い場合は救急要請を検討してください。
          </p>
        </section>
      </main>
    );
  }

  const topThree = scoreFormulas(selectedChecks);

  return (
    <main>
      <h1>提案結果（参考情報）</h1>

      <section className="card">
        <h2>入力内容</h2>
        <p>
          <strong>症状メモ：</strong>
          {symptoms.trim() ? symptoms : "（入力なし）"}
        </p>
        <p>
          <strong>チェック：</strong>
          {selectedChecks.length > 0
            ? selectedChecks
                .map((check) => checkOptions.find((option) => option.key === check)?.label ?? check)
                .join("、")
            : "（選択なし）"}
        </p>
      </section>

      <section className="card">
        <h2>候補方剤（上位3つ）</h2>
        {topThree.map((item) => (
          <article key={item.id} className="card result-item">
            <h3>
              {item.name}（スコア: {item.score}）
            </h3>
            <p>{item.category}</p>
            <p>{item.description}</p>
            <ul>
              {item.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>注意書き</h2>
        <ul>
          <li>本結果は参考情報であり、診断や処方を確定するものではありません。</li>
          <li>服薬中・妊娠中・授乳中・持病がある方は、必ず医師・薬剤師に相談してください。</li>
          <li>症状が悪化する、長引く、または不安が強い場合は受診してください。</li>
        </ul>
      </section>
    </main>
  );
}
