'use client'

import ArtifactChat from '@/features/artifact/components/ArtifactChat'

export default function ArtifactPage() {
  return (
    <>
      <h3 className="text-2xl font-bold">Artifact</h3>
      {/* <ArtifactRender code={demoTxt.code} /> */}
      <ArtifactChat autoScroll messageBoxClassName="border-none bg-transparent" />
    </>
  )
}
