import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  
  const hasAuthToken = cookieStore.has("auth-token");

  if (hasAuthToken) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }
}