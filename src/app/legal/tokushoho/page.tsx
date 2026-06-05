import Link from "next/link";

const LEGAL_INFO = {
  seller: "SHOACE",
  representative: "中野 翔太",
  address: "〒104-0061 東京都中央区銀座8-10-5 DENSANビル G-62007",
  phone: "お問い合わせはメールにてお願い致します。※必要であれば開示可能",
  email: "nakano.shoace@gmail.com",
  serviceName: "オンラインバックオフィス",
  pricing: [
    "スタータープラン: 月額 45,000円（税別）",
    "スタンダードプラン: 月額 80,000円（税別）",
    "※別途初期費用あり",
  ],
  paymentMethods: "Stripe決済",
  paymentTiming: "月額制（翌月分前払い）",
  deliveryTiming: "契約締結後、準備期間（通常5営業日以内）を経てサービス開始",
  cancellation: [
    "最低契約期間: 1ヶ月",
    "解約: 月末の10営業日前までにご連絡",
    "既にお支払い済みの月額費用の返金は原則不可",
    "初月無条件返金保証あり",
  ],
  additionalCost: "基本料金以外に費用が発生する場合は、事前にお見積もりをご提示いたします",
  lastUpdated: "2026年6月5日",
};

export default function TokushohoPage() {
  const rows: { label: string; content: React.ReactNode }[] = [
    { label: "販売事業者", content: LEGAL_INFO.seller },
    { label: "代表者", content: LEGAL_INFO.representative },
    { label: "所在地", content: LEGAL_INFO.address },
    { label: "電話番号", content: LEGAL_INFO.phone },
    { label: "メールアドレス", content: LEGAL_INFO.email },
    { label: "サービス名", content: LEGAL_INFO.serviceName },
    {
      label: "サービス料金",
      content: (
        <ul className="space-y-1">
          {LEGAL_INFO.pricing.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ),
    },
    { label: "支払い方法", content: LEGAL_INFO.paymentMethods },
    { label: "支払い時期", content: LEGAL_INFO.paymentTiming },
    { label: "サービス提供時期", content: LEGAL_INFO.deliveryTiming },
    {
      label: "解約・返金",
      content: (
        <ul className="space-y-1">
          {LEGAL_INFO.cancellation.map((c) => (
            <li key={c}>• {c}</li>
          ))}
        </ul>
      ),
    },
    { label: "追加費用", content: LEGAL_INFO.additionalCost },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-lg font-bold text-gray-900">
            オンラインバックオフィス代行
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">特定商取引法に基づく表記</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b">
                  <th className="py-4 px-4 text-left bg-gray-50 w-1/3 font-medium text-gray-700">
                    {row.label}
                  </th>
                  <td className="py-4 px-4">{row.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          最終更新日: {LEGAL_INFO.lastUpdated}
        </p>
      </main>

      <footer className="py-8 px-4 border-t">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 オンラインバックオフィス代行</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/" className="hover:text-gray-700 transition-colors">
              トップページ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
