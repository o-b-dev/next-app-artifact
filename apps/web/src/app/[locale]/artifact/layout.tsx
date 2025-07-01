export default function ArtifactLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex max-w-screen-lg flex-col gap-4 py-10">{children}</main>
}
