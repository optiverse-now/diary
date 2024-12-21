import { SidebarTrigger } from "../../../components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"

export default function Calendar() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <h1>Calendar</h1>
      </main>
    </div>
  );
}
