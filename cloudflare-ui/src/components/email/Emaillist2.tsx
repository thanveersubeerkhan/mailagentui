export interface Email {
  RecId: string;
  Subject: string;
  Body: string;
  CreatedDateTime: string;
  From: string;
  To: string;
  ToRecipients: string;
  Comments?: string;
  [key: string]: any;
}

import { useState, useEffect } from "react";
import { EmailListSkeleton } from "../ui/EmailListSkeleton1";
import { ArrowLeftIcon, ArrowRightIcon, MailIcon } from "../ui/Icons";

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  orderBy: string;
  orderDir: 0 | 1;
  page: number;
  onSort: (column: string) => void;
  onOpenEmail: (email: Email) => void;
  onPageChange: (page: number) => void;
 
}

export function EmailList({ 
  emails, 
  loading, 
  orderBy, 
  orderDir, 
  page, 
  onSort, 
  onOpenEmail, 
  onPageChange ,


}: EmailListProps) {
  const columns = ['RecId', 'Subject', 'From', 'Date', 'Actions'];
  const [activemail, setactivemail] = useState<number | null | string>(null);
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
            {emails.map((email) => (
              <div
                key={email.RecId}
                className={`border border-gray-100 p-3 sm:p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group ${
                  activemail === email.RecId ? 'bg-gray-50 sm:bg-gray-200' : 'bg-white'
                }`}
                onClick={() => { 
                  setactivemail(email.RecId);
                  onOpenEmail(email);
                }}
              >
                {/* Header with Subject and Metadata - Better responsive layout */}
                <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                      {email.Subject || 'No Subject'}
                    </h3>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:gap-3 gap-1">
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        From: <span className="font-medium text-gray-700">{email.From}</span>
                      </p>
                      {email.To && windowWidth >= 480 && (
                        <p className="text-xs sm:text-sm text-gray-600 truncate hidden xs:block">
                          To: <span className="font-medium text-gray-700">{email.To.split(',')[0]}{email.To.split(',').length > 1 ? ` +${email.To.split(',').length - 1} more` : ''}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Date Badge - Better positioning */}
                  <div className="flex-shrink-0 self-start xs:self-auto flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                      {new Date(email.CreatedDateTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: windowWidth >= 640 ? 'numeric' : undefined
                      })}
                    </span>
                  </div>
                </div>

                {/* Email Preview - Better responsive behavior */}
             

                {/* Footer with ID and Actions - Improved responsive layout */}
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-0">
                  <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono bg-gray-100 text-gray-600 border border-gray-200">
                      #{email.RecId}
                    </span>
                    
                    {/* Recipient count badge - Better responsive text */}
                    {email.ToRecipients && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-50 text-green-700 border border-green-200">
                        <span className={windowWidth >= 480 ? 'inline' : 'hidden'}>📧</span>
                        <span className={windowWidth < 480 ? 'inline' : 'hidden'}>👤</span>
                        {email.ToRecipients.split(',').length} 
                        {windowWidth >= 480 ? ' recipients' : windowWidth >= 360 ? ' rec' : ''}
                      </span>
                    )}

                    {/* Comments badge - Show on larger screens */}
                  
                  </div>
                  
                  {/* Action buttons - Show on tablet and up */}
                 
                </div>

                {/* Mobile quick actions - Show only on small screens */}
                {windowWidth < 768 && (
                  <div className="flex sm:hidden items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Tap to {windowWidth < 480 ? 'open' : 'view details'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add mobile action here
                        }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments preview for mobile */}
                {email.Comments && windowWidth < 640 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-yellow-600 line-clamp-1">
                      💬 {email.Comments}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {emails.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MailIcon className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No emails found</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-xs mx-auto">
              Try adjusting your search or filter criteria.
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
    <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
      {/* Previous Button */}
      <button
        disabled={page === 1} 
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm min-w-[80px] justify-center"
        aria-label="Previous page"
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className={`${(windowWidth || 0) >= 480 ? 'block' : 'hidden'}`}>Previous</span>
      </button>

      {/* Page Info */}
      <div className="flex items-center gap-2 sm:gap-3">
      
        <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm font-bold text-white bg-blue-600 rounded-full shadow-sm">
          {page}
        </span>
      
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm min-w-[80px] justify-center"
        aria-label="Next page"
      >
        <span className={`${(windowWidth || 0) >= 480 ? 'block' : 'hidden'}`}>Next</span>
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}