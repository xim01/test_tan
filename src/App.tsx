import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { AuthFlow } from "./components/AuthFlow";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthFlow />
    </QueryClientProvider>
  );
}
