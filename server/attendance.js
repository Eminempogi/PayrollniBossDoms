import { pool } from './database.js';

export async function fileAttendanceCorrection(userId, details) {
  const { date, clockIn, clockOut, reason, approvedBy } = details;

  if (!date || !clockIn || !clockOut || !reason || !approvedBy) {
    return { success: false, message: 'Missing required fields.' };
  }

  try {
    const clockInDateTime = new Date(`${date}T${clockIn}`);
    const clockOutDateTime = new Date(`${date}T${clockOut}`);

    await pool.execute(
      `INSERT INTO attendance_corrections (user_id, date, clock_in, clock_out, reason, approved_by_senior)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, date, clockInDateTime, clockOutDateTime, reason, approvedBy]
    );

    return { success: true, message: 'Attendance correction request filed successfully.' };
  } catch (error) {
    console.error('File attendance correction error:', error);
    return { success: false, message: 'Server error' };
  }
}

export async function getAttendanceCorrectionRequests() {
  try {
    const [requests] = await pool.execute(`
      SELECT ac.*, u.username
      FROM attendance_corrections ac
      JOIN users u ON ac.user_id = u.id
      ORDER BY ac.created_at DESC
    `);
    return requests;
  } catch (error) {
    console.error('Get attendance correction requests error:', error);
    return [];
  }
}

export async function updateAttendanceCorrectionStatus(id, status) {
  if (!['approved', 'rejected'].includes(status)) {
    return { success: false, message: 'Invalid status.' };
  }

  try {
    await pool.execute(
      'UPDATE attendance_corrections SET status = ? WHERE id = ?',
      [status, id]
    );

    if (status === 'approved') {
      const [rows] = await pool.execute('SELECT * FROM attendance_corrections WHERE id = ?', [id]);
      const request = rows[0];

      // Check if a time entry for that day already exists
      const [existingEntry] = await pool.execute(
        'SELECT * FROM time_entries WHERE user_id = ? AND date = ?',
        [request.user_id, request.date]
      );

      if (existingEntry.length > 0) {
        // Update the existing time entry
        await pool.execute(
          'UPDATE time_entries SET clock_in = ?, clock_out = ? WHERE id = ?',
          [request.clock_in, request.clock_out, existingEntry[0].id]
        );
      } else {
        // Insert a new time entry
        const weekStart = getWeekStart(new Date(request.date));
        await pool.execute(
          'INSERT INTO time_entries (user_id, clock_in, clock_out, date, week_start) VALUES (?, ?, ?, ?, ?)',
          [request.user_id, request.clock_in, request.clock_out, request.date, weekStart]
        );
      }
    }

    return { success: true, message: `Request ${status}.` };
  } catch (error) {
    console.error('Update attendance correction status error:', error);
    return { success: false, message: 'Server error' };
  }
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
}
