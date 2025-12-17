import {Injectable, signal} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly _isMobile = signal(false);
  private readonly _isDesktop = signal(false);
  private readonly _isTablet = signal(false);

  constructor(private device: DeviceDetectorService) {
    this.detectDeviceType();
    window.addEventListener('resize', () => this.detectDeviceType());
  }

  private detectDeviceType(): void {
    this._isDesktop.set(this.device.isDesktop());
    this._isMobile.set(this.device.isMobile());
    this._isTablet.set(this.device.isTablet());
  }

  isMobile(): boolean {
    return this.device.isMobile();
  }

  isDesktop(): boolean {
    return this.device.isDesktop();
  }

}
