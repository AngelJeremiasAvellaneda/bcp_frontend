/**
 * shared/index.js — Barrel export de todos los módulos compartidos.
 * Simplifica los imports: import { useToast, FormField } from '@/shared'
 */

/* ══════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════ */
export { default as ErrorBoundary } from './components/ErrorBoundary';
export { default as Toast } from './components/Toast';
export { default as ToastProvider } from './components/ToastProvider';
export { default as LoadingOverlay, PageLoader } from './components/LoadingOverlay';
export { default as Skeleton, SkeletonDashboard, SkeletonMovimientos } from './components/Skeleton';
export { default as EmptyState } from './components/EmptyState';
export { default as ErrorState } from './components/ErrorState';
export { default as AccessDenied } from './components/AccessDenied';
export { default as Breadcrumb } from './components/Breadcrumb';
export { default as ConfirmDialog } from './components/ConfirmDialog';
export { default as FormField, FormTextArea } from './components/FormField';
export { default as ComingSoonPage } from './components/ComingSoonPage';

/* ══════════════════════════════════════════
   HOOKS
══════════════════════════════════════════ */
export { useToast } from './hooks/useToast';
export { useConfirm } from './hooks/useConfirm';
export { useAsync } from './hooks/useAsync';
export { useSessionTimeout } from './hooks/useSessionTimeout';

/* ══════════════════════════════════════════
   VALIDATORS
══════════════════════════════════════════ */
export * from './validators/schemas';

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
export * from './utils/formatters';
export * from './utils/creditoUtils';

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
export * from './constants';
