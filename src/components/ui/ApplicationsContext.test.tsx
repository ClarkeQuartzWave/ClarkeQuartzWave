import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import nock from "nock";
import { beforeEach, describe, expect, it } from "vitest";

import {
	APPLICATIONS_PAGE_SIZE,
	getApplicationOptions,
} from "@/api/getApplicationOptions";
import { applicationsSchema } from "@/api/schema/applicationSchema";

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});
	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
	return { wrapper, queryClient };
};

function generateMockedResponse(page: number) {
	const iso = "2025-01-01T00:00:00.000Z";
	const start = (page - 1) * APPLICATIONS_PAGE_SIZE;

	return Array.from({ length: APPLICATIONS_PAGE_SIZE }, (_, i) => ({
		id: start + i + 1,
		first_name: `Sherman ${i}`,
		last_name: "Test",
		loan_amount: 1000,
		loan_type: "CBILS" as const,
		email: "test@example.com",
		company: "Test Co",
		date_created: iso,
		expiry_date: iso,
		avatar: "https://example.com/avatar.png",
		loan_history: [],
	}));
}

describe("getApplicationOptions", () => {
	beforeEach(() => {
		nock.cleanAll();
	});

	it("fetches the first page successfully", async () => {
		nock("http://localhost:3001")
			.get("/api/applications")
			.query({ _page: "1", _limit: APPLICATIONS_PAGE_SIZE.toString() })
			.reply(200, generateMockedResponse(1));

		const { wrapper } = createWrapper();
		const { result } = renderHook(
			() => {
				const opts = getApplicationOptions();
				return opts.queryFn({ pageParam: 1 } as any);
			},
			{ wrapper },
		);

		const data = await result.current;
		const parsed = applicationsSchema.parse(generateMockedResponse(1));

		expect(data).toEqual(parsed);
	});

	it("loads additional pages with useInfiniteQuery semantics", async () => {
		nock("http://localhost:3001")
			.persist()
			.get("/api/applications")
			.query(true)
			.reply(200, (uri) => {
				const url = new URL(`http://localhost:3001${uri}`);
				const page = Number(url.searchParams.get("_page")) || 1;
				return generateMockedResponse(page);
			});

		const { wrapper } = createWrapper();

		const { result } = renderHook(
			() => {
				const opts = getApplicationOptions();
				return opts;
			},
			{ wrapper },
		);

		// I hate casting but I ran out of time to sort a type error
		const firstPage = await result.current.queryFn({ pageParam: 1 } as any);
		expect(firstPage).toEqual(
			applicationsSchema.parse(generateMockedResponse(1)),
		);

		const secondPage = await result.current.queryFn({ pageParam: 2 } as any);
		expect(secondPage).toEqual(
			applicationsSchema.parse(generateMockedResponse(2)),
		);
	});

	it("correctly returns next page param when full page fetched", () => {
		const opts = getApplicationOptions();
		const lastPage = generateMockedResponse(1);
		const allPages = [lastPage];

		const next = opts.getNextPageParam(lastPage, allPages, 1, [1]);
		expect(next).toBe(2);
	});

	it("returns undefined when last page shorter than page size", () => {
		const opts = getApplicationOptions();
		const lastPage = generateMockedResponse(1).slice(0, 3);
		const allPages = [lastPage];

		const next = opts.getNextPageParam(lastPage, allPages, 1, [1]);
		expect(next).toBeUndefined();
	});
});
