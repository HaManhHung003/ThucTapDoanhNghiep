const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const numberFormatter = new Intl.NumberFormat('vi-VN');

export const formatVND = (value) => vndFormatter.format(value ?? 0);
export const formatUSD = (value) => usdFormatter.format(value ?? 0);
export const formatNumber = (value) => numberFormatter.format(value ?? 0);

export const formatDate = (value) =>
  new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** "Nguyễn Văn Admin" -> "VA" */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

