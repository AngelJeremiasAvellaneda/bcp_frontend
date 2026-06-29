/**
 * ErrorBoundary — Captura errores de React y muestra UI de fallback.
 * Previene que toda la aplicación se rompa por un error en un componente.
 */
import { Component } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log del error (puede enviarse a servicio de monitoreo)
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    // Opcional: Enviar a servicio de logging
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          style={{ background: 'var(--color-bg)' }}
        >
          <div 
            className="max-w-lg w-full rounded-2xl border p-8 text-center"
            style={{ 
              background: 'var(--color-card-bg)',
              borderColor: 'var(--color-border)'
            }}
            role="alert"
            aria-live="assertive"
          >
            {/* Icono de error */}
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)' }}
              aria-hidden="true"
            >
              <AlertTriangle size={32} style={{ color: '#ef4444' }} />
            </div>

            {/* Título */}
            <h1 
              className="text-2xl font-black mb-2"
              style={{ color: 'var(--color-text-h)' }}
            >
              ¡Ups! Algo salió mal
            </h1>

            {/* Descripción */}
            <p 
              className="text-sm mb-6"
              style={{ color: 'var(--color-text-m)' }}
            >
              Ocurrió un error inesperado. Puedes intentar recargar la página o volver al inicio.
            </p>

            {/* Detalles técnicos (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6">
                <summary 
                  className="cursor-pointer text-xs font-semibold mb-2"
                  style={{ color: 'var(--color-text-m)' }}
                >
                  Detalles técnicos
                </summary>
                <div 
                  className="text-xs font-mono p-3 rounded-xl overflow-auto max-h-40"
                  style={{ 
                    background: 'var(--color-bg)',
                    color: '#ef4444'
                  }}
                >
                  <p className="font-bold mb-1">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="text-xs opacity-75">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Acciones */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-105"
                style={{ 
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-h)'
                }}
                aria-label="Recargar página"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Recargar
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: '#0052FF' }}
                aria-label="Volver al inicio"
              >
                <Home size={16} aria-hidden="true" />
                Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
