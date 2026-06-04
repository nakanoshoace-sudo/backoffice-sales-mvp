/**
 * メールリンクをトラッキングURLに変換するユーティリティ
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * 予約URLをトラッキングリンクに変換
 */
export function trackableBookingUrl(leadId: string, messageId: string, originalUrl: string): string {
  const params = new URLSearchParams({
    mid: messageId,
    lid: leadId,
    url: originalUrl,
  });
  return `${SITE_URL}/api/track/click?${params.toString()}`;
}

/**
 * テンプレート内のbooking_urlを差し替えて、トラッキング付きにする
 */
export function wrapLinksWithTracking(
  body: string,
  leadId: string,
  messageId: string
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // booking_url のパターンを検出して差し替え
  const bookingUrlPattern = new RegExp(
    `${siteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/book\\?[^\\s]+`,
    "g"
  );

  return body.replace(bookingUrlPattern, (match) => {
    const params = new URLSearchParams({
      mid: messageId,
      lid: leadId,
      url: match,
    });
    return `${siteUrl}/api/track/click?${params.toString()}`;
  });
}
