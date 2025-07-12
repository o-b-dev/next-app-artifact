import { useCallback } from 'react'

interface UseToolActionsProps {
  addToolResult: (params: { toolCallId: string; output: string }) => void
}

export function useToolActions({ addToolResult }: UseToolActionsProps) {
  const handleToolResult = useCallback(
    (params: { toolCallId: string; output: string }) => {
      void addToolResult(params)
    },
    [addToolResult]
  )

  const handleConfirmAction = useCallback(
    (toolCallId: string) => {
      void addToolResult({
        toolCallId,
        output: 'Yes, confirmed.'
      })
    },
    [addToolResult]
  )

  const handleDenyAction = useCallback(
    (toolCallId: string) => {
      void addToolResult({
        toolCallId,
        output: 'No, denied'
      })
    },
    [addToolResult]
  )

  return {
    handleToolResult,
    handleConfirmAction,
    handleDenyAction
  }
}
