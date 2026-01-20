
import DashboardButton from "@/components/dashboard-button";

export default function Home() {
  return (
    <>
    
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex flex-col justify-center gap-4 mt-10 sm:max-w-[400px] mx-auto">
      <DashboardButton label="Band Schedule" url="https://docs.google.com/spreadsheets/u/0/d/1naOVRBDOi6G_Amtr8U06ITkPpGE9vQC9/htmlview#" isExternal={true} />
      <DashboardButton label="GregMox" url="https://gregmox.c-syncapp.com" isExternal={true} />
      <DashboardButton label="PiHole" url="http://10.24.24.25/admin/login" isExternal={true} />
      <DashboardButton label="Tube Search" url="/tube-search" isExternal={false} />
      </div>
    </section>
    </>
  );
}
