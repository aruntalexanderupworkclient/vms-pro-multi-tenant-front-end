// ============================================================
// VMS Pro — Centralized Route & Menu Constants
// ============================================================

export type Permission = 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete' | 'canPrint';

export interface SubMenuMeta {
  name: string;
  icon: string;
  route: string;
}

export interface MenuMeta {
  name: string;
  icon: string;
  displayOrder: number;
  permissionName?: string;    // Back-end menu name for permission checks (defaults to name)
  subMenus?: SubMenuMeta[];
}

export interface ChildRoute {
  path: string;
  permission: Permission;
}

export interface ModuleRoute {
  path: string;
  fullPath: string;
  menu?: MenuMeta;
  children: { [key: string]: ChildRoute };
}

// ── Auth Routes ──
export const AUTH_ROUTE = {
  path: 'auth',
  fullPath: '/auth',
  LOGIN:    { path: 'login',    fullPath: '/auth/login' },
  REGISTER: { path: 'register', fullPath: '/auth/register' },
} as const;

// ── App Module Routes ──
export const APP_ROUTES = {

  DASHBOARD: {
    path: 'dashboard',
    fullPath: '/dashboard',
    menu: { name: 'Dashboard', icon: 'dashboard', displayOrder: 1 },
    children: {
      LIST: { path: '', permission: 'canRead' as Permission },
    },
  },

  VISITORS: {
    path: 'visitors',
    fullPath: '/visitors',
    menu: {
      name: 'Visitor Management',
      icon: 'people',
      displayOrder: 2,
      permissionName: 'Visitors',
      subMenus: [
        { name: 'Visitor Directory', icon: 'person_search', route: '/visitors' },
        { name: 'Visit Schedule', icon: 'event_note', route: '/visitors/visits' },
      ],
    },
    children: {
      LIST:            { path: '',                   permission: 'canRead'   as Permission },
      NEW:             { path: 'new',                permission: 'canCreate' as Permission },
      DETAIL:          { path: ':id',                permission: 'canRead'   as Permission },
      EDIT:            { path: ':id/edit',            permission: 'canUpdate' as Permission },
      VISITS:          { path: 'visits',              permission: 'canRead'   as Permission },
      VISIT_NEW:       { path: 'visits/new',          permission: 'canCreate' as Permission },
      VISIT_DETAIL:    { path: 'visits/:id',          permission: 'canRead'   as Permission },
      VISIT_CHECKIN:   { path: 'visits/:id/checkin',  permission: 'canUpdate' as Permission },
      VISIT_CHECKOUT:  { path: 'visits/:id/checkout', permission: 'canUpdate' as Permission },
    },
  },

  USERS: {
    path: 'users',
    fullPath: '/users',
    menu: { name: 'Users', icon: 'person', displayOrder: 3 },
    children: {
      LIST:   { path: '',          permission: 'canRead'   as Permission },
      NEW:    { path: 'new',       permission: 'canCreate' as Permission },
      DETAIL: { path: ':id',       permission: 'canRead'   as Permission },
      EDIT:   { path: ':id/edit',  permission: 'canUpdate' as Permission },
    },
  },

  ROLES: {
    path: 'roles',
    fullPath: '/roles',
    menu: { name: 'Roles', icon: 'security', displayOrder: 4 },
    children: {
      LIST:        { path: '',                permission: 'canRead'   as Permission },
      NEW:         { path: 'new',             permission: 'canCreate' as Permission },
      DETAIL:      { path: ':id',             permission: 'canRead'   as Permission },
      EDIT:        { path: ':id/edit',         permission: 'canUpdate' as Permission },
      PERMISSIONS: { path: ':id/permissions',  permission: 'canUpdate' as Permission },
    },
  },

  LOCATIONS: {
    path: 'locations',
    fullPath: '/locations',
    menu: { name: 'Locations', icon: 'location_on', displayOrder: 5 },
    children: {
      LIST: { path: '',          permission: 'canRead'   as Permission },
      NEW:  { path: 'new',       permission: 'canCreate' as Permission },
      EDIT: { path: ':id/edit',  permission: 'canUpdate' as Permission },
    },
  },

  SETTINGS: {
    path: 'settings',
    fullPath: '/settings',
    menu: { name: 'Settings', icon: 'settings', displayOrder: 6 },
    children: {
      FORM_FIELDS:      { path: 'form-fields',          permission: 'canRead'   as Permission },
      FORM_FIELDS_NEW:  { path: 'form-fields/new',      permission: 'canCreate' as Permission },
      FORM_FIELDS_EDIT: { path: 'form-fields/:id/edit',  permission: 'canUpdate' as Permission },
      MDM:              { path: 'mdm',                   permission: 'canRead'   as Permission },
      MDM_VALUES:       { path: 'mdm/:code',             permission: 'canRead'   as Permission },
    },
  },

  REPORTS: {
    path: 'reports',
    fullPath: '/reports',
    menu: { name: 'Reports', icon: 'assessment', displayOrder: 7 },
    children: {
      LIST: { path: '', permission: 'canRead' as Permission },
    },
  },

  NOTIFICATIONS: {
    path: 'notifications',
    fullPath: '/notifications',
    children: {
      LIST: { path: '', permission: 'canRead' as Permission },
    },
  },

  DOCUMENTS: {
    path: 'documents',
    fullPath: '/documents',
    children: {
      LIST:   { path: '',       permission: 'canRead'   as Permission },
      UPLOAD: { path: 'upload', permission: 'canCreate' as Permission },
    },
  },

} as const;

export const APP_MENUS: MenuMeta[] = Object.values(APP_ROUTES)
  .filter((r): r is typeof r & { menu: MenuMeta } => 'menu' in r && !!r.menu)
  .map(r => r.menu)
  .sort((a, b) => a.displayOrder - b.displayOrder);
