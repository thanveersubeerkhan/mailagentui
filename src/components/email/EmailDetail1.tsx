// components/email/SimpleEmailDetail.tsx
import { useState } from "react";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ProcessIcon } from "../ui/Icons";

interface SimpleEmailDetailProps {
  email: any;
  processing?: boolean;
  onProcessEmail: (email: any) => void;
  onClose: () => void;
}

export function SimpleEmailDetail({ 
  email, 
  processing, 
  onProcessEmail, 
  onClose 
}: SimpleEmailDetailProps) {
  const [viewMode, setViewMode] = useState<"preview" | "html">("preview");

  // Safe HTML rendering with better styling
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent || '<p>No content available</p>' };
  };

  // Clean HTML for better display
  const cleanHTML = (html: string) => {
    if (!html) return 'No content available';
    
    // Basic cleaning - you can add more specific rules as needed
    return html
      .replace(/<style[\s\S]*?<\/style>/gi, '') // Remove style tags
      .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove script tags
      .replace(/<meta[^>]*>/gi, '') // Remove meta tags
      .replace(/<head[\s\S]*?<\/head>/gi, '') // Remove head section
      .trim();
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">
              {email.Subject || 'No Subject'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="truncate">From: {email.From}</span>
              <span>•</span>
              <span>{new Date(email.CreatedDateTime).toLocaleDateString()}</span>
              {email.TicketId && (
                <>
                  <span>•</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    Ticket: {email.TicketId}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
 
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                viewMode === "preview" 
                  ? "bg-white text-gray-900 shadow-sm font-medium" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📄 Preview
            </button>
            <button
              onClick={() => setViewMode("html")}
              className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                viewMode === "html" 
                  ? "bg-white text-gray-900 shadow-sm font-medium" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📝 Source
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {viewMode === "preview" ? (
          // Preview Mode - Better HTML rendering
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {email.Comments ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-none">
                <div 
                  className="email-content prose prose-sm max-w-none"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    lineHeight: '1.6',
                    color: '#374151'
                  }}
                  dangerouslySetInnerHTML={createMarkup((email.Comments))}
                />
              </div>
            ) : email.Body ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                  {email.Body}
                </pre>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                <div className="text-gray-400 text-4xl mb-3">📧</div>
                <p className="text-gray-500 text-sm">No email content available</p>
              </div>
            )}
          </div>
        ) : (
          // HTML Source Mode
          <div className="flex-1 overflow-y-auto bg-gray-900">
            <div className="p-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words leading-relaxed">
                  {email.Comments || email.Body || 'No content available'}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with additional info */}
      <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>ID: <code className="bg-gray-200 px-1.5 py-0.5 rounded">#{email.RecId}</code></span>
            {email.CustomerID_Name && (
              <span>Customer: {email.CustomerID_Name}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {email.ToRecipients && (
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                {email.ToRecipients.split(',').length} recipients
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}