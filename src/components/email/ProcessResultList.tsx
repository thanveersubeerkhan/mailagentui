import { useState, useEffect } from "react";
import type { ProcessResultItem } from "./ProcessResultsAccordion1";
import { MailIcon } from "../ui/Icons";

interface ProcessResultListProps {
  results: ProcessResultItem[];
  loading: boolean;
  page: number;
  onOpenResult: (result: ProcessResultItem) => void;
  onPageChange: (page: number) => void;
}

export function ProcessResultList({ 
  results, 
  loading, 
  page, 
  onOpenResult, 
  onPageChange 
}: ProcessResultListProps) {
  const [activeResult, setActiveResult] = useState<number | string | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Only run on client side
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-10">loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="shadow-sm overflow-hidden w-full">
        <div className="w-full">
          <div className="grid gap-2 sm:gap-3">
            {results.map((result) => (
              <div
                key={result.id}
                className={`border border-gray-100 p-3 sm:p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group ${
                  activeResult === result.id ? 'bg-gray-50 sm:bg-gray-200' : 'bg-white'
                }`}
                onClick={() => { 
                  setActiveResult(result.id);
                  onOpenResult(result);
                }}
              >
                {/* Header */}
                <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                      {result.process_label || result.original_email?.subject || 'No Label'}
                    </h3>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:gap-3 gap-1">
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        Req ID: <span className="font-medium text-gray-700">{result.req_id}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Date Badge */}
                  <div className="flex-shrink-0 self-start xs:self-auto flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                      {new Date(result.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: windowWidth >= 640 ? 'numeric' : undefined
                      })}
                    </span>
                  </div>
                </div>

                {/* Footer with ID and Actions */}
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-0">
                  <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono bg-gray-100 text-gray-600 border border-gray-200">
                      ID: {result.id}
                    </span>
                    
                    {(() => {
                      try {
                        const parsedAnalysis = typeof result.analysis_result === 'string' 
                          ? JSON.parse(result.analysis_result) 
                          : result.analysis_result;
                          
                        if (parsedAnalysis?.confidence_scores?.overall !== undefined) {
                          return (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-50 text-purple-700 border border-purple-200">
                              Confidence: {(parsedAnalysis.confidence_scores.overall * 100).toFixed(0)}%
                            </span>
                          );
                        }
                      } catch (e) {
                        // ignore parse errors
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {results.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MailIcon className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No results found</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-xs mx-auto">
              No processed items available yet.
            </p>
          </div>
        )}
      </div>

      <Pagination page={page} onPageChange={onPageChange} windowWidth={windowWidth} />
    </div>
  );
}

function Pagination({ page, onPageChange, windowWidth }: { page: number; onPageChange: (page: number) => void; windowWidth?: number }) {
  return (
    <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-sm mt-4 rounded-b-lg">
      <button
        disabled={page === 1} 
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm min-w-[80px] justify-center"
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className={`${(windowWidth || 0) >= 480 ? 'block' : 'hidden'}`}>Previous</span>
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm font-bold text-white bg-green-600 rounded-full shadow-sm">
          {page}
        </span>
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm min-w-[80px] justify-center"
      >
        <span className={`${(windowWidth || 0) >= 480 ? 'block' : 'hidden'}`}>Next</span>
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
