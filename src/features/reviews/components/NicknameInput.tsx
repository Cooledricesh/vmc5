'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const NicknameInput = ({
  value,
  onChange,
  error,
  disabled,
}: NicknameInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        닉네임 <span className="text-red-500">*</span>
      </label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="닉네임을 입력하세요 (최대 20자)"
        disabled={disabled}
        maxLength={20}
        className={cn(error && 'border-red-500 focus:ring-red-500')}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
