import * as Sentry from "@sentry/nextjs";

/**
 * エラー監視ユーティリティ
 * - 常に: 構造化JSONログ出力（Vercel Logs で検索可能）
 * - SENTRY_DSN 設定時: Sentry にも送信
 */

interface ErrorContext {
  source: string;
  userId?: string;
  leadId?: string;
  extra?: Record<string, unknown>;
}

/**
 * エラーをキャプチャ
 */
export function captureError(error: unknown, context: ErrorContext): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const timestamp = new Date().toISOString();

  // 構造化ログ
  console.error(
    JSON.stringify({
      level: "error",
      timestamp,
      message: errorObj.message,
      stack: errorObj.stack?.split("\n").slice(0, 5).join("\n"),
      ...context,
    })
  );

  // Sentry 送信
  Sentry.withScope((scope) => {
    scope.setTag("source", context.source);
    if (context.userId) scope.setUser({ id: context.userId });
    if (context.leadId) scope.setTag("lead_id", context.leadId);
    if (context.extra) scope.setExtras(context.extra);
    Sentry.captureException(errorObj);
  });
}

/**
 * 警告レベル
 */
export function captureWarning(message: string, context: ErrorContext): void {
  const timestamp = new Date().toISOString();

  console.warn(JSON.stringify({ level: "warn", timestamp, message, ...context }));

  Sentry.withScope((scope) => {
    scope.setTag("source", context.source);
    scope.setLevel("warning");
    Sentry.captureMessage(message);
  });
}

/**
 * Cron 実行結果ログ
 */
export function logCronResult(
  jobName: string,
  result: { success: boolean; processed?: number; sent?: number; failed?: number }
): void {
  const timestamp = new Date().toISOString();
  const level = result.failed && result.failed > 0 ? "warn" : "info";

  const logEntry = { level, timestamp, source: `cron.${jobName}`, ...result };

  if (level === "warn") {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}
