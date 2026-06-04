import { z } from "zod";

export const diagnosisFormSchema = z.object({
  company_name: z.string().min(1, "会社名を入力してください"),
  person_name: z.string().min(1, "氏名を入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  title: z.string().optional(),
  employee_size: z.string().min(1, "従業員数を選択してください"),
  pain_points: z.array(z.string()).min(1, "困っている業務を1つ以上選択してください"),
  urgency: z.enum(["urgent", "somewhat", "researching", "undecided"], {
    required_error: "検討時期を選択してください",
  }),
  notes: z.string().optional(),
  source: z.string().optional(),
  campaign: z.string().optional(),
  privacy_agreed: z.literal(true, {
    errorMap: () => ({ message: "プライバシーポリシーへの同意が必要です" }),
  }),
});

export type DiagnosisFormData = z.infer<typeof diagnosisFormSchema>;

export const statusUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "engaged", "booked", "proposal", "won", "lost"]),
  reason: z.string().optional(),
});

export const bookingCreateSchema = z.object({
  lead_id: z.string().uuid(),
  booking_source: z.string().default("form"),
  meeting_at: z.string().optional(),
  note: z.string().optional(),
});

export const emailSendSchema = z.object({
  lead_id: z.string().uuid(),
  template_key: z.string().min(1),
});
