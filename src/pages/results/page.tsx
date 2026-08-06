import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader } from "../../components/ui/Card";
import { DashboardLayout } from "../../components/layout/DashbaordLayouthide";
import { ProcessResultList } from "../../components/email/ProcessResultList";
import { ProcessResultsAccordion1, type ProcessResultItem } from "../../components/email/ProcessResultsAccordion1";

export default function ProcessResultsPage() {
  const [results, setResults] = useState<ProcessResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ProcessResultItem | null>(null);
  const [page, setPage] = useState(1);
  const size = 10;

  const [expandedProcess, setExpandedProcess] = useState<number | null>(0);
  const [activeContentTabs, setActiveContentTabs] = useState<{ [key: number]: "original" | "translated" }>({});

  const handleToggleProcess = (index: number) => {
    setExpandedProcess(prev => (prev === index ? null : index));
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://platform-4x-api-andfaucacxhhgwef.canadacentral-01.azurewebsites.net/entities/data/a797bc59-cb99-4c94-a5a2-bed779ddb674?page=${page}&pageSize=${size}`, {
        headers: {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
          "x-internal-service-key": "platform4x-internal-key-2026",
          "x-tenant-id": "default"
        }
      });
      if (response.ok) {
        const rawResult = await response.json();
        setResults(rawResult.data || []);
      } else {
        console.error('Failed to fetch results, status:', response.status);
      }
    } catch (err) {
      console.error("Failed to fetch results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [page]);

  const handleOpenResult = (result: ProcessResultItem) => {
    setSelectedResult(result);
  };

  const handleContentTabChange = (index: number, tab: "original" | "translated") => {
    setActiveContentTabs((prev) => ({
      ...prev,
      [index]: tab,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="min-w-full mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <DashboardLayout
          sidebar={
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Process Results</h2>
                  <span className="text-sm text-gray-500">{results.length} items</span>
                </div>
              </CardHeader>
              <div className="overflow-hidden">
                <ProcessResultList
                  results={results}
                  loading={loading}
                  page={page}
                  onOpenResult={handleOpenResult}
                  onPageChange={setPage}
                />
              </div>
            </Card>
          }
          mainContent={
            selectedResult ? (
              <Card className="h-full">
                <div className="overflow-y-auto p-4">
                  <ProcessResultsAccordion1
                    processResults={[selectedResult]}
                    expandedProcess={expandedProcess}
                    activeContentTabs={activeContentTabs}
                    onToggleProcess={handleToggleProcess}
                    onContentTabChange={handleContentTabChange}
                    processing={false}
                    Loading={false}
                  />
                </div>
              </Card>
            ) : (
              <Card className="h-full">
                <div className="flex items-center justify-center">
                  <div className="p-8 text-center">
                    <div className="text-gray-400 text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Result</h3>
                    <p className="text-gray-600">Choose a processed item from the list to view its details</p>
                  </div>
                </div>
              </Card>
            )
          }
        />
      </div>
    </div>
  );
}
