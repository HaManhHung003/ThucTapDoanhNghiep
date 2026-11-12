const SETTINGS_STORAGE_KEY = 'saleshub_app_settings';

const DEFAULT_SETTINGS = {
  store: {
    name: 'SalesHub Enterprise Store',
    email: 'contact@saleshub.vn',
    phone: '1900 6868',
    address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP. Hồ Chí Minh',
    taxCode: '0315894123',
    currency: 'USD',
    timezone: 'Asia/Ho_Chi_Minh',
  },
  notifications: {
    emailOnNewOrder: true,
    emailOnOutOfStock: true,
    emailDailyReport: false,
    soundAlert: true,
    browserPush: true,
  },
};

const settingsService = {
  get() {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  save(settings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return settings;
  },
};

export default settingsService;

