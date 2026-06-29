/**
 * sidebarMenu — Configuración del menú lateral por rol.
 * Fuente única de verdad para la navegación del Core y Admin.
 * Solo se renderizan los items que el rol tiene permitido.
 */
import {
  LayoutDashboard, FileText, CheckCircle, Banknote,
  TrendingDown, Users, Activity, BarChart3, Shield,
  AlertTriangle, Gavel, Settings, UserCog, ClipboardList,
  TrendingUp, PieChart, BookOpen,
} from 'lucide-react';

export const SIDEBAR_MENU = {

  ASESOR: [
    {
      section: 'Principal',
      items: [
        { label: 'Dashboard',            icon: LayoutDashboard, to: '/core',                   exact: true },
        { label: 'Solicitudes',          icon: FileText,        to: '/core/solicitudes'         },
        { label: 'Recuperaciones',       icon: TrendingDown,    to: '/core/recuperaciones'      },
      ],
    },
  ],

  JEFE_REGIONAL: [
    {
      section: 'Principal',
      items: [
        { label: 'Dashboard',            icon: LayoutDashboard, to: '/core',                   exact: true },
        { label: 'Solicitudes',          icon: FileText,        to: '/core/solicitudes'         },
        { label: 'Desembolsos',          icon: Banknote,        to: '/core/desembolsos'         },
      ],
    },
    {
      section: 'Gestión',
      items: [
        { label: 'Recuperaciones',       icon: TrendingDown,    to: '/core/recuperaciones'      },
      ],
    },
  ],

  RIESGOS: [
    {
      section: 'Principal',
      items: [
        { label: 'Dashboard',            icon: LayoutDashboard, to: '/core',                   exact: true },
        { label: 'Evaluaciones',         icon: AlertTriangle,   to: '/core/solicitudes'         },
        { label: 'Recuperaciones',       icon: TrendingDown,    to: '/core/recuperaciones'      },
      ],
    },
  ],

  COMITE: [
    {
      section: 'Principal',
      items: [
        { label: 'Dashboard',            icon: LayoutDashboard, to: '/core',                   exact: true },
        { label: 'Casos Pendientes',     icon: FileText,        to: '/core/solicitudes'         },
      ],
    },
  ],

  /* Rol COBRANZA — gestión de recuperaciones y mora */
  COBRANZA: [
    {
      section: 'Principal',
      items: [
        { label: 'Dashboard',            icon: LayoutDashboard, to: '/core',                   exact: true },
        { label: 'Cartera Morosa',       icon: TrendingDown,    to: '/core/recuperaciones'      },
        { label: 'Solicitudes',          icon: FileText,        to: '/core/solicitudes'         },
      ],
    },
  ],

  GERENCIA: [
    {
      section: 'Ejecutivo',
      items: [
        { label: 'Dashboard',            icon: LayoutDashboard, to: '/core',                   exact: true },
        { label: 'KPIs',                 icon: PieChart,        to: '/core/kpis'                },
        { label: 'Indicadores',          icon: TrendingUp,      to: '/core/indicadores'         },
        { label: 'Reportes',             icon: BookOpen,        to: '/core/reportes'            },
      ],
    },
    {
      section: 'Operaciones',
      items: [
        { label: 'Solicitudes',          icon: FileText,        to: '/core/solicitudes'         },
        { label: 'Desembolsos',          icon: Banknote,        to: '/core/desembolsos'         },
        { label: 'Recuperaciones',       icon: TrendingDown,    to: '/core/recuperaciones'      },
      ],
    },
    {
      section: 'Administración',
      items: [
        { label: 'Usuarios',             icon: Users,           to: '/admin/usuarios'           },
        { label: 'Auditoría',            icon: Activity,        to: '/auditoria'                },
      ],
    },
  ],

  ADMIN: [
    {
      section: 'Core Bancario',
      items: [
        { label: 'Dashboard',            icon: LayoutDashboard, to: '/core',                   exact: true },
        { label: 'Solicitudes',          icon: FileText,        to: '/core/solicitudes'         },
        { label: 'Desembolsos',          icon: Banknote,        to: '/core/desembolsos'         },
        { label: 'Recuperaciones',       icon: TrendingDown,    to: '/core/recuperaciones'      },
      ],
    },
    {
      section: 'Administración',
      items: [
        { label: 'Gestión Usuarios',     icon: UserCog,         to: '/admin/usuarios'           },
        { label: 'Auditoría',            icon: Activity,        to: '/auditoria'                },
        { label: 'Configuración',        icon: Settings,        to: '/admin/configuracion'      },
      ],
    },
  ],

};

/** Menú simplificado para el cliente (usa nav horizontal, no sidebar) */
export const CLIENT_NAV = [
  { label: 'Inicio',       to: '/dashboard',        exact: true },
  { label: 'Operaciones',  to: '/operaciones'       },
  { label: 'Explora',      to: '/explora'           },
];
