import {Component, OnInit, ViewChild, ChangeDetectorRef, signal} from '@angular/core';
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import {Location, NgClass, NgForOf, NgIf} from "@angular/common";
import {FilterMetadata, PrimeTemplate, SortEvent} from "primeng/api";
import { Skeleton } from "primeng/skeleton";
import {Table, TableFilterEvent, TableLazyLoadEvent, TableModule} from "primeng/table";
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DataTableInput, FilterCounts, Payment } from './reportslistDto';
import { Services } from '../../../../service/services/services';
import { DatePipe } from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {ReviseEnum} from '../../../../service/enums/ReviseStatus';
import {TableSortComponent} from '../../../../component/table-sort/table-sort.component';

@Component({
  selector: 'app-reportslist',
  imports: [
    Button,
    Card,
    PrimeTemplate,
    Skeleton,
    TableModule,
    NgClass,
    DatePipe,
    Dialog,
    ReactiveFormsModule,
    TableSortComponent
  ],
  templateUrl: './reportslist.html',
  styleUrl: './reportslist.scss',
  standalone: true
})
export class Reportslist implements OnInit {
  @ViewChild('dt') dt!: Table;

  payments: Payment[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  currentFilter: string = 'all';
  first: number = 0;
  rows: number = 15;
  displayDialog: boolean = false;
  filters: TableFilterEvent = {};

  name = signal('');
  reviseFormSubmit = false;
  searchValue: string | undefined;
  isLoading: boolean = true;

  dataTableInput: DataTableInput = {
    draw: 0,
    start: 0,
    length: 15,
    search: { value: '', regex: false },
    order: [{ column: 0, dir: 'desc' }],
    columns: [
      { data: 'insTime', name: 'insTime', searchable: false, orderable: true, search: { value: '', regex: false } },
      { data: 'number', name: 'number', searchable: true, orderable: true, search: { value: '', regex: false } },
      { data: 'fromDate', name: 'fromDate', searchable: true, orderable: true, search: { value: '', regex: false } },
      { data: 'toDate', name: 'toDate', searchable: true, orderable: true, search: { value: '', regex: false } },
      { data: 'confPer', name: 'confPer', searchable: true, orderable: true, search: { value: '', regex: false } },
      { data: 'status', name: 'status', searchable: true, orderable: true, search: { value: '', regex: false } },
    ],
  };

  constructor(
    private router: Router,
    private location: Location,
    private service: Services,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.loadData()
  }


  async loadData() {
    this.isLoading = true;

    this.dataTableInput.columns.forEach((column) => {
      const columnFilters = (this.filters as { [key: string]: FilterMetadata[] })[column.data];

      if (columnFilters && Array.isArray(columnFilters)) {
        const operator = columnFilters[0]?.operator || 'or';

        const searchParts = columnFilters.flatMap((filter) => {
          if (
            filter.value === null ||
            filter.value === undefined ||
            (Array.isArray(filter.value) && filter.value.length === 0) ||
            (typeof filter.value === 'string' && filter.value.trim() === '')
          ) {
            return [];
          }

          if (Array.isArray(filter.value)) {
            return filter.value.map((val) => `${filter.matchMode}:${val}`);
          }

          return `${filter.matchMode}:${filter.value}`;
        });

        const glue = operator.toLowerCase() === 'and' ? '&&' : '||';

        if (searchParts.length > 0) {
          column.search = {
            value: `${searchParts.join(glue)}`,
            regex: false,
          };
        } else {
          column.search = {
            value: '',
            regex: false,
          };
        }
      }
    });

    if (this.searchValue != null) {
      this.dataTableInput.search.value = this.searchValue;
    }

    try {
      const response = await firstValueFrom(this.service.datatable(this.dataTableInput, 'revise'));
      this.payments = response.data.data as Payment[];
      this.totalRecords = response.data.recordsFiltered;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
    }
  }

  onFilter(event: TableFilterEvent) {
    this.filters = event.filters || {};
    Object.entries(this.filters).flatMap(([field, meta]: [string, FilterMetadata[] | undefined]) => {
      if (meta && Array.isArray(meta)) {
        return meta.map(filter => {
          if (filter.matchMode === 'in' && Array.isArray(filter.value)) {
            return filter.value.map(val => ({
              field,
              value: val,
              matchMode: filter.matchMode,
              operator: filter.operator
            }));
          } else {
            return {
              field,
              value: filter.value,
              matchMode: filter.matchMode,
              operator: filter.operator
            };
          }
        });
      }
      return [];
    });

    this.loadData().then(r => null);
  }

  onSort(event: SortEvent) {
    const sortField = event.field;
    const sortOrder = event.order === 1 ? 'asc' : 'desc';

    const columnIndex = this.dataTableInput.columns.findIndex(c => c.data === sortField);

    if (columnIndex !== -1) {
      this.dataTableInput.order = [{column: columnIndex, dir: sortOrder}];
      this.loadData().then(() => null);
    }
  }

  pageChange(event: any) {
    if (event.first !== this.dataTableInput.start || event.rows !== this.dataTableInput.length) {
      this.dataTableInput.start = event.first;
      this.dataTableInput.length = event.rows;
      this.loadData().then(r => null);
    }
  }

  openFileExcel() {
    const formData = new FormBuilder();
    // excel yuklash funksiyasi
    // this.service.download_main_report(formData).subscribe((fileData: Blob) => {
    //   const blob = new Blob([fileData], {type: fileData.type});
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'report.xlsx';
    //   document.body.appendChild(a);
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // });
  }
  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    this.filters.filters = {};
    this.payments = [];
    this.loadData().then(value => null)
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'YANGI': 'bg-blue-100 text-blue-700 border-blue-200',
      'JARAYONDA': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'QABUL_QILINGAN': 'bg-green-100 text-green-700 border-green-200',
      'RAD_ETILGAN': 'bg-red-100 text-red-700 border-red-200',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  }

  getStatusLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'YANGI': 'Yangi',
      'JARAYONDA': 'Jarayonda',
      'QABUL_QILINGAN': 'Qabul qilingan',
      'RAD_ETILGAN': 'Rad etilgan',
    };
    return labelMap[status] || status;
  }

  getconfPerTypeLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'DIRECTOR': 'Direktor',
      'BUGALTER': 'Bugalter',
    };
    return labelMap[status] || status;
  }

  goBack() {
    this.location.back();
  }

  createNew() {
    this.router.navigate(['/services/comparisonreport/createreport'], {
      queryParamsHandling: 'preserve',
    }).then(r => console.log(r));
  }

  viewFile(payment: Payment) {
    console.log('View file for:', payment);
    alert('File ko\'rish funksiyasi');
  }

  selectedPayment: any | null = null;
  async showConfirmationDialog(id: string) {

    this.displayDialog = true;
    this.selectedPayment = this.payments.find(p => p.id === id) || null;
    console.log(this.selectedPayment)
  }

  async onSendReviseToConfirm() {
    this.reviseFormSubmit = true;
    try {
      if (!this.selectedPayment) {
        console.warn('Selected payment yo‘q');
        return;
      }
      console.log(this.selectedPayment.id)

      const payload = {
        id: this.selectedPayment.id,
        status: ReviseEnum.ReviseStatus.JARAYONDA,
        fromDate: this.selectedPayment.docDate,
        toDate: this.selectedPayment.toDate,
        confPer: this.selectedPayment.confPer,
        confPerType: this.selectedPayment.confPerType
      };

      const response = await firstValueFrom(this.service.update(payload, "revise", this.selectedPayment.id));

      if (response && response.success) {
        this.loadData();
        this.reviseFormSubmit = false;
        this.displayDialog = false;
        this.cdr.detectChanges();
      }
    } catch (e) {
      console.error('API xatolik:', e);
    } finally {
      this.reviseFormSubmit = false;
    }

  }
}
