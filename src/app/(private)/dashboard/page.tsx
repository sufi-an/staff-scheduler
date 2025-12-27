import { Metadata } from "next"
import { DashboardView } from "./_components/dashboard.view"

export const metadata: Metadata = {
  title: "Dashboard | My App",
  description: "Private user management area",
}

export default function DashboardPage() {
  return (
    <main>
      <DashboardView />
    </main>
  )
}