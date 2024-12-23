import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    window.location.href = '/table';
    return null;
  },
  errorComponent: ({ error }) => {
    console.error(`Error: ${error}`)
    window.location.href = '/table';
    return null;
  }
});

function Header() {
  return (
    <header className="bg-white shadow rounded-lg">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Co-op Salary Sharing</h1>
        </div>
      </div>
    </header>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <main>
          <Header />
          <Outlet />
        </main>
      </div>
    </div >
  );
}
