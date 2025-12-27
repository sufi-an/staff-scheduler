import { Metadata } from "next"
import { SchedulerView } from "./_components/scheduler/scheduler_view"

export const metadata: Metadata = {
  title: "Schedule | Admin",
  description: "Manage staff shifts and weekly rosters",
}

export default function SchedulePage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white">
      <SchedulerView />
    </div>
  )
}