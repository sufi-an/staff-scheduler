export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white p-10">
      <div className="mx-auto max-w-4xl">
        {children}
      </div>
    </div>
  )
}