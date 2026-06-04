import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-gray-900">
            オンラインバックオフィス代行
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">プライバシーポリシー</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-700">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">1. 個人情報の取得</h2>
            <p>
              当サービスでは、無料診断フォームおよびお問い合わせを通じて、以下の個人情報を取得いたします。
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>会社名</li>
              <li>氏名</li>
              <li>メールアドレス</li>
              <li>役職</li>
              <li>従業員規模</li>
              <li>業務に関するお悩み</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">2. 利用目的</h2>
            <p>取得した個人情報は、以下の目的で利用いたします。</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>サービスのご案内およびご提案</li>
              <li>無料診断結果のご連絡</li>
              <li>商談のご案内</li>
              <li>サービス改善のための分析</li>
              <li>お問い合わせへの対応</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">3. 第三者への提供</h2>
            <p>
              法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">4. メール配信について</h2>
            <p>
              フォーム送信後、サービスに関するご案内メールをお送りする場合があります。
              配信停止をご希望の場合は、メール内の配信停止リンクよりお手続きいただけます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">5. 個人情報の管理</h2>
            <p>
              個人情報の漏洩、紛失、改ざん等を防止するため、適切な安全管理措置を講じます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">6. お問い合わせ</h2>
            <p>
              個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
            </p>
            <p className="mt-2">
              メール: info@example.com
            </p>
          </section>

          <p className="text-gray-500 mt-8">制定日: 2024年1月1日</p>
        </div>
      </main>

      <footer className="py-8 px-4 border-t text-center text-sm text-gray-500">
        <p>© 2024 オンラインバックオフィス代行</p>
      </footer>
    </div>
  );
}
