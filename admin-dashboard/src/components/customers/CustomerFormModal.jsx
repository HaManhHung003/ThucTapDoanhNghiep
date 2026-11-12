import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CircleAlert, LoaderCircle } from 'lucide-react';
import Modal from '@/components/common/Modal';

const DEFAULT_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
};

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-600">{error.message}</p>}
    </div>
  );
}

export default function CustomerFormModal({ open, onClose, onSubmit }) {
  const [submitError, setSubmitError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES);
      setSubmitError(null);
    }
  }, [open, reset]);

  const submit = async (values) => {
    try {
      setSubmitError(null);
      await onSubmit(values);
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Lỗi khi tạo khách hàng');
    }
  };

  const inputClass = (hasError) => `input ${hasError ? 'input-error' : ''}`;

  return (
    <Modal
      open={open}
      onClose={isSubmitting ? () => {} : onClose}
      title="Thêm khách hàng mới"
      description="Nhập thông tin hồ sơ khách hàng để lưu vào danh bạ."
    >
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        {submitError && (
          <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Họ và đệm" required error={errors.lastName}>
            <input
              className={inputClass(errors.lastName)}
              placeholder="VD: Nguyễn Văn"
              {...register('lastName', { required: 'Vui lòng nhập họ' })}
            />
          </Field>

          <Field label="Tên" required error={errors.firstName}>
            <input
              className={inputClass(errors.firstName)}
              placeholder="VD: Nam"
              {...register('firstName', { required: 'Vui lòng nhập tên' })}
            />
          </Field>
        </div>

        <Field label="Địa chỉ Email" required error={errors.email}>
          <input
            type="email"
            className={inputClass(errors.email)}
            placeholder="nam.nguyen@example.com"
            {...register('email', {
              required: 'Vui lòng nhập email',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' },
            })}
          />
        </Field>

        <Field label="Số điện thoại" required error={errors.phone}>
          <input
            className={inputClass(errors.phone)}
            placeholder="0912 345 678"
            {...register('phone', {
              required: 'Vui lòng nhập số điện thoại',
              minLength: { value: 9, message: 'Số điện thoại tối thiểu 9 ký tự' },
            })}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Thành phố / Tỉnh" error={errors.city}>
            <input
              className={inputClass(errors.city)}
              placeholder="TP. Hồ Chí Minh"
              {...register('city')}
            />
          </Field>

          <Field label="Địa chỉ chi tiết" error={errors.address}>
            <input
              className={inputClass(errors.address)}
              placeholder="Số 123 Lê Lợi..."
              {...register('address')}
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Đang lưu...' : 'Lưu khách hàng'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

