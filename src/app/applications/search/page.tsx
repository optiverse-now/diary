import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Search() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <h1>Search</h1>
      </main>
    </div>
  );
}
