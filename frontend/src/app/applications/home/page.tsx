
import { SidebarTrigger } from "../../../components/ui/sidebar"
import { AppSidebar } from "../../../components/organisms/AppSidebar"

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <h1>ホーム</h1>
      </main>
    </div>
  );
}
