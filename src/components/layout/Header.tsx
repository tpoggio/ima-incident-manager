import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('ima-language', lang);
  };

  const navItems = [{ to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard }];

  return (
    <header className="bg-ima-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-1.5">
                <span className="text-ima-blue font-bold text-lg">IMA</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">Incident Manager</span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-sm">
              <Globe className="h-4 w-4" />
              <select
                value={i18n.language}
                onChange={e => changeLanguage(e.target.value)}
                className="bg-transparent border-none focus:outline-none cursor-pointer text-white"
              >
                <option value="es" className="text-gray-900">
                  Español
                </option>
                <option value="en" className="text-gray-900">
                  English
                </option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{user?.username || t('common.user')}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title={t('common.logout')}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
