import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    staletime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  }
})

export const QueryProvider = ({children}) => {
  return (
    <QueryClientProvider client={queryClient} >
        {children}
        <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
