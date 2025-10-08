'use client'

import { Button } from '@workspace/ui/components/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const SwitchTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button className="fixed left-4 top-4 m-4" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? <Moon /> : <Sun />}
    </Button>
  )
}

export default SwitchTheme
