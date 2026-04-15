"use client";

import { QueryClient, QueryClientProvider as BaseQueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return <BaseQueryClientProvider client={queryClient}>{children}</BaseQueryClientProvider>;
}
