import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-duo-nightBg transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <div className="px-4 md:px-8">
          <TopBar />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}