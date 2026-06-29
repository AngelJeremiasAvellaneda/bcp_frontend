/**
 * AppProviders — Envuelve toda la app con los providers necesarios.
 * Orden: ThemeProvider → AuthProvider → children
 */
import { ThemeProvider } from '../../context/ThemeContext';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../shared/components/ToastProvider';

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
