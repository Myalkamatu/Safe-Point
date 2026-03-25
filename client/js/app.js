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

  const navItems = {
    citizen: [
      { href: '/citizen/dashboard.html', icon: '📊', label: 'Dashboard' },
      { href: '/citizen/report.html', icon: '📝', label: 'Send Report' },
      { href: '/citizen/profile.html', icon: '👤', label: 'Profile' },
      { href: '/citizen/settings.html', icon: '⚙️', label: 'Settings' }
    ],
    officer: [
      { href: '/officer/dashboard.html', icon: '📊', label: 'Report Dashboard' },
      { href: '/officer/patrols.html', icon: '🛡️', label: 'Patrols' },
      { href: '/officer/profile.html', icon: '👤', label: 'Profile' },
      { href: '/officer/settings.html', icon: '⚙️', label: 'Settings' }
    ],
    super: [
      { href: '/super/dashboard.html', icon: '📊', label: 'Report Dashboard' },
      { href: '/super/officers.html', icon: '👮', label: 'Manage Officers' },
      { href: '/super/profile.html', icon: '👤', label: 'Profile' },
      { href: '/super/settings.html', icon: '⚙️', label: 'Settings' }
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
