// src/main.tsx
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ChakraProvider } from "@chakra-ui/react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Initialize router with query client
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

// Type declaration
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Initialize router
await router.load();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router}>
          {/* Development tools */}
          {process.env.NODE_ENV === 'development' && (
            <>
              <TanStackRouterDevtools
                router={router}
                position="bottom-right"
                initialIsOpen={false}
              />
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-left"
              />
            </>
          )}
        </RouterProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
