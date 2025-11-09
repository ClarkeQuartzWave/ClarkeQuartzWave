import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import "./App.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster, toast } from "sonner";
import Applications from "./Applications";
import Header from "./Header";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30000,
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(`Something went wrong: ${error.message}`);
		},
	}),
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="App">
				<Header />
				<Applications />
			</div>
			<Toaster position="top-right" />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default App;
