import Link from "next/link";
import { checkOptions, redFlagOptions } from "@/lib/rules";

export default function Home() {
  return (
    <main>
      <h1>漢方候補サジェスト（参考用）</h1>
      <p className="note">
        このアプリは症状と簡易質問から漢方薬の候補を示す参考ツールです。診断・処方の断定は行いません。
      </p>

      <form action="/result" method="get" className="card grid">
        <label htmlFor="symptoms">症状メモ（自由入力）</label>
        <textarea
          id="symptoms"
          name="symptoms"
          placeholder="例：冷えと便秘が続いている。夕方にむくみが強い。"
        />

        <h2>簡易チェック（あてはまるものにチェック）</h2>
        {checkOptions.map((option) => (
          <label key={option.key}>
            <input type="checkbox" name="checks" value={option.key} /> {option.label}
          </label>
        ))}

        <h2>赤旗症状（あてはまる場合は候補を表示しません）</h2>
        {redFlagOptions.map((option) => (
          <label key={option.key}>
            <input type="checkbox" name="redFlags" value={option.key} /> {option.label}
          </label>
        ))}

        <button type="submit">候補を表示する</button>
      </form>

      <small>
        ※緊急性が疑われる場合はこのツールを使わず、救急要請や医療機関受診を優先してください。
      </small>

      <p>
        <Link href="/result">入力せずに結果ページを確認する</Link>
      </p>
    </main>
  );
}
