import { Suspense } from "react";
import { APPLICATIONS_PAGE_SIZE } from "./api/getApplicationOptions";
import { ApplicationsContent } from "./components/ui/ApplicationsContent";
import { Skeleton } from "./components/ui/Skeleton";

const Applications = () => {
	return (
		<div className="w-full max-w-7xl mx-auto p-4">
			<Suspense
				fallback={Array.from({ length: APPLICATIONS_PAGE_SIZE }).map(
					(_i, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton, will just disappear when data loads
						<Skeleton key={index} className="h-24 w-full mb-4" />
					),
				)}
			>
				<ApplicationsContent />
			</Suspense>
		</div>
	);
};

export default Applications;
