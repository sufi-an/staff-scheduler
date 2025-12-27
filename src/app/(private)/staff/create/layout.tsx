export default function CreateStaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}