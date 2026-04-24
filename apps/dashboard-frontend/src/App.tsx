import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";
import { Landing } from "./pages/Landing";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { ApiKeys } from "./pages/ApiKeys";
import { Credits } from "./pages/Credits";
import { useElysiaClient } from "./providers/Eden";
import "./index.css";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const client = useElysiaClient();
  const profileQuery = useQuery({
    queryKey: ["user-profile"],
    retry: false,
    queryFn: async () => {
      const response = await client.auth.profile.get();
      if (response.error) {
        throw new Error("Unauthorized");
      }
      return response.data;
    },
  });

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center">
        <p className="text-sm text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  if (profileQuery.isError) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>{children}</>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api-keys"
            element={
              <ProtectedRoute>
                <ApiKeys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credits"
            element={
              <ProtectedRoute>
                <Credits />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
