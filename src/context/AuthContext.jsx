import { createContext, useContext, useState, useEffect } from 'react';
import {
  obtenerSesion,
  cerrarSesion,
  guardarSesion,
  apiClient,
} from '../services/authService';
import { useSessionTimeout } from '../shared/hooks/useSessionTimeout';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion]     = useState(null);
  const [cargando, setCargando] = useState(true);

  // Auto-logout después de 15 minutos de inactividad
  const handleSessionTimeout = () => {
    console.warn('⏰ Sesión expirada por inactividad');
    cerrarSesion();
    setSesion(null);
    window.location.href = '/login?timeout=true';
  };

  useSessionTimeout(15, handleSessionTimeout, !!sesion);

  useEffect(() => {
    setSesion(obtenerSesion());
    setCargando(false);
  }, []);

  /**
   * Guarda la sesión y carga el perfil del backend (incluye rol RBAC).
   */
  function iniciarSesion(token, usuario) {
    guardarSesion(token, usuario);
    setSesion({ token, usuario });

    // Si el rol ya vino en la respuesta del login no hace falta otro request
    if (usuario.rol) return;

    // Enriquece el perfil con el rol del backend (async, no bloquea)
    apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const usuarioConRol = { ...usuario, rol: res.data.rol, nombre: res.data.nombre };
      guardarSesion(token, usuarioConRol);
      setSesion({ token, usuario: usuarioConRol });
    }).catch(() => {
      const usuarioConRol = { ...usuario, rol: 'CLIENTE' };
      guardarSesion(token, usuarioConRol);
      setSesion({ token, usuario: usuarioConRol });
    });
  }

  function salir() {
    cerrarSesion();
    setSesion(null);
  }

  return (
    <AuthContext.Provider value={{ sesion, cargando, iniciarSesion, salir }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
