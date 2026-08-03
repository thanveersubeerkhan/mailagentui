// components/layout/DashboardLayout1.tsx
'use client'

import { useState } from 'react';

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  mainContent: React.ReactNode;
  secondContent?: React.ReactNode;
}

export const DashboardLayout = ({ sidebar, mainContent, secondContent }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMainContentOpen, setIsMainContentOpen] = useState(true);
  const [isSecondContentOpen, setIsSecondContentOpen] = useState(true);

  // Calculate widths based on which content areas are open
  const getMainContentWidth = () => {
    if (!isMainContentOpen && !isSecondContentOpen) return 'lg:w-0';
    if (isMainContentOpen && !isSecondContentOpen) return 'lg:w-full';
    if (!isMainContentOpen && isSecondContentOpen) return 'lg:w-full';
    return 'lg:w-1/2';
  };

  const getSecondContentWidth = () => {
    if (!isMainContentOpen && !isSecondContentOpen) return 'lg:w-0';
    if (isMainContentOpen && !isSecondContentOpen) return 'lg:w-0';
    if (!isMainContentOpen && isSecondContentOpen) return 'lg:w-full';
    return 'lg:w-1/2';
  };

  return (
    <div className="min-w-full  px-5">
      {/* Control Bar */}
      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          {isSidebarOpen ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hide Sidebar
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Show Sidebar
            </>
          )}
        </button>

        <button
          onClick={() => setIsMainContentOpen(!isMainContentOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          {isMainContentOpen ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hide Main
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Show Main
            </>
          )}
        </button>

        <button
          onClick={() => setIsSecondContentOpen(!isSecondContentOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          {isSecondContentOpen ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hide analysis
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Show analysis
            </>
          )}
        </button>

        {/* Layout Status */}
        <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            {isSidebarOpen ? 'Sidebar: On' : 'Sidebar: Off'}
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            {isMainContentOpen ? 'Main: On' : 'Main: Off'}
          </span>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
            {isSecondContentOpen ? 'Compare: On' : 'Compare: Off'}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-w-full gap-2">
        {/* Sidebar - Left Column */}
        <div className={`
          transition-all duration-300 overflow-hidden
          ${isSidebarOpen ? 'lg:w-3/12 max-h-fit' : 'lg:w-0 max-h-0 opacity-0'}
        `}>
          {isSidebarOpen && (
            <div className="p-2">
              {sidebar}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className={`
          transition-all duration-300
          ${isSidebarOpen ? 'lg:w-9/12' : 'lg:w-full'}
        `}>
          <div className="flex flex-col lg:flex-row gap-2">
            {/* First Content Area */}
            <div className={`
              transition-all duration-300 overflow-hidden
              ${isMainContentOpen ? getMainContentWidth() + ' max-h-fit opacity-100' : 'lg:w-0 max-h-0 opacity-0'}
            `}>
              {isMainContentOpen ? (
                <div className="p-2 h-full">
                  {mainContent}
                </div>
              ) : (
                <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-gray-400 text-4xl mb-4">📧</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Main email</h3>

                  </div>
                </div>
              )}
            </div>

            {/* Second Content Area for Comparison */}
            <div className={`
              transition-all duration-300 overflow-hidden
              ${isSecondContentOpen ? getSecondContentWidth() + ' max-h-fit opacity-100' : 'lg:w-0 max-h-0 opacity-0'}
            `}>
              {isSecondContentOpen ? (
                <div className="p-2 h-full">
                  {secondContent || (
                    <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="text-gray-400 text-4xl mb-4">📊</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">analysis Email</h3>
                  
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-gray-400 text-4xl mb-4">🔄</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Comparison Hidden</h3>
              
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-4 flex justify-center gap-2">
        {!isMainContentOpen && (
          <button
            onClick={() => setIsMainContentOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Show Main emails
          </button>
        )}
        {!isSecondContentOpen && (
          <button
            onClick={() => setIsSecondContentOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Show analysis
          </button>
        )}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Show Sidebar
          </button>
        )}
      </div>
    </div>
  );
};