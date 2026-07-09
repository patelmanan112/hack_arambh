import { WelcomeSection } from "@/components/dashboard/WelcomeSection"
import { HealthScore } from "@/components/dashboard/HealthScore"
import { OverviewStats } from "@/components/dashboard/OverviewStats"
import { ActivityChart } from "@/components/dashboard/ActivityChart"
import { TopContributors } from "@/components/dashboard/TopContributors"
import { AICopilot } from "@/components/dashboard/AICopilot"
import { Timeline } from "@/components/dashboard/Timeline"
import { DecisionGraph } from "@/components/dashboard/DecisionGraph"
import { RuntimeStatus } from "@/components/dashboard/RuntimeStatus"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <WelcomeSection />
      
      <OverviewStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HealthScore />
        <ActivityChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AICopilot />
        <DecisionGraph />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TopContributors />
        <Timeline />
        <RuntimeStatus />
      </div>
    </div>
  )
}
