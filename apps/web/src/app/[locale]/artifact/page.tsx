'use client'

import ArtifactChat from '@/features/artifact/components/ArtifactChat'
import ArtifactRender from '@/features/artifact/components/ArtifactRender'

import { demoTxt } from './demo'

export default function ArtifactPage() {
  return (
    <>
      <h3 className="text-2xl font-bold">Artifact</h3>
      <ArtifactRender code={demoTxt.code} />
      <ArtifactChat />
    </>
  )
}
