// src/app/layout/content/content.ts
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './content.html',
  styleUrls: ['./content.scss']
})
export class ContentComponent {}
