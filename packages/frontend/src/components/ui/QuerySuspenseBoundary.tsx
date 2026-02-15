import { Suspense, type ReactNode, type ComponentType } from "react"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import { useQueryClient } from "@tanstack/react-query"
import { QueryErrorFallback } from "./QueryErrorFallback"
import { DefaultLoadingSkeleton } from "./DefaultLoadingSkeleton"

type Props = {
  children: ReactNode
  loadingFallback?: ReactNode
  ErrorFallbackComponent?: ComponentType<FallbackProps>
  resetKeys?: unknown[]
}

export function QuerySuspenseBoundary({
  children,
  loadingFallback,
  ErrorFallbackComponent,
  resetKeys,
}: Props) {
  const queryClient = useQueryClient()

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallbackComponent ?? QueryErrorFallback}
      onReset={() => queryClient.resetQueries()}
      resetKeys={resetKeys}
    >
      <Suspense fallback={loadingFallback ?? <DefaultLoadingSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
