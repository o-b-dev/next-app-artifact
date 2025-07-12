import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'

import { PRESET_ACTIONS } from './constants'

interface PresetActionsProps {
  onActionClick: (prompt: string) => void
  isDisabled?: boolean
}

export function PresetActions({ onActionClick, isDisabled = false }: PresetActionsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">快速开始</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRESET_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="outline"
                className="flex h-auto flex-col items-start gap-2 p-4 text-left"
                onClick={() => onActionClick(action.prompt)}
                disabled={isDisabled}
              >
                <div className="flex w-full items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-muted-foreground text-xs">{action.description}</div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
