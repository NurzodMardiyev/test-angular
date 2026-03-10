import {Component, OnInit} from '@angular/core';
import { RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-services',
  imports: [
    RouterOutlet
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  standalone: true
})
export class Services implements OnInit {

  ngOnInit() {

  }
}
