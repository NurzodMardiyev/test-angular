// devided.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import {RouterOutlet} from '@angular/router';
import {Card} from 'primeng/card';


@Component({
  selector: 'app-devided',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SkeletonModule,
    TooltipModule,
    RouterOutlet,
  ],
  templateUrl: './devided.html',
  styleUrl: './devided.scss',
})
export class Devided implements OnInit {

  ngOnInit() {
    // Initial data yuklanmaydi - faqat button bosilganda
  }
}
