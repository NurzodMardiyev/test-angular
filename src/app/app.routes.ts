import { Routes } from '@angular/router';
import {Root} from './layout/root/root';
import {Dashboard} from './module/dashboard/dashboard';
import {Services} from './module/services/services';
import {Devided} from './module/services/devided/devided';
import {Devidedform} from './module/services/devided/devidedform/devidedform';
import {List} from './module/services/list/list';
import {Devidedlist} from './module/services/devided/devidedlist/devidedlist';
import {Error401Component} from './component/pages/error/401.component';
import {Error403Component} from './component/pages/error/403.component';
import {Error404Component} from './component/pages/error/404.component';
import {Error500Component} from './component/pages/error/500.component';
import {Comparisonreport} from './module/services/comparisonreport/comparisonreport';
import {Refund} from './module/services/refund/refund';
import {Refundlist} from './module/services/refund/refundlist/refundlist';
import {Reportslist} from './module/services/comparisonreport/reportslist/reportslist';
import {Createreport} from './module/services/comparisonreport/createreport/createreport';
// import {canActivateAuthGuard} from './config/authentication/auth.guard';

export const routes: Routes = [
  {
    path: '401', component: Error401Component,
    data: {
      title: 'Рўйхатдан ўтмаган!'
    }
  },
  {
    path: '403', component: Error403Component,
    data: {
      title: 'Тақиқланган!'
    }
  },
  {
    path: '404', component: Error404Component,
    data: {
      title: 'Саҳифа топилмади!'
    }
  },
  {
    path: '500', component: Error500Component, data: {
      title: 'Сервер хатолиги!'
    }
  },
  {
    path: '',
    component: Root,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},

      {
        path: 'dashboard',
        component: Dashboard,
        data: {
          title: 'Asosiy oyna',
          breadcrumb: 'Asosiy oyna'
        }
      },
      {
        path: "services",
        component: Services,
        data: {
          title: "Xizmatlar",
          breadcrumb: 'Xizmatlar'
        },
        children: [
          {path: '', redirectTo: 'list-service', pathMatch: 'full'},
          {
            path: 'list-service',
            component: List,
            canActivate: [],
            data: {roles: []}
          },
          {
            path: "devided",
            component: Devided,
            canActivate: [],
            data: {roles: []},
            children: [
              {path: '', redirectTo: 'devidedlist', pathMatch: 'full'},
              {path: 'devidedlist', component: Devidedlist},
              {
                path: "devidedform",
                component: Devidedform,
                canActivate: [],
                data: {roles: []}
              },
            ]
          },
          {
            path: "comparisonreport",
            component: Comparisonreport,
            canActivate: [],
            data: {roles: []},
            children: [
              {path: '', redirectTo: 'reportslist', pathMatch: 'full'},
              {path: 'reportslist', component: Reportslist},
              {
                path: "createreport",
                component: Createreport,
                canActivate: [],
                data: {roles: []}
              },
            ]
          },
          {
            path: "refund",
            component: Refund,
            canActivate: [],
            data: {roles: []},
            children: [
              {path: '', redirectTo: 'refundlist', pathMatch: 'full'},
              {path: 'refundlist', component: Refundlist},
            ]
          },
        ]
      },

    ]
  }
];
