import { QueryClient } from "@tanstack/react-query";

const API_BASE_URL = 
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000" 
    : "";

// ✅ helper function to throw error if response not OK
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}


// ✅ define behavior for 401 errors
type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn =
  <T>({ on401 }: { on401: UnauthorizedBehavior }) =>
    async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<T> => {
      const url = queryKey.join("/") as string;
      const res = await fetch(`${API_BASE_URL}/${url}`, { credentials: "include" });

      if (on401 === "returnNull" && res.status === 401) {
        return null as T;
      }

      await throwIfResNotOk(res);
      return (await res.json()) as T;
    };


// ✅ create and export query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
