import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store';
import { AlertCircle, Globe } from 'lucide-react';

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('ima-language', lang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(i18n.language === 'es' ? 'Por favor ingrese usuario y contraseña' : 'Please enter username and password');
      return;
    }

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch {
      setError(i18n.language === 'es' ? 'Credenciales inválidas. Intente con admin / password123' : 'Invalid credentials. Try admin / password123');
    }
  };

  return (
    <div className="min-h-screen bg-[#2778c4] flex items-center justify-center p-4 relative">
      {/* Language selector */}
      <div className="absolute top-4 right-6 text-white/80 text-sm flex items-center gap-1">
        <Globe className="h-4 w-4" />
        <select
          value={i18n.language}
          onChange={e => changeLanguage(e.target.value)}
          className="bg-transparent border-none focus:outline-none cursor-pointer text-white/80 hover:text-white"
        >
          <option value="es" className="text-gray-900">Español</option>
          <option value="en" className="text-gray-900">English</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-lg w-full max-w-[380px]">
        <div className="px-10 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-[#1a4b8c] mb-1">IMA</h1>
            <p className="text-[#1a4b8c]/70 text-base">Incident Manager</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Usuario */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm text-gray-400 mb-1">
                {t('auth.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                style={{ 
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#c0c0c0',
                  borderRadius: '4px',
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Contraseña */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ 
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#c0c0c0',
                  borderRadius: '4px',
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                backgroundColor: '#4db5e8', 
                borderRadius: '9999px',
                width: '100%',
                height: '40px',
                color: 'white',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isLoading ? t('common.loading') : t('auth.login')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
