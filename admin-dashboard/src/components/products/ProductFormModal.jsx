import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CircleAlert, LoaderCircle } from 'lucide-react';
import Modal from '@/components/common/Modal';
import { PRODUCT_CATEGORIES } from '@/constants';

const DEFAULT_VALUES = { title: '', brand: '', category: '', price: '', stock: '', description: '' };

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

export default function ProductFormModal({ open, onClose, onSubmit }) {
  const [submitError, setSubmitError] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  // Reset form mỗi lần mở modal
  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES);
      setSubmitError(null);
    }
  }, [open, reset]);

  const submit = async (values) => {
    try {
      setSubmitError(null);
      await onSubmit({ ...values, title: values.title.trim(), brand: values.brand.trim() });
      onClose();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const inputClass = (hasError) => `input ${hasError ? 'input-error' : ''}`;

  return (
    <Modal
      open={open}
      onClose={isSubmitting ? () => {} : onClose}
      title="Thêm sản phẩm / dịch vụ"
      description="Điền thông tin bên dưới để tạo mới."
    >
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        {submitError && (
          <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
          </div>
        )}

        <Field label="Tên sản phẩm / dịch vụ" required error={errors.title}>
          <input
            className={inputClass(errors.title)}
            placeholder="VD: iPhone 15 Pro Max"
            {...register('title', {
              required: 'Vui lòng nhập tên',
              minLength: { value: 3, message: 'Tên phải có ít nhất 3 ký tự' },
            })}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Danh mục" required error={errors.category}>
            <select
              className={inputClass(errors.category)}
              {...register('category', { required: 'Vui lòng chọn danh mục' })}
            >
              <option value="">-- Chọn danh mục --</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Thương hiệu" error={errors.brand}>
            <input className={inputClass(errors.brand)} placeholder="VD: Apple" {...register('brand')} />
          </Field>

          <Field label="Giá (USD)" required error={errors.price}>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              className={inputClass(errors.price)}
              placeholder="0.00"
              {...register('price', {
                required: 'Vui lòng nhập giá',
                valueAsNumber: true,
                validate: (v) => (!Number.isNaN(v) && v > 0) || 'Giá phải lớn hơn 0',
              })}
            />
          </Field>

          <Field label="Tồn kho" required error={errors.stock}>
            <input
              type="number"
              inputMode="numeric"
              className={inputClass(errors.stock)}
              placeholder="0"
              {...register('stock', {
                required: 'Vui lòng nhập số lượng',
                valueAsNumber: true,
                validate: (v) => (Number.isInteger(v) && v >= 0) || 'Số lượng phải là số nguyên ≥ 0',
              })}
            />
          </Field>
        </div>

        <Field label="Mô tả" error={errors.description}>
          <textarea
            rows={3}
            className={`${inputClass(errors.description)} resize-none`}
            placeholder="Mô tả ngắn về sản phẩm / dịch vụ..."
            {...register('description', { maxLength: { value: 300, message: 'Tối đa 300 ký tự' } })}
          />
        </Field>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

