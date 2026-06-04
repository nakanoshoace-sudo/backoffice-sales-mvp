/**
 * スコアリングロジック
 * ルールベースのシンプルなスコアリング
 */

interface ScoreInput {
  urgency?: string;
  employee_size?: string;
  pain_points?: string[];
}

/** フォーム送信時の初期スコア計算 */
export function calculateInitialScore(input: ScoreInput): number {
  let score = 10; // フォーム送信 base

  // 緊急度スコア
  if (input.urgency === "urgent") {
    score += 10;
  } else if (input.urgency === "somewhat") {
    score += 5;
  }

  // 従業員規模がターゲットレンジ (5-30)
  const targetSizes = ["5-10", "11-20", "21-30"];
  if (input.employee_size && targetSizes.includes(input.employee_size)) {
    score += 5;
  }

  // 課題が多いほどニーズ高
  if (input.pain_points && input.pain_points.length >= 3) {
    score += 5;
  }

  return score;
}

/** イベントベースのスコア加算値 */
export const SCORE_EVENTS = {
  form_submitted: 10,
  email_clicked: 5,
  page_visited_book: 10,
  booking_created: 20,
} as const;

/** スコアを加算して返す */
export function addScore(currentScore: number, event: keyof typeof SCORE_EVENTS): number {
  return currentScore + SCORE_EVENTS[event];
}
