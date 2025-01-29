import { PropsWithChildren } from "react";
import { QueryClientProvider as Provider, QueryClient } from "react-query";

const client = new QueryClient();

export default function QueryClientProvider({ children }: PropsWithChildren) {
  return <Provider client={client}>{children}</Provider>;
}
