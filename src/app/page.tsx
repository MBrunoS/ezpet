export default function Home() {
  return (
    <div className="flex flex-col h-full">
      {/* Dashboard Header */}
      <div className="flex flex-wrap gap-3 justify-between p-4">
        <p className="text-text tracking-light text-[32px] font-bold leading-tight min-w-72">
          Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Total Customers
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            120
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Upcoming Schedules
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            15
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Low Stock Items
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            5
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Quick Actions
      </h2>
      <div className="flex justify-stretch">
        <div className="flex flex-wrap flex-1 gap-3 justify-start px-4 py-3">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Register Customer</span>
          </button>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light text-text text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Add Schedule</span>
          </button>
        </div>
      </div>

      {/* Upcoming Schedules Table */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Upcoming Schedules
      </h2>
      <div className="px-4 py-3">
        <div className="flex overflow-hidden rounded-lg border border-border bg-background">
          <table className="flex-1">
            <thead>
              <tr className="bg-background">
                <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                  Pet
                </th>
                <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-t-border">
                <td className="h-[72px] px-4 py-2 w-[400px] text-text text-sm font-normal leading-normal">
                  Olivia Carter
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  Buddy
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  Grooming
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  2024-07-20
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  10:00 AM
                </td>
              </tr>
              <tr className="border-t border-t-border">
                <td className="h-[72px] px-4 py-2 w-[400px] text-text text-sm font-normal leading-normal">
                  Noah Lee
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  Whiskers
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  Check-up
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  2024-07-21
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  2:00 PM
                </td>
              </tr>
              <tr className="border-t border-t-border">
                <td className="h-[72px] px-4 py-2 w-[400px] text-text text-sm font-normal leading-normal">
                  Isabella Green
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  Max
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  Training
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  2024-07-22
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                  4:00 PM
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Finance Overview */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Finance Overview
      </h2>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Total Revenue
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            $15,000
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Expenses
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            $3,000
          </p>
        </div>
      </div>
    </div>
  );
}
