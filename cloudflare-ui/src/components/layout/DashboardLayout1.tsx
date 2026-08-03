// components/layout/DashboardLayout1.tsx
interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  secondContent?: React.ReactNode; // Add second content area for comparison
}

export const DashboardLayout = ({ sidebar, mainContent, secondContent }: DashboardLayoutProps) => {
  return (
    <div className="min-w-full py-6 px-5">
      <div className="flex flex-col lg:flex-row min-w-full gap-2">
        {/* Sidebar - Left Column */}
        <div className="lg:w-3/12 max-h-fit">
          {sidebar}
        </div>
        {/* Main Content - Middle and Right Columns for comparison */}
        <div className="lg:w-9/12 ">
          <div className="flex flex-col lg:flex-row gap-2">
            {/* First Content Area */}
            <div className="lg:w-1/2 max-h-fit">
              {mainContent}
            </div>
            {/* Second Content Area for Comparison */}
            <div className="lg:w-1/2 max-h-fit">
              {secondContent || (
                <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-gray-400 text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Compare Email</h3>
                    <p className="text-gray-600">Select another email to compare analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};