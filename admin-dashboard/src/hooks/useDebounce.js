import { useEffect, useState } from 'react';

/**
 * Trì hoãn cập nhật giá trị cho tới khi người dùng ngừng gõ `delay` ms.
 * Dùng cho ô tìm kiếm để tránh gọi API liên tục.
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

