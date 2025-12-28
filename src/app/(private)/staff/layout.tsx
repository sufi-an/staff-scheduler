export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen w-full bg-slate-50/50">{children}</div>;
}
