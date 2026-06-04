// Lead statuses
export const LEAD_STATUSES = [
  "new",
  "contacted",
  "engaged",
  "booked",
  "proposal",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "新規",
  contacted: "接触済み",
  engaged: "関心あり",
  booked: "予約済み",
  proposal: "提案中",
  won: "成約",
  lost: "失注",
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-gray-100 text-gray-800",
  contacted: "bg-blue-100 text-blue-800",
  engaged: "bg-yellow-100 text-yellow-800",
  booked: "bg-purple-100 text-purple-800",
  proposal: "bg-orange-100 text-orange-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

// Urgency levels
export const URGENCY_LEVELS = [
  "urgent",
  "somewhat",
  "researching",
  "undecided",
] as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  urgent: "すぐにでも",
  somewhat: "1〜3ヶ月以内",
  researching: "半年以内",
  undecided: "未定",
};

// Pain points
export const PAIN_POINTS = [
  "経理",
  "請求",
  "データ入力",
  "秘書",
  "総務",
  "採用事務",
  "その他",
] as const;

// Employee size options
export const EMPLOYEE_SIZES = [
  "1-4",
  "5-10",
  "11-20",
  "21-30",
  "31-50",
  "51+",
] as const;

export const EMPLOYEE_SIZE_LABELS: Record<string, string> = {
  "1-4": "1〜4名",
  "5-10": "5〜10名",
  "11-20": "11〜20名",
  "21-30": "21〜30名",
  "31-50": "31〜50名",
  "51+": "51名以上",
};

// Event types
export const EVENT_TYPES = [
  "form_submitted",
  "email_sent",
  "email_clicked",
  "page_visited",
  "status_changed",
  "score_changed",
  "booking_created",
  "unsubscribed",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  form_submitted: "フォーム送信",
  email_sent: "メール送信",
  email_clicked: "リンククリック",
  page_visited: "ページ訪問",
  status_changed: "ステータス変更",
  score_changed: "スコア変更",
  booking_created: "予約作成",
  unsubscribed: "配信停止",
};
