// ============================================================
// VMS Pro — Service Proxy Barrel Export
// ============================================================

// DTOs
export * from './dto/auth.dto';
export * from './dto/menu.dto';
export * from './dto/visitor.dto';
export * from './dto/visit.dto';
export * from './dto/user.dto';
export * from './dto/role.dto';
export * from './dto/location.dto';
export * from './dto/notification.dto';
export * from './dto/document.dto';
export * from './dto/form-field.dto';
export * from './dto/mdm.dto';
export * from './dto/settings.dto';

// Service Proxies
export { AuthServiceProxy } from './auth-service-proxy';
export { MenuServiceProxy } from './menu-service-proxy';
export { VisitorServiceProxy } from './visitor-service-proxy';
export { VisitServiceProxy } from './visit-service-proxy';
export { UserServiceProxy } from './user-service-proxy';
export { RoleServiceProxy } from './role-service-proxy';
export { LocationServiceProxy } from './location-service-proxy';
export { NotificationServiceProxy } from './notification-service-proxy';
export { DocumentServiceProxy } from './document-service-proxy';
export { FormFieldServiceProxy } from './form-field-service-proxy';
export { MdmServiceProxy } from './mdm-service-proxy';
export { SettingsServiceProxy } from './settings-service-proxy';
