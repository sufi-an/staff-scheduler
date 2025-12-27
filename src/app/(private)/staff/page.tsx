import { Metadata } from "next"
import StaffGrid from "./list/_components/grid/staff_grid"

export const metadata: Metadata = {
  title: "Staff Management | Admin",
  description: "View and manage team members",
}

export default function StaffPage() {
  return (
    <main className="w-full h-full">
      <StaffGrid />
    </main>
  )
}