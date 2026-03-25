// ===== Socket.IO Client =====

let socket = null;

const initSocket = () => {
  const user = Auth.getUser();
  if (!user) return;

  socket = io();

  socket.on('connect', () => {
    socket.emit('join', {
      userId: user.id,
      role: user.role
    });
  });

  socket.on('new-report', (data) => {
    showToast(`New report: ${data.report.crimeType}`, 'red');
    if (typeof onNewReport === 'function') {
      onNewReport(data);
    }
  });

  socket.on('report-updated', (data) => {
    showToast(`Report status updated: ${data.report.status}`, 'success');
    if (typeof onReportUpdated === 'function') {
      onReportUpdated(data);
    }
  });
};
