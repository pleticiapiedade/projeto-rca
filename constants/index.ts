export * as routes from './systemRoutes';
export { device } from './devicesScreens';
export { default as searchTerms } from './searchTerms';
export { default as sem_imagem } from './sem_imagem';
export { default as colors } from './systemColors';

// export const ENCRYPT = process.env.NODE_ENV !== 'development'
export const ENCRYPT = false
export const DISABLE_SERVICE_WORKER = window.agp_config.DISABLE_SERVICE_WORKER
