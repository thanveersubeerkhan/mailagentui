import { useState } from "react";
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
export interface ProcessResultItem {
  id: number;
  req_id: string;
  process_label: string;
  pretext: string;
  core: string;
  posttext: string;
  clean_text: string;
  original_email: {
    body: string;
    subject: string;
  };
  translated_content?: {
    subject: string;
    body: string;
  };
  analysis_result: string;
  created_at: string;
}

export interface ProcessResult {
  success: boolean;
  data: Array<ProcessResultItem>;
}
import { ProcessResultsAccordion1 } from "./ProcessResultsAccordion1";


import { EmailHeader } from "./EmailHeader";

interface EmailDetailProps {
  email: Email;
  processing: boolean;
  existingProcessResults: any | null;
  onProcessEmail: (email: Email) => void;
  onClose: () => void;
  Loading: boolean;
}

export function EmailDetail1({ 
  email, 
  processing, 
  existingProcessResults, 
  onProcessEmail, 
  onClose ,
  Loading=false
}: EmailDetailProps) {
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);
  const [activeContentTabs, setActiveContentTabs] = useState<{ [key: number]: "original" | "translated" }>({});

  const toggleProcess = (index: number) => {
    setExpandedProcess(expandedProcess === index ? null : index);
    if (expandedProcess !== index) {
      setActiveContentTabs(prev => ({
        ...prev,
        [index]: "original"
      }));
    }
  };

  const handleContentTabChange = (index: number, tab: "original" | "translated") => {
    setActiveContentTabs(prev => ({
      ...prev,
      [index]: tab
    }));
  };

  const allProcessResults = [
    ...(existingProcessResults?.success ? existingProcessResults.data : [])
  ];

  const uniqueProcessResults = allProcessResults.filter((result, index, self) =>
    index === self.findIndex(t => 
      t.process_label === result.process_label && 
      t.created_at === result.created_at
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
   

        <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full flex justify-end px-4 py-5">
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
     
          <EmailHeader 
            email={email} 
            onProcessEmail={() => onProcessEmail(email)}
            processing={processing}
          />

          {!Loading?<ProcessResultsAccordion1
            processResults={uniqueProcessResults}
            expandedProcess={expandedProcess}
            activeContentTabs={activeContentTabs}
            onToggleProcess={toggleProcess}
            onContentTabChange={handleContentTabChange}
            processing={processing}
            Loading={Loading}
          />: <div className="p-12 text-center">Loading... </div>}
        </div>
      </div>
    </div>
  );
}