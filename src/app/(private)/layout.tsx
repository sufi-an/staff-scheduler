import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "./_components/header/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-screen bg-slate-50/50 flex flex-col">
        <Header />

        {/*  page content renders below */}
        <div className="flex-1 px-6 pb-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
