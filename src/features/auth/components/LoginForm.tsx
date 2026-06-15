import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { loginThunk } from '../slice/auth.thunk';
import { clearError } from '../slice/auth.slice';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ userName, password }));
  };

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) dispatch(clearError());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-medium text-white">
          Usuario
        </label>
        <input
          type="text"
          value={userName}
          onChange={handleChange(setUserName)}
          placeholder="Ingresá tu usuario"
          autoComplete="username"
          className="h-9 rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 text-sm outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-medium text-white">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChange(setPassword)}
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
            className="h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 pr-10 text-sm outline-none transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-[#ff4444]">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading || !userName || !password}
        className="mt-1 h-9 w-full rounded-[6px] bg-white text-black text-sm font-medium hover:bg-[#e0e0e0] transition-colors border-0"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Iniciando sesión...
          </span>
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
