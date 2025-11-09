import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
	APPLICATIONS_PAGE_SIZE,
	getApplicationOptions,
} from "@/api/getApplicationOptions";
import SingleApplication from "@/SingleApplication";
import { Button } from "@/ui/Button/Button";
import { Skeleton } from "./Skeleton";

export const ApplicationsContent = () => {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery({ ...getApplicationOptions() });

	return (
		<>
			{data.pages.flat().map((item) => (
				<SingleApplication key={item.id} application={item} />
			))}

			{isFetchingNextPage && (
				<div className="mt-4 space-y-4">
					{Array.from({ length: APPLICATIONS_PAGE_SIZE }).map((_i, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton, will just disappear when data loads
						<Skeleton className="h-24 w-full mb-4" key={index} />
					))}
				</div>
			)}

			{hasNextPage ? (
				<Button className="mx-auto block" onClick={() => fetchNextPage()}>
					Show More
				</Button>
			) : (
				<Button disabled className="mx-auto block">
					No more data to display...
				</Button>
			)}
		</>
	);
};
