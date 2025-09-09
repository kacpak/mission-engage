import "@fontsource-variable/roboto";
import { createRoot } from "react-dom/client";
import "../index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./Dashboard.tsx";

export const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root2")!).render(<App />);
