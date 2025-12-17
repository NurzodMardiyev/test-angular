import {Component, OnInit} from '@angular/core';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {filter} from 'rxjs/operators';
import menuData from '../../../assets/menu.json';
import {Card} from 'primeng/card';
import {TranslateModule} from '@ngx-translate/core';

interface AppMenuItem {
  label: string;
  icon?: string;
  routerLink?: string[];
  items?: AppMenuItem[];
}

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterModule, Card, TranslateModule],
  templateUrl: './mobile.html',
  styleUrls: ['./mobile.scss']
})
export class Mobile implements OnInit {
  items: AppMenuItem[] = menuData;
  showMenu = false;
  openStates: Record<string, boolean> = {};
  activeRoute = '';
  activeLabel = 'app.home';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.syncWithRoute(this.router.url);
    });

    this.syncWithRoute(this.router.url);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleDropdown(label: string, item: AppMenuItem) {
    if (!item.items || item.items.length === 0) {
      const route = this.getRouterLink(item);
      if (route) {
        this.activeRoute = this.normalizeUrl(route);
        this.activeLabel = item.label;
        this.showMenu = false;
        this.router.navigate(item.routerLink!);
      }
      return;
    }
    this.openStates[label] = !this.openStates[label];
  }

  isOpen(label: string): boolean {
    return !!this.openStates[label];
  }

  /** ✅ RouterLink asosida active item */
  isActive(item: AppMenuItem): boolean {
    const route = this.getRouterLink(item);
    if (!route) return false;
    return this.activeRoute === this.normalizeUrl(route);
  }

  /** 🔹 Route bo‘yicha sync qilish */
  private syncWithRoute(currentUrl: string) {
    const cleanUrl = this.normalizeUrl(currentUrl);
    this.activeRoute = cleanUrl;

    const pathStack: string[] = [];
    const found = this.findMenuByRoute(this.items, cleanUrl, pathStack);

    if (found) {
      this.activeLabel = found.label;
      pathStack.forEach(lbl => (this.openStates[lbl] = true));
    } else {
      this.activeLabel = 'app.home';
    }
  }

  private findMenuByRoute(items: AppMenuItem[], currentUrl: string, pathStack: string[]): AppMenuItem | null {
    for (const item of items) {
      const route = this.getRouterLink(item);
      if (route && this.normalizeUrl(route) === currentUrl) return item;

      if (item.items && item.items.length > 0) {
        pathStack.push(item.label);
        const found = this.findMenuByRoute(item.items, currentUrl, pathStack);
        if (found) return found;
        pathStack.pop();
      }
    }
    return null;
  }

  private getRouterLink(item: AppMenuItem): string | null {
    if (!item.routerLink) return null;
    if (Array.isArray(item.routerLink)) return item.routerLink[0];
    return (item.routerLink as any).toString();
  }

  private normalizeUrl(url: string): string {
    return url.replace(/^\/+|\/+$/g, '').split('?')[0];
  }

}
