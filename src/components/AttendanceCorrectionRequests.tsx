import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { Check, X, Clock } from 'lucide-react';

interface CorrectionRequest {
  id: number;
  user_id: number;
  username: string;
  date: string;
  clock_in: string;
  clock_out: string;
  reason: string;
  approved_by_senior: string;
  status: 'pending' | 'approved' | 'rejected';
  is_overtime: boolean;
}

export function AttendanceCorrectionRequests() {
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.ATTENDANCE_CORRECTIONS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching correction requests:', error);
    }
    setIsLoading(false);
  };

  const handleUpdateRequest = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ATTENDANCE_CORRECTIONS}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        fetchRequests();
      } else {
        alert(data.message || 'Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString();
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200/60">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-indigo-500" />
        <h3 className="text-xl font-semibold text-slate-800">Attendance Correction Requests</h3>
      </div>
      {isLoading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Clock In / Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Approved By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{req.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{formatDate(req.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {formatTime(req.clock_in)} - {formatTime(req.clock_out)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{req.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {req.is_overtime ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{req.approved_by_senior}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        req.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : req.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateRequest(req.id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleUpdateRequest(req.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
