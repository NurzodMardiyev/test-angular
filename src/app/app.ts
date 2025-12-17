import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  isMobile = false;
  isTablet = false;
  isDesktop = false;

  constructor(
    private deviceService: DeviceDetectorService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    // Default language from localStorage or 'uz'
    const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'uz';
    this.translate.setDefaultLang('uz');
    this.translate.use(lang);
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();
  }
}
