'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SignInForm() {
  const router = useRouter()

  const handleLogin = () => {
    // Simulating a login by setting a cookie
    document.cookie = "auth-token=xyz-secret-token; path=/"
    
    router.push("/dashboard")
  }

  return (
    <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md border border-slate-100">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
        <p className="text-sm text-slate-500 mt-2">Enter your credentials to access the private area</p>
      </div>
      
      <div className="space-y-4">
        {/*  add Input fields here  */}
        <Button onClick={handleLogin} className="w-full">
          Sign In (Simulated)
        </Button>
      </div>
    </div>
  )
}