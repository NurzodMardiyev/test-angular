import {Component, OnInit} from '@angular/core';
import {DeviceService} from '../device.service';
import {Desktop} from '../desktop/desktop';
import {Mobile} from '../mobile/mobile';

@Component({
  selector: 'app-root',
  imports: [
    Desktop,
    Mobile
  ],
  templateUrl: './root.html',
  styleUrl: './root.scss',
  standalone: true
})
export class Root implements OnInit{


  constructor(
    public deviceService: DeviceService
  ) {}

  ngOnInit(): void {}

}
