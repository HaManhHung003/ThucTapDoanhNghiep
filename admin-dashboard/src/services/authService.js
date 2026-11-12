/**
 * Auth Service (MÔ PHỎNG)
 * ------------------------------------------------------------------
 * Vì không có backend thật, service này giả lập việc gọi API đăng nhập
 * và lưu phiên đăng nhập (session) vào localStorage.
 *
 * Khi có backend thật, chỉ cần thay phần thân hàm `login` bằng:
 *   const data = await axiosClient.post('/auth/login', { email, password });
 *   saveSession(data);
 *   return data;
 */

const STORAGE_KEY = 'saleshub_auth_session';

export const DEMO_ACCOUNT = {
  email: 'admin@demo.com',
  password: '123456',
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const authService = {
  async login({ email, password }) {
    await delay(800); // giả lập độ trễ mạng

    const isValid =
      email.trim().toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;

    if (!isValid) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    const session = {
      token: `mock-jwt-token.${Date.now()}`,
      user: {
        id: 1,
        name: 'Nguyễn Văn Admin',
        email: DEMO_ACCOUNT.email,
        role: 'Quản trị viên',
      },
    };

    saveSession(session);
    return session;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },

  getSession,

  getToken() {
    return getSession()?.token ?? null;
  },
};

export default authService;

