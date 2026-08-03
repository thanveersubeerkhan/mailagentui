import { useState } from "react";
import { EmailContent } from "./EmailContent";
import { AnalysisSection } from "./AnalysisSection";
import { AnalysisIcon, ChevronDownIcon } from "../ui/Icons";

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

interface ProcessResultsAccordionProps {
  processResults: ProcessResultItem[];
  expandedProcess: number | null;
  activeContentTabs: { [key: number]: "original" | "translated" };
  onToggleProcess: (index: number) => void;
  onContentTabChange: (index: number, tab: "original" | "translated") => void;
  processing: boolean;
  Loading: boolean;
}

export function ProcessResultsAccordion1({
  processResults,
  expandedProcess,
  activeContentTabs,
  onToggleProcess,
  onContentTabChange,
  processing,
  Loading=false
}: ProcessResultsAccordionProps) {
  const [showRawAnalysis, setShowRawAnalysis] = useState<{ [key: number]: boolean }>({});
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: { [section: string]: boolean } }>({});

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(0)}%`;
  };

  const toggleRawAnalysis = (index: number) => {
    setShowRawAnalysis(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleSection = (index: number, section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [section]: !prev[index]?.[section]
      }
    }));
  };

  const isSectionExpanded = (index: number, section: string) => {
    return expandedSections[index]?.[section] || false;
  };

  if(Loading){
    return      <div className="p-12 text-center">
      loading...
   
      </div>
  }else if(processResults.length === 0 && !processing&& !Loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <AnalysisIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
        <p className="text-gray-500 mb-6">
          Process this email to see AI-powered analysis and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {processResults.length > 0 && (
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <AnalysisIcon className="w-5 h-5 text-blue-600" />
          Processing Results 
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {processResults.length}
          </span>
        </h2>
      )}
      
      <div className="space-y-4">
        {processResults.map((item, index) => {
          let analysis_result: any = {};
          try {
            analysis_result = typeof item.analysis_result === 'string' && item.analysis_result 
              ? JSON.parse(item.analysis_result) 
              : (item.analysis_result || {});
          } catch (e) {
            console.error("Failed to parse analysis_result", e);
          }
          const original_email = typeof item.original_email === 'string' && item.original_email ? JSON.parse(item.original_email) : (item.original_email || {});
          const translated_content = typeof item.translated_content === 'string' && item.translated_content ? JSON.parse(item.translated_content) : (item.translated_content || {});
          const isRawAnalysisVisible = showRawAnalysis[index] || false;
          
          const requires_human_review = analysis_result.requires_human_review ?? (item as any).requires_human_review ?? false;
          const confidence = analysis_result.confidence_scores?.overall || 0;
          const createdAt = item.created_at || (item as any).createdAt || new Date().toISOString();

          return (
            <div key={`${item.id}-${item.process_label}-${index}`} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Main Process Accordion */}
              <button
                onClick={() => onToggleProcess(index)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${
                    requires_human_review ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <span className="font-semibold text-gray-900 text-lg">
                      {item.process_label} 
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    requires_human_review 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {requires_human_review ? 'Needs Review' : 'Auto-processed'}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-200">
                    {formatConfidence(confidence)} confidence
                  </span>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                      expandedProcess === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {expandedProcess === index && (
                <div className="border-t border-gray-200">
                  <div className="p-6 space-y-4">
                    {/* Process Information Accordion */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(index, 'processInfo')}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center text-left"
                      >
                        <span className="font-semibold text-gray-900">Process Information</span>
                        <ChevronDownIcon 
                          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                            isSectionExpanded(index, 'processInfo') ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isSectionExpanded(index, 'processInfo') && (
                        <div className="bg-white p-4 border-t border-gray-200">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Process ID:</span>
                              <span className="font-medium">{item.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Request ID:</span>
                              <span className="font-medium">{item.req_id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Process Label:</span>
                              <span className="font-medium">{item.process_label}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Created:</span>
                              <span className="font-medium">
                                {new Date(createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Text Segments Accordion */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(index, 'textSegments')}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center text-left"
                      >
                        <span className="font-semibold text-gray-900">Text Segments</span>
                        <ChevronDownIcon 
                          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                            isSectionExpanded(index, 'textSegments') ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isSectionExpanded(index, 'textSegments') && (
                        <div className="bg-white p-4 border-t border-gray-200 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pretext</label>
                            <div className="bg-gray-50 rounded p-3 text-sm border border-gray-200 min-h-[60px] max-h-[120px] overflow-y-auto">
                              {item.pretext || <span className="text-gray-400 italic">No pretext</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Core Text</label>
                            <div className="bg-gray-50 rounded p-3 text-sm border border-gray-200 min-h-[60px] max-h-[120px] overflow-y-auto">
                              {item.core || <span className="text-gray-400 italic">No core text</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Posttext</label>
                            <div className="bg-gray-50 rounded p-3 text-sm border border-gray-200 min-h-[60px] max-h-[120px] overflow-y-auto">
                              {item.posttext || <span className="text-gray-400 italic">No posttext</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Clean Text</label>
                            <div className="bg-gray-50 rounded p-3 text-sm border border-gray-200 min-h-[80px] max-h-[160px] overflow-y-auto">
                              {item.clean_text || <span className="text-gray-400 italic">No clean text</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                
                   

                    {/* Email Content Accordion */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(index, 'emailContent')}
                        className="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 transition-colors flex justify-between items-center text-left"
                      >
                        <span className="font-semibold text-gray-900">Email Content</span>
                        <ChevronDownIcon 
                          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                            isSectionExpanded(index, 'emailContent') ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isSectionExpanded(index, 'emailContent') && (
                        <div className="bg-white p-4 border-t border-gray-200">
                          <EmailContent email={item} />
                        </div>
                      )}
                    </div>

                    {/* Analysis Section Accordion */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(index, 'analysisSection')}
                        className="w-full px-4 py-3 bg-orange-50 hover:bg-orange-100 transition-colors flex justify-between items-center text-left"
                      >
                        <span className="font-semibold text-gray-900">AI Analysis</span>
                        <ChevronDownIcon 
                          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                            isSectionExpanded(index, 'analysisSection') ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isSectionExpanded(index, 'analysisSection') && (
                        <div className="bg-white p-4 border-t border-gray-200">
                          <AnalysisSection email={item} />
                        </div>
                      )}
                    </div>

                    {/* Raw Analysis Result Accordion */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleRawAnalysis(index)}
                        className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 transition-colors flex justify-between items-center text-left"
                      >
                        <div className="flex items-center gap-2">
                          <AnalysisIcon className="w-4 h-4 text-green-400" />
                          <span className="font-semibold text-white">
                            Raw Analysis Result {isRawAnalysisVisible ? '(Visible)' : '(Hidden)'}
                          </span>
                        </div>
                        <ChevronDownIcon 
                          className={`w-4 h-4 text-green-400 transform transition-transform duration-200 ${
                            isRawAnalysisVisible ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {isRawAnalysisVisible && (
                        <div className="bg-gray-900 p-4 border-t border-gray-700">
                          <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(analysis_result, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}