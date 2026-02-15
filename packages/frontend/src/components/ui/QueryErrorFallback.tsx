import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import { isAxiosError } from "axios"
import type { FallbackProps } from "react-error-boundary"

function getErrorDetails(error: unknown) {
  if (isAxiosError<{ message: string }>(error)) {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    if (status === 404) return { title: "Not Found", message }
    if (status === 403) return { title: "Access Denied", message }

    return { title: "Request Failed", message }
  }

  if (error instanceof Error) {
    return { title: "Something went wrong", message: error.message }
  }

  return {
    title: "Something went wrong",
    message: "An unexpected error occurred",
  }
}

export function QueryErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const { title, message } = getErrorDetails(error)

  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={resetErrorBoundary}>
          Retry
        </Button>
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  )
}
