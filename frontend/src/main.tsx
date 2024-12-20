import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { ChakraProvider } from "@chakra-ui/react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "./index.css";

// Initialize router
const router = createRouter({ routeTree });

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
    <ChakraProvider>
      <RouterProvider router={router}>
        {/* Move devtools inside RouterProvider */}
        {process.env.NODE_ENV === 'development' && (
          <TanStackRouterDevtools router={router} position="bottom-right" />
        )}
      </RouterProvider>
    </ChakraProvider>
  </StrictMode>
);
