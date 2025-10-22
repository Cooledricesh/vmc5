'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const PasswordInput = ({
  value,
  onChange,
  error,
  disabled,
}: PasswordInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // 숫자만 허용, 최대 4자리
    if (/^\d{0,4}$/.test(input)) {
      onChange(input);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        비밀번호 <span className="text-red-500">*</span>
      </label>
      <Input
        type="password"
        inputMode="numeric"
        pattern="\d{4}"
        value={value}
        onChange={handleChange}
        placeholder="4자리 숫자"
        disabled={disabled}
        maxLength={4}
        className={cn(error && 'border-red-500 focus:ring-red-500')}
      />
      <p className="text-xs text-gray-500">
        리뷰 수정/삭제 시 사용됩니다. 4자리 숫자만 입력 가능합니다.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
