
import PageMeta from "../../components/common/PageMeta";
import Dashboard from "../Dashboard";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Budget Tracker Dashboard | Personal Finance Management App"
        description="Track income, expenses, budgets, and financial insights with the Budget Tracker dashboard."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <Dashboard />
          {/* <EcommerceMetrics /> */}

          {/* <MonthlySalesChart /> */}
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
