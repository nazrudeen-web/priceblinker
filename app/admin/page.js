
import StatsCards from "@/components/admin/stats-cards";
import QuickActions from "@/components/admin/quick-actions";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome back! Here's what's happening with your price comparison
          platform.
        </p>
      </header>

      {/* Statistics Section */}
      <section aria-label="Dashboard Statistics">
        <StatsCards />
      </section>

      {/* Actions Section */}
      <section aria-label="Quick Actions" className="grid gap-6 md:grid-cols-2">
        <QuickActions />
      </section>
    </div>
  );
}
