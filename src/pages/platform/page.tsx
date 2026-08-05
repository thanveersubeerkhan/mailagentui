import { useState, useEffect } from "react";

import { EmailList } from "../../components/email/Emaillist2";
import { EmailDetail1 } from "../../components/email/Emaildetails";

import { Card, CardHeader } from "../../components/ui/Card";
import { DashboardLayout } from "../../components/layout/DashbaordLayouthide";

import { SimpleEmailDetail } from "../../components/email/EmailDetail1";

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

export interface ProcessResult {
    success: boolean;
    data: Array<ProcessResultItem>;
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
    analysis_result: {
        summary: string;
        tokenUsage: {
            inputTokens: number;
            totalTokens: number;
            outputTokens: number;
        };
        action_items: Array<{
            action: string;
            confidence: number;
        }>;
        classification: {
            category: string;
            priority: string;
            sentiment: string;
            confidence: number;
        };
        structured_data: any;
        action_reasoning: string;
        next_best_action: string;
        action_confidence: number;
        confidence_scores: {
            overall: number;
            action_items: number;
            classification: number;
            structured_data: number;
        };
        processing_time_ms: number;
        requires_human_review: boolean;
    };
    created_at: string;
}

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PlatformPage() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [compareEmail, setCompareEmail] = useState<Email | null>(null); // New state for comparison email
    const [processing, setProcessing] = useState(false);
    const [compareProcessing, setCompareProcessing] = useState(false); // New state for comparison processing
    const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
    const [existingProcessResults, setExistingProcessResults] = useState<ProcessResult | null>(null);
    const [compareProcessResults, setCompareProcessResults] = useState<ProcessResult | null>(null); // New state for comparison results
    const [page, setPage] = useState(1);
    const [orderBy, setOrderBy] = useState("CreatedDateTime");
    const [orderDir, setOrderDir] = useState<0 | 1>(0);
    const [oldprocessfetch, setOldprocessfetch] = useState(false);
const [Close, setClose] = useState(false);
    const size = 5;

    const fetchEmails = async () => {
        setLoading(true);
        const baseUrl =
            "https://portal.mawarid.com.sa/apps4x-api/api/v1/data/LGE0000001?entityid=ETN0000041";
        try {
            const res = await fetch(
                `${baseUrl}&$page=${page}&$size=${size}&$orderby=${orderBy}&$orderbydirection=${orderDir}&$filter:Type=eq:Tickets`,
                {
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiJTeXN0ZW0iLCJOYW1lIjoiU3lzdGVtIiwiRW1haWwiOiJzeXN0ZW1AbWFpbC5jb20iLCJNb2JpbGVOdW1iZXIiOiIwOTg3NjU0MzIxIiwiQ29tcGFueUlkIjoiTEdFMDAwMDAwMSxMR0UwMDAwMDAyIiwiZXhwIjozMzE1Mzk0NjE2LCJpc3MiOiJhcHBzNHguY29tIiwiYXVkIjoiYXBwczR4LmNvbSJ9.YkzrYJ-93k4oNjNSbYWlEum8eh_IAdodZ5vGUIGvVMQ`,
                        Accept: "application/json",
                    },
                }
            );
            const data = await res.json();
            setEmails(data.Data || []);
        } catch (err) {
            console.error("Failed to fetch emails:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingProcessResults = async (reqId: string, isCompare = false) => {
        try {
            setOldprocessfetch(true);
            setCompareProcessResults(null);
            
            const response = await fetch(`https://platform-4x-api-andfaucacxhhgwef.canadacentral-01.azurewebsites.net/entities/data/a797bc59-cb99-4c94-a5a2-bed779ddb674?page=1&pageSize=20&filter%5Breq_id%5D=${reqId}`, {
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
                    "x-internal-service-key": "platform4x-internal-key-2026",       
                    "x-tenant-id": "default"
                }
            });
            
            if (response.ok) {
                const rawResult = await response.json();
                const result = { success: true, data: rawResult.data || [] };
                
                setOldprocessfetch(false);
                if (isCompare) {
                    setCompareProcessResults(result);
                } else {
                    setExistingProcessResults(result);
                }
            } else {
                setOldprocessfetch(false);
            }
        } catch (error) {
            setOldprocessfetch(false);
            console.error('Failed to fetch existing process results:', error);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, [page, orderBy, orderDir]);

    useEffect(() => {
        if (selectedEmail) {
            fetchExistingProcessResults(selectedEmail.RecId, false);
        }
    }, [selectedEmail]);

    useEffect(() => {
        if (compareEmail) {
            fetchExistingProcessResults(compareEmail.RecId, true);
        }
    }, [compareEmail]);

    const handleProcessEmail = async (email: Email, isCompare = false) => {
        if (isCompare) {
            setCompareProcessing(true);
        } else {
            setProcessing(true);
        }

        try {
            const response = await fetch(`https://platform-4x-api-andfaucacxhhgwef.canadacentral-01.azurewebsites.net/entities/data/e92985b3-8121-42e2-af8a-7e12896a3638`, {
                method: 'POST',
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9,ta;q=0.8,ar;q=0.7",
                    "x-internal-service-key": "platform4x-internal-key-2026",  
                    "content-type": "application/json",
                    "x-tenant-id": "default"
                },
                body: JSON.stringify({ mai_id: email.RecId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            await fetchExistingProcessResults(email.RecId, isCompare);

        } catch (error) {
            console.error('Failed to process email:', error);
            const errorResult = {
                success: false,
                data: []
            };
            if (isCompare) {
                setCompareProcessResults(errorResult);
            } else {
                setProcessResult(errorResult);
            }
        } finally {
            if (isCompare) {
                setCompareProcessing(false);
            } else {
                setProcessing(false);
            }
        }
    };

    const handleSort = (column: string) => {
        if (orderBy === column) {
            setOrderDir(orderDir === 0 ? 1 : 0);
        } else {
            setOrderBy(column);
            setOrderDir(0);
        }
    };

    const handleOpenEmail = (email: Email) => {
            
   
            setSelectedEmail(email);
            setCompareEmail(email);

    
        // If main email is already selected, set as compare email
       
        setProcessResult(null);
    };

    const handleCloseEmail = (isCompare = false) => {
        if (isCompare) {
            setCompareEmail(null);
            setCompareProcessResults(null);
        } else {
            setSelectedEmail(null);
            setProcessResult(null);
            setExistingProcessResults(null);
            // Also clear compare if main email is closed
            setCompareEmail(null);
            setCompareProcessResults(null);
        }
    };

    const handleSetAsCompare = (email: Email) => {
        setCompareEmail(email);
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
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-900">Email Inbox</h2>
                                    <span className="text-sm text-gray-500">{emails.length} emails</span>
                                </div>
                            
                            </CardHeader>
                            <div className="overflow-hidden ">
                                <EmailList
                                    emails={emails}
                                    loading={loading}
                                    orderBy={orderBy}
                                    orderDir={orderDir}
                                    page={page}
                                    onSort={handleSort}
                                    onOpenEmail={handleOpenEmail}
                                    onPageChange={setPage}
                      
                                                       
                                
                                
                             
                                />
                            </div>
                        </Card>
                    }
                    mainContent={
                        selectedEmail ? (
                            <Card className="h-full">
                                <div className=" overflow-y-auto">
                                    <SimpleEmailDetail
                                        email={selectedEmail}
                                        processing={processing}
                                      
                                        onProcessEmail={(email) => handleProcessEmail(email, false)}
                                        onClose={() => handleCloseEmail(false)}
                                    
                                    />
                                </div>
                            </Card>
                        ) : (
                            <Card className="h-full">
                                <div className="flex items-center justify-center">
                                    <div className="p-8 text-center">
                                        <div className="text-gray-400 text-4xl mb-4">📧</div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select Primary Email</h3>
                                        <p className="text-gray-600">Choose an email from the list to view AI analysis</p>
                                    </div>
                                </div>
                            </Card>
                        )
                    }
                    secondContent={
                        compareEmail ? (
                            <Card className="h-full">
                                <div className=" overflow-y-auto">
                                    <EmailDetail1
                                        email={compareEmail}
                                        processing={compareProcessing}
                                        existingProcessResults={compareProcessResults}
                                        onProcessEmail={(email) => handleProcessEmail(email, true)}
                                        onClose={() => {
                                            setClose(true)
                                            handleCloseEmail(false)}}
                                        Loading={oldprocessfetch}
                                    />
                                </div>
                            </Card>
                        ) : selectedEmail ? (
                            <Card className="h-full">
                                <div className=" flex items-center justify-center">
                                    <div className="p-8 text-center">
                                        <div className="text-gray-400 text-4xl mb-4">🔄</div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Compare with Another Email</h3>
                                        <p className="text-gray-600">Select another email from the list to compare AI analysis</p>
                                        <button
                                            onClick={() => {
                                                setClose(true)
                                                setCompareEmail(selectedEmail)}}
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Use Current Email for Comparison
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ) : null
                    }
                />
            </div>
        </div>
    );
}