import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { EnvelopeIcon, DevicePhoneMobileIcon, XMarkIcon } from '../icons/Icons';
import Button from './Button';

const MockMailbox: React.FC = () => {
    const { 
        mockEmail, 
        hideMockEmail, 
        mockBulkEmailSummary, 
        hideMockBulkEmailSummary 
    } = useAppContext();

    if (!mockEmail && !mockBulkEmailSummary) {
        return null;
    }

    const handleClose = () => {
        if (mockEmail) hideMockEmail();
        if (mockBulkEmailSummary) hideMockBulkEmailSummary();
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
            onClick={handleClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
                style={{ animationFillMode: 'forwards' }}
            >
                <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {mockEmail ? 'Notification Sent' : 'Bulk Notifications Sent'}
                    </h2>
                    <button onClick={handleClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <XMarkIcon />
                    </button>
                </div>

                <div className="p-6">
                    {mockEmail && (
                        <>
                            <div className="flex items-start p-3 bg-gray-50 rounded-lg mb-3">
                                <EnvelopeIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3 shrink-0" />
                                <div>
                                    <span className="text-sm text-gray-500">To:</span>
                                    <p className="font-medium text-gray-800">{mockEmail.recipientName} &lt;{mockEmail.recipientEmail}&gt;</p>
                                </div>
                            </div>
                             <div className="flex items-start p-3 bg-gray-50 rounded-lg mb-4">
                                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3 shrink-0" />
                                <div>
                                    <span className="text-sm text-gray-500">SMS To:</span>
                                    <p className="font-medium text-gray-800">{mockEmail.recipientPhone}</p>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mt-4">{mockEmail.subject}</h3>
                            <div className="mt-2 p-4 bg-gray-100/70 border-l-4 border-blue-400 rounded-r-md">
                                <p className="text-gray-700">{mockEmail.message}</p>
                            </div>

                            {mockEmail.scheduleContent && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">Updated Lecture Details:</h4>
                                    <div className="bg-white border rounded-lg p-3">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="font-medium text-gray-500">Day</div>
                                            <div className="text-gray-800">{mockEmail.scheduleContent.day}</div>

                                            <div className="font-medium text-gray-500">Time</div>
                                            <div className="text-gray-800">{mockEmail.scheduleContent.lecture.time}</div>

                                            <div className="font-medium text-gray-500">Subject</div>
                                            <div className="text-gray-800">{mockEmail.scheduleContent.lecture.subject}</div>

                                            <div className="font-medium text-gray-500">Room</div>
                                            <div className="text-gray-800">{mockEmail.scheduleContent.lecture.room || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {mockBulkEmailSummary && (
                        <>
                           <h3 className="text-lg font-semibold text-gray-800">{mockBulkEmailSummary.subject}</h3>
                           <div className="mt-2 mb-4 p-4 bg-gray-100/70 border-l-4 border-blue-400 rounded-r-md whitespace-pre-wrap">
                               <p className="text-gray-700 text-sm font-mono">{mockBulkEmailSummary.emailBodyPreview}</p>
                           </div>
                           <h4 className="font-semibold text-gray-700 mb-2">Successfully notified {mockBulkEmailSummary.recipients.length} teachers:</h4>
                           <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-lg border">
                               {mockBulkEmailSummary.recipients.map(r => (
                                   <div key={r.email} className="text-sm">
                                       <p className="font-medium text-gray-800">{r.name}</p>
                                       <p className="text-gray-500">{r.email}</p>
                                   </div>
                               ))}
                           </div>
                        </>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t text-right rounded-b-2xl">
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
};

export default MockMailbox;