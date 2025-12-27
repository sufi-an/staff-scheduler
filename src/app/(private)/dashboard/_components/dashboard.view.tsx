'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// Define a type for safety (optional but good practice)
type User = {
  id: string
  name: string | null
  email: string
}

export function DashboardView() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch users", err)
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    // Clear the auth cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // Redirect to sign-in
    window.location.href = "/sign-in"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Private Dashboard</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="rounded-lg border bg-slate-50 p-4 shadow-sm">
        <h2 className="font-semibold mb-4 text-sm uppercase text-slate-500">
          User Registry (SQLite)
        </h2>
        
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading users...</p>
        ) : (
          <div className="bg-white p-4 rounded border text-xs font-mono overflow-auto max-h-[400px]">
             {/* Using JSON.stringify for raw display as requested */}
            <pre>{JSON.stringify(users, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}