import { z } from "zod";

export const loanHistorySchema = z.object({
	loan_started: z.iso.datetime(),
	loan_ended: z.iso.datetime(),
	principle: z.number(),
	interest_rate: z.number(),
	interest: z.number(),
});

export const applicationSchema = z.object({
	id: z.number(),
	first_name: z.string(),
	last_name: z.string(),
	loan_amount: z.number(),
	loan_type: z.enum([
		"CBILS",
		"RLS",
		"Business Loan",
		"Flexi-Loan",
		"Cash Advance",
	]),
	email: z.email(),
	company: z.string(),
	date_created: z.iso.datetime(),
	expiry_date: z.iso.datetime(),
	avatar: z.url(),
	loan_history: z.array(loanHistorySchema),
});

export const applicationsSchema = z.array(applicationSchema);

export type Application = z.infer<typeof applicationSchema>;
export type Applications = z.infer<typeof applicationsSchema>;
