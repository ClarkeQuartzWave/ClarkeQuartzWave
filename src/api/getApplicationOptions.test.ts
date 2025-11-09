import nock from "nock";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	APPLICATIONS_PAGE_SIZE,
	fetchApplications,
	getApplicationOptions,
} from "./getApplicationOptions";
import { applicationsSchema } from "./schema/applicationSchema";

describe("fetchApplications", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("requests correct URL and parses response with schema", async () => {
		const fakeData = [
			{
				id: 1,
				first_name: "Oli",
				last_name: "Keane",
				loan_amount: 12345,
				loan_type: "CBILS",
				email: "test@example.com",
				company: "Keyholding Co",
				date_created: new Date("2024-01-01T00:00:00.000Z").toISOString(),
				expiry_date: new Date("2024-01-01T00:00:00.000Z").toISOString(),
				avatar: "https://example.com/avatar.png",
				loan_history: [],
			},
		];

		const scope = nock("http://localhost:3001")
			.get("/api/applications")
			.query({
				_page: "2",
				_limit: APPLICATIONS_PAGE_SIZE.toString(),
			})
			.reply(200, fakeData);

		const result = await fetchApplications({ pageParam: 2 } as any);

		expect(result).toEqual(applicationsSchema.parse(fakeData));

		scope.done();
	});
});

describe("getApplicationOptions", () => {
	it("returns next page param when last page is full", () => {
		const opts = getApplicationOptions();
		const lastPage = Array.from({ length: 5 }, (_, i) => ({
			id: i + 1,
			first_name: "Test",
			last_name: "User",
			loan_amount: 10000,
			loan_type: "CBILS" as const,
			email: `test${i}@example.com`,
			company: "Test Company",
			date_created: new Date().toISOString(),
			expiry_date: new Date().toISOString(),
			avatar: "https://example.com/avatar.png",
			loan_history: [],
		}));
		const allPages = [lastPage];

		const nextPage = opts.getNextPageParam(lastPage, allPages, 1, [1]);
		expect(nextPage).toBe(2);
	});

	it("returns undefined when last page is partial", () => {
		const opts = getApplicationOptions();
		const lastPage = Array.from({ length: 3 }, (_, i) => ({
			id: i + 1,
			first_name: "Test",
			last_name: "User",
			loan_amount: 10000,
			loan_type: "CBILS" as const,
			email: `test${i}@example.com`,
			company: "Test Company",
			date_created: new Date().toISOString(),
			expiry_date: new Date().toISOString(),
			avatar: "https://example.com/avatar.png",
			loan_history: [],
		}));
		const allPages = [lastPage, lastPage];

		const nextPage = opts.getNextPageParam(lastPage, allPages, 1, [1]);

		expect(nextPage).toBeUndefined();
	});
});
