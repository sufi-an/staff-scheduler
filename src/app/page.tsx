import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  // 1. Get the cookie store
  const cookieStore = await cookies();
  
  // 2. Check if our dummy "auth-token" exists
  const hasAuthToken = cookieStore.has("auth-token");

  // 3. Redirect based on the cookie
  if (hasAuthToken) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }
}