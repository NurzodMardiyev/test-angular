import { inject } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';
import menuData from '../assets/menu.json';
import { DeviceService } from './layout/device.service';

const componentMap: Record<string, () => Promise<any>> = {
  'module/services/services': () => import('./module/services/services').then((m) => m.Services),
  'module/catalog/catalog': () => import('./module/catalog/catalog').then((m) => m.Catalog),
  'module/main/main': () => import('./module/main/main').then((m) => m.Main),
  'module/refund/refund': () => import('./module/refund/refund').then((m) => m.Refund),
  'module/payment/devided/devided': () =>
    import('./module/payment/devided/devided').then((m) => m.Devided),
  'module/payment/application/application': () =>
    import('./module/payment/application/application').then((m) => m.Application),
};

// Rekursiv ravishda route hosil qilamiz
function extractRoutes(menu: any[]): Routes {
  const routes: Routes = [];

  for (const group of menu) {
    if (group.routerLink && group.componentPath && group.componentName) {
      const path = group.routerLink[0].replace(/^\//, '');
      const loader = componentMap[group.componentPath];
      if (loader) {
        routes.push({ path, loadComponent: loader });
      }
    }
    if (group.items) routes.push(...extractRoutes(group.items));
  }
  return routes;
}

const CHILD_ROUTES = extractRoutes(menuData);

// canMatch funksiyalar
// @ts-ignore
const isMobile: CanMatchFn = () => inject(DeviceService).isMobile();
// @ts-ignore
const isDesktop: CanMatchFn = () => inject(DeviceService).isDesktop();

export const routes: Routes = [
  // 💻 Web layout
  {
    path: '',
    canMatch: [isDesktop],
    loadComponent: () => import('./layout/web/web').then((m) => m.Web),
    children: [
      ...CHILD_ROUTES,
      { path: '', pathMatch: 'full', redirectTo: CHILD_ROUTES[0]?.path ?? '' },
    ],
  },
  // 📱 Mobile layout
  {
    path: '',
    canMatch: [isMobile],
    loadComponent: () => import('./layout/mobile/mobile').then((m) => m.Mobile),
    children: [
      ...CHILD_ROUTES,
      { path: '', pathMatch: 'full', redirectTo: CHILD_ROUTES[0]?.path ?? '' },
    ],
  },
  { path: '**', redirectTo: '' },
];
