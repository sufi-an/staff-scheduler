import { Metadata } from "next"
import { CreateStaffForm } from "./_components/create.form"

export const metadata: Metadata = {
  title: "Add New Staff | Admin",
  description: "Create a new team member",
}

export default function CreateStaffPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Add New Staff</h2>
        <p className="text-slate-500">Enter the details below to onboard a new employee.</p>
      </div>
      
      <CreateStaffForm />
    </div>
  )
}