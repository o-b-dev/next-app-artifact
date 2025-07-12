import { useCallback } from 'react'

interface UseErrorHandlingProps {
  error: string | null
  isRetrying: boolean
  setError: (error: string | null) => void
  setIsRetrying: (isRetrying: boolean) => void
  onRetry: () => Promise<void>
}

export function useErrorHandling({ error, isRetrying, setError, setIsRetrying, onRetry }: UseErrorHandlingProps) {
  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  const handleRetry = useCallback(async () => {
    if (!error) return

    setIsRetrying(true)
    setError(null)

    try {
      await onRetry()
    } catch {
      setError('重试失败，请稍后再试')
    } finally {
      setIsRetrying(false)
    }
  }, [error, setError, setIsRetrying, onRetry])

  const setErrorMessage = useCallback(
    (message: string) => {
      setError(message)
    },
    [setError]
  )

  return {
    error,
    isRetrying,
    clearError,
    handleRetry,
    setErrorMessage
  }
}
