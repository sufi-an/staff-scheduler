import { Metadata } from "next"
import { SignInForm } from "./_components/sign_in.form"

export const metadata: Metadata = {
  title: "Sign In | My App",
  description: "Login to your account",
}

export default function SignInPage() {
  return <SignInForm />
}