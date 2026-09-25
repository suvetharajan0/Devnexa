import { forwardRef, useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from './Input.jsx';

export const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      icon={Lock}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-ink-400 hover:text-ink-600"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
      {...props}
    />
  );
});