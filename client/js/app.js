// ===== SAFE POINT - Shared Utilities =====

const API = '';

// Auth helpers
const Auth = {
  getToken: () => localStorage.getItem('sp_token'),
  getUser: () => JSON.parse(localStorage.getItem('sp_user') || 'null'),
  setAuth: (token, user) => {
    localStorage.setItem('sp_token', token);
    localStorage.setItem('sp_user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
  },
  isLoggedIn: () => !!localStorage.getItem('sp_token'),
  requireAuth: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },
  requireRole: (role) => {
    const user = Auth.getUser();
    if (!user || user.role !== role) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  }
};

// Fetch wrapper
const api = async (url, options = {}) => {
  const token = Auth.getToken();
  const headers = {};

  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  const mergedHeaders = { ...headers, ...(options.headers || {}) };

  const res = await fetch(`${API}${url}`, { 
    ...options, 
    headers: mergedHeaders 
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Toast notification
const showToast = (message, type = 'red') => {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
};

// Format date
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Build sidebar
const buildSidebar = (role, activePage) => {
  const user = Auth.getUser();
  if (!user) return;

  const iconSvgs = {
    dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
    report: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    profile: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    patrols: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    officers: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  };

  const navItems = {
    citizen: [
      { href: '/citizen/dashboard.html', icon: iconSvgs.dashboard, label: 'Dashboard' },
      { href: '/citizen/report.html', icon: iconSvgs.report, label: 'Send Report' },
      { href: '/citizen/profile.html', icon: iconSvgs.profile, label: 'Profile' },
      { href: '/citizen/settings.html', icon: iconSvgs.settings, label: 'Settings' }
    ],
    officer: [
      { href: '/officer/dashboard.html', icon: iconSvgs.dashboard, label: 'Report Dashboard' },
      { href: '/officer/patrols.html', icon: iconSvgs.patrols, label: 'Patrols' },
      { href: '/officer/profile.html', icon: iconSvgs.profile, label: 'Profile' },
      { href: '/officer/settings.html', icon: iconSvgs.settings, label: 'Settings' }
    ],
    super: [
      { href: '/super/dashboard.html', icon: iconSvgs.dashboard, label: 'Report Dashboard' },
      { href: '/super/officers.html', icon: iconSvgs.officers, label: 'Manage Officers' },
      { href: '/super/profile.html', icon: iconSvgs.profile, label: 'Profile' },
      { href: '/super/settings.html', icon: iconSvgs.settings, label: 'Settings' }
    ]
  };

  const roleLabels = { citizen: 'Citizen', officer: 'Patrol Officer', super: 'Super Officer' };
  const items = navItems[role] || [];

  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="logo">SAFE POINT</div>
      <div class="role-badge">${roleLabels[role]}</div>
    </div>
    <nav class="sidebar-nav">
      ${items.map(item => `
        <a href="${item.href}" class="${activePage === item.label ? 'active' : ''}">
          <span class="nav-icon">${item.icon}</span>
          ${item.label}
        </a>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="avatar">${initial}</div>
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-role">${roleLabels[role]}</div>
        </div>
        <button onclick="Auth.clear(); window.location.href='/login.html';" style="background:none;border:none;color:var(--gray);cursor:pointer;font-size:0.75rem;">Logout</button>
      </div>
    </div>
  `;
};

// Status badge HTML
const statusBadge = (status) => {
  return `<span class="status status-${status}">${status}</span>`;
};
