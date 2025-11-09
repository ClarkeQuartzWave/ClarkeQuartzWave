import { infiniteQueryOptions } from "@tanstack/react-query";
import { api } from "../lib/api";
import { applicationQueryKeys } from "./queryKeys";
import { applicationsSchema } from "./schema/applicationSchema";

export const APPLICATIONS_PAGE_SIZE = 5;

export const getApplicationOptions = () =>
	infiniteQueryOptions({
		queryKey: applicationQueryKeys.infinite(),
		queryFn: fetchApplications,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === APPLICATIONS_PAGE_SIZE
				? allPages.length + 1
				: undefined,
	});

export const fetchApplications = async ({ pageParam = 1 }) => {
	const res = await api
		.get("http://localhost:3001/api/applications", {
			searchParams: {
				_page: pageParam,
				_limit: APPLICATIONS_PAGE_SIZE,
			},
		})
		.json();

	return applicationsSchema.parse(res);
};
