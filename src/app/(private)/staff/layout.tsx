export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50/50">
      {/* You can add staff-specific providers or context here if needed later.
        For now, it acts as a clean container for your grid.
      */}
      {children}
    </div>
  )
}