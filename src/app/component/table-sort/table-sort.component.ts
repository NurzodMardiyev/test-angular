import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Table } from 'primeng/table';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-table-sort',
  imports: [
    NgClass
  ],
  templateUrl: './table-sort.component.html',
  styleUrl: './table-sort.component.scss'
})
export class TableSortComponent {
  @Input() field!: string;

  constructor(public dt: Table) {}

  get sortOrder(): number {
    return this.dt.sortField === this.field ? this.dt.sortOrder : 0;
  }

  onSort(event: MouseEvent) {
    this.dt.sort({
      field: this.field,
      order: this.sortOrder === 1 ? -1 : 1
    });
  }
}
