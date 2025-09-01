import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, UserCheck } from 'lucide-react';

interface AttendanceFilingModalProps {
  onClose: () => void;
  onSubmit: (details: any) => void;
  isLoading: boolean;
}

export function AttendanceFilingModal({ onClose, onSubmit, isLoading }: AttendanceFilingModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clockIn, setClockIn] = useState('');
  const [clockOut, setClockOut] = useState('');
  const [reason, setReason] = useState('');
  const [approvedBy, setApprovedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !clockIn || !clockOut || !reason || !approvedBy) {
      alert('Please fill in all fields.');
      return;
    }
    onSubmit({ date, clockIn, clockOut, reason, approvedBy });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 w-full max-w-md border border-slate-200/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-semibold text-slate-800">File Attendance Correction</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 pl-10 bg-slate-50/80 border border-slate-200 rounded-lg text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Clock In
              </label>
              <div className="relative">
                <Clock className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                <input
                  type="time"
                  value={clockIn}
                  onChange={(e) => setClockIn(e.target.value)}
                  className="w-full p-3 pl-10 bg-slate-50/80 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Clock Out
              </label>
              <div className="relative">
                <Clock className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
                <input
                  type="time"
                  value={clockOut}
                  onChange={(e) => setClockOut(e.target.value)}
                  className="w-full p-3 pl-10 bg-slate-50/80 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              Reason
            </label>
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-slate-400 absolute top-4 left-3" />
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 pl-10 bg-slate-50/80 border border-slate-200 rounded-lg text-slate-800 resize-none"
                rows={3}
                placeholder="Explain why you are filing for a correction"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-2">
              Approved by Senior
            </label>
            <div className="relative">
              <UserCheck className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
              <input
                type="text"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                className="w-full p-3 pl-10 bg-slate-50/80 border border-slate-200 rounded-lg text-slate-800"
                placeholder="Name of the senior who approved this correction"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red-400 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-red-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#B1E6F3] from to-indigo-900 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 btn-enhanced"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
