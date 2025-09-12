import "@fontsource-variable/roboto";
import "@fontsource-variable/pixelify-sans";
import { createRoot } from "react-dom/client";
import "../index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./Dashboard.tsx";
import { createHashRouter, RouterProvider } from "react-router";
import { Layout as UpdateUserLayout } from "./updateUser/Layout.tsx";
import { UpdateUserDone } from "./updateUser/UpdateUserDone.tsx";
import { UpdateUser } from "./updateUser/UpdateUser.tsx";

export const queryClient = new QueryClient();

const router = createHashRouter([
  {
    index: true,
    Component: Dashboard,
  },
  {
    path: "update-user/:id",
    Component: UpdateUserLayout,
    children: [
      {
        index: true,
        Component: UpdateUser,
      },
      {
        path: "thanks",
        Component: UpdateUserDone,
      },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root2")!).render(<App />);
