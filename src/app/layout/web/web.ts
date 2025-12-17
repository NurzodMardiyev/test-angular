import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {filter} from 'rxjs/operators';
import categoryData from '../../../assets/category.json';
import {MenuItem} from 'primeng/api';
import {ContentComponent} from '../content/content';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Select} from 'primeng/select';
import {LanguageSwitcherComponent} from '../../components/language-switcher/language-switcher.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-web',
  imports: [RouterModule, ContentComponent, TranslateModule, Select, LanguageSwitcherComponent, NgForOf, NgIf],
  templateUrl: './web.html',
  standalone: true,
  styleUrls: ['./web.scss']
})
export class Web implements OnInit {

  items: MenuItem[] = categoryData;

  openStates: Record<string, boolean> = {};
  activeRoute: string = '';



  constructor(
    private router: Router
  ) {
  }


  logout() {
    console.log('Chiqish bosildi');
  }

  // =============================
  //           INIT
  // =============================
  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.activeRoute = this.normalizeUrl(this.router.url);
        this.syncWithRoute(this.activeRoute);
      });

    this.activeRoute = this.normalizeUrl(this.router.url);
    this.syncWithRoute(this.activeRoute);
  }

  // =============================
  //         MENU ACTIONS
  // =============================
  toggleDropdown(label: string, item: MenuItem) {
    if (!item.items || item.items.length === 0) {
      const route = this.getRouterLink(item);
      if (route) {
        this.activeRoute = this.normalizeUrl(route);
        this.router.navigate(item.routerLink!);
      }
      return;
    }
    this.openStates[label] = !this.openStates[label];
  }

  isOpen(label: string): boolean {
    return !!this.openStates[label];
  }

  // =============================
  //         ACTIVE CHECK
  // =============================
  isActive(item: MenuItem): boolean {
    const route = this.getRouterLink(item);
    if (!route) return false;

    const cleanRoute = this.normalizeUrl(route);

    // /payments/list/12  => active bo'ladi
    return this.activeRoute.startsWith(cleanRoute);
  }

  // =============================
  //        ROUTE SYNC
  // =============================
  private syncWithRoute(currentUrl: string) {
    const pathStack: string[] = [];
    const found = this.findMenuByRoute(this.items, currentUrl, pathStack);

    if (found) {
      pathStack.forEach(lbl => (this.openStates[lbl] = true));
    }
  }

  private findMenuByRoute(items: MenuItem[], currentUrl: string, pathStack: string[]): MenuItem | null {
    for (const item of items) {
      const route = this.getRouterLink(item);

      if (route && this.normalizeUrl(route) === currentUrl) {
        return item;
      }

      if (item.items && item.items.length) {
        pathStack.push(item.label || '');
        const found = this.findMenuByRoute(item.items, currentUrl, pathStack);
        if (found) return found;
        pathStack.pop();
      }
    }
    return null;
  }

  // =============================
  //      UTILS
  // =============================
  private getRouterLink(item: MenuItem): string | null {
    if (!item.routerLink) return null;
    if (Array.isArray(item.routerLink)) return item.routerLink[0];
    return item.routerLink.toString();
  }

  private normalizeUrl(url: string): string {
    return url
      .replace(/^\/+/, '')   // faqat boshidagi / larni olib tashlaydi
      .split('?')[0]
      .trim();
  }

}
