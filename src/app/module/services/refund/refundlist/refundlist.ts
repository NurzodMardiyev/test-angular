import {Component, OnInit, ViewChild} from '@angular/core';
import {Button, ButtonModule} from 'primeng/button';
import {Card} from 'primeng/card';
import {CommonModule, Location, NgIf} from '@angular/common';
import {PrimeTemplate} from 'primeng/api';
import {Skeleton, SkeletonModule} from 'primeng/skeleton';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {ActivatedRoute, Router} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {TooltipModule} from 'primeng/tooltip';
import {Dialog} from 'primeng/dialog';
import {FormsModule, NgForm} from '@angular/forms';
import {FileUpload} from 'primeng/fileupload';
import {Select} from 'primeng/select';
import {Textarea} from 'primeng/textarea';


export interface DataTableInput {
  draw: number;
  start: number;
  length: number;
  search: { value: string; regex: boolean };
  order: Array<{ column: number; dir: string }>;
  columns: Column[];
}

export interface Column {
  data: string;
  name: string;
  searchable: boolean;
  orderable: boolean;
  search: {
    value: string;
    regex: boolean;
  };
}

interface Payment {
  id: number;
  arizaRaqami: string;
  arizaDate: string;
  arizaTuri: string;
  summa: number;
  taminotTuri: string;
  taminotRaqami: string;
  taminotDate: string;
  arizaHolati: string;
  arizaHolatiColor: string;
  qarorRaqami: string;
  qarorDate: string;
  qarorMiqdori: string;
}

interface FilterCounts {
  jami: number;
  yangi: number;
  jarayonda: number;
  qabulQilingan: number;
  radEtilgan: number;
}

interface TaxPeriod {
  label: string;
  value: string;
  date: string;
}

@Component({
  selector: 'app-refundlist',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SkeletonModule,
    TooltipModule,
    Card,
    Dialog,
    FormsModule,
    Select,
    Textarea,
  ],
  templateUrl: './refundlist.html',
  styleUrl: './refundlist.scss',
  standalone: true
})
export class Refundlist implements OnInit{
  payments: Payment[] = [];
  loading: boolean = false;
  showTable: boolean = false;
  totalRecords: number = 0;
  currentFilter: string = 'all';
  allPaymentsData: Payment[] = [];
  selectedFile: File | null = null;

  filters: FilterCounts = {
    jami: 0,
    yangi: 0,
    jarayonda: 0,
    qabulQilingan: 0,
    radEtilgan: 0,
  };
  @ViewChild('applicationForm') applicationForm?: NgForm;

  visible: boolean = false;

  formData = {
    returnAmount: '',
    cardNumber: '',
    phoneNumber: '',
    mfo: '',
    bankName: '',
    accountNumber: '',
    uploadedFile: null as File | null,
    selectedTaxPeriod: null,
    selectedTaxPeriods: [] as TaxPeriod[],
    comment: ''
  };

  taxPeriods: TaxPeriod[] = [
    { label: '1701/0008 13.12.2025', value: '1', date: '13.12.2025' },
    { label: '1701/0008 13.12.2025', value: '2', date: '13.12.2025' },
    { label: '1701/0008 13.12.2025', value: '3', date: '13.12.2025' }
  ];

  dataTableInput: DataTableInput = {
    draw: 0,
    start: 0,
    length: 15,
    search: { value: '', regex: false },
    order: [{ column: 0, dir: 'asc' }],
    columns: [
      {
        data: 'id',
        name: 'id',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'arizaRaqami',
        name: 'arizaRaqami',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'arizaDate',
        name: 'arizaDate',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'arizaTuri',
        name: 'arizaTuri',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'summa',
        name: 'summa',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'taminotTuri',
        name: 'taminotTuri',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'taminotRaqami',
        name: 'taminotRaqami',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'taminotDate',
        name: 'taminotDate',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'arizaHolati',
        name: 'arizaHolati',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'qarorRaqami',
        name: 'qarorRaqami',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'qarorDate',
        name: 'qarorDate',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
      {
        data: 'qarorMiqdori',
        name: 'qarorMiqdori',
        searchable: true,
        orderable: true,
        search: { value: '', regex: false },
      },
    ],
  };

  constructor(private router: Router, private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {

  }

  loadTable() {
    this.showTable = true;
    this.loading = false;

    // Mock data ni generate qilish
    this.allPaymentsData = this.generateMockData();

    // Filter counts ni hisoblash
    this.calculateFilterCounts(this.allPaymentsData);

    // Initial yuklanish
    setTimeout(() => {
      this.loadPayments({
        first: 0,
        rows: 15,
      } as TableLazyLoadEvent);
    }, 100);
  }

  loadPayments(event: TableLazyLoadEvent) {
    this.loading = false;

    // Event dan kelgan ma'lumotlarni DataTableInput ga o'tkazish
    this.dataTableInput.start = event.first || 0;
    this.dataTableInput.length = event.rows || 15;
    this.dataTableInput.draw++;

    // Sorting
    if (event.sortField) {
      const columnIndex = this.dataTableInput.columns.findIndex(
        (col) => col.data === event.sortField
      );
      if (columnIndex !== -1) {
        this.dataTableInput.order = [
          {
            column: columnIndex,
            dir: event.sortOrder === 1 ? 'asc' : 'desc',
          },
        ];
      }
    }

    // Global search
    if (event.globalFilter) {
      this.dataTableInput.search.value = event.globalFilter.toString();
    }

    // Column filters
    if (event.filters) {
      Object.keys(event.filters).forEach((key) => {
        const columnIndex = this.dataTableInput.columns.findIndex((col) => col.data === key);
        if (columnIndex !== -1 && event.filters![key]) {
          const filterValue = event.filters![key];
          if (Array.isArray(filterValue) && filterValue.length > 0) {
            this.dataTableInput.columns[columnIndex].search.value = filterValue[0].value || '';
          }
        }
      });
    }

    // Console ga backend uchun tayyor ma'lumotni chiqarish
    console.log('=== BACKEND GA YUBORILAYOTGAN DataTableInput ===');
    console.log(JSON.stringify(this.dataTableInput, null, 2));
    console.log('================================================');

    // Backend so'rovini simulyatsiya qilish
    this.simulateBackendCall();
  }

  /**
   * Backend so'rovini simulyatsiya qilish
   */
  simulateBackendCall() {
    setTimeout(() => {

      let filteredData = [...this.allPaymentsData];

      if (this.currentFilter !== 'all') {
        const filterMap: { [key: string]: string } = {
          yangi: 'Yangi',
          jarayonda: 'Jarayonda',
          qabul: 'Qabul qilingan',
          rad: 'Rad etilgan',
        };

        const statusName = filterMap[this.currentFilter];
        if (statusName) {
          filteredData = filteredData.filter((p) => p.arizaHolati === statusName);
        }
      }

      if (this.dataTableInput.order.length > 0) {
        const order = this.dataTableInput.order[0];
        const columnData = this.dataTableInput.columns[order.column].data;

        filteredData.sort((a: any, b: any) => {
          const aVal = a[columnData];
          const bVal = b[columnData];

          if (aVal < bVal) return order.dir === 'asc' ? -1 : 1;
          if (aVal > bVal) return order.dir === 'asc' ? 1 : -1;
          return 0;
        });
      }

      const start = this.dataTableInput.start;
      const end = start + this.dataTableInput.length;
      this.payments = filteredData.slice(start, end);
      this.totalRecords = filteredData.length;

      this.loading = false;
    }, 300);
  }

  /**
   * Mock data generator
   */
  generateMockData(): Payment[] {
    const statuses = [
      { name: 'Yangi', color: 'blue' },
      { name: 'Jarayonda', color: 'yellow' },
      { name: 'Qabul qilingan', color: 'green' },
      { name: 'Rad etilgan', color: 'red' },
    ];

    const data: Payment[] = [];
    for (let i = 1; i <= 242; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      data.push({
        id: i,
        arizaRaqami: `1726/0000${i.toString().padStart(2, '0')}`,
        arizaDate: '02.07.2025',
        arizaTuri: "Bo'lib-bo'lib to'lash",
        summa: 100000000 + Math.floor(Math.random() * 50000000),
        taminotTuri: "sug'urta polisi",
        taminotRaqami: '1012025',
        taminotDate: '20.06.2025',
        arizaHolati: status.name,
        arizaHolatiColor: status.color,
        qarorRaqami: '1012025',
        qarorDate: '20.06.2025',
        qarorMiqdori: '---',
      });
    }
    return data;
  }

  calculateFilterCounts(data: Payment[]) {
    this.filters.jami = data.length;
    this.filters.yangi = data.filter((p) => p.arizaHolati === 'Yangi').length;
    this.filters.jarayonda = data.filter((p) => p.arizaHolati === 'Jarayonda').length;
    this.filters.qabulQilingan = data.filter((p) => p.arizaHolati === 'Qabul qilingan').length;
    this.filters.radEtilgan = data.filter((p) => p.arizaHolati === 'Rad etilgan').length;
  }

  /**
   * Status badge uchun CSS class
   */
  getStatusClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      red: 'bg-red-100 text-red-700 border-red-200',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200';
  }

  /**
   * Summani format qilish
   */
  formatNumber(value: number): string {
    return value.toLocaleString('uz-UZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  /**
   * Ortga qaytish
   */
  goBack() {
    this.location.back();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Yangi ariza yaratish
   */
  createNew() {
    this.router.navigate(['/services/devided/devidedform'], {
      queryParamsHandling: 'preserve',
    });
  }

  /**
   * Filtr qo'llash
   */
  applyFilter() {
    console.log("Filtr qo'llash dialog oching");
    // Bu yerda filter dialog ochiladi
  }

  /**
   * Ma'lumotlarni yuklash (Excel/CSV)
   */
  downloadData() {
    const exportData = this.payments.map((p) => ({
      'Ariza raqami': p.arizaRaqami,
      'Ariza sanasi': p.arizaDate,
      'Ariza turi': p.arizaTuri,
      Summa: this.formatNumber(p.summa),
      "Ta'minot turi": p.taminotTuri,
      "Ta'minot raqami": p.taminotRaqami,
      "Ta'minot sanasi": p.taminotDate,
      'Ariza holati': p.arizaHolati,
      'Qaror raqami': p.qarorRaqami,
      'Qaror sanasi': p.qarorDate,
      'Qaror miqdori': p.qarorMiqdori,
    }));

    console.log('Export data:', exportData);
    console.log(`${this.totalRecords} ta ma'lumot eksport qilindi`);

    // Bu yerda Excel/CSV export qilish logikasi
    alert(`${this.totalRecords} ta ma'lumot eksport qilindi. Console ni tekshiring.`);
  }

  /**
   * Status bo'yicha filter
   */
  filterByStatus(status: string) {
    this.currentFilter = status;

    // Table ni qayta yuklash
    this.loadPayments({
      first: 0,
      rows: this.dataTableInput.length,
    } as TableLazyLoadEvent);
  }


//   dialog form
  showDialog() {
    this.visible = true;
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.formData.uploadedFile = event.files[0];
    }
  }


  // File upload
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // this.showError('Fayl hajmi 10MB dan oshmasligi kerak!');
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Faqat PDF, DOC, DOCX, JPG, PNG fayllar qabul qilinadi!');
        return;
      }

      this.selectedFile = file;
      this.formData.uploadedFile = file;
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.formData.uploadedFile = null;
  }

  searchBank() {
    console.log('Bank qidirilmoqda, MFO:', this.formData.mfo);
    // Bank qidirish logikasi
  }

  createNewDocument(event: Event) {
    event.preventDefault();
    console.log('Yangi hujjat yaratilmoqda');
    // Yangi hujjat yaratish logikasi
  }

  submitForm() {
    if (this.applicationForm?.valid) {
      this.onSubmit();
    } else {
      // Barcha maydonlarni "touched" qilish
      Object.keys(this.applicationForm?.controls || {}).forEach(key => {
        this.applicationForm?.controls[key].markAsTouched();
      });
    }
  }

  onSubmit() {
    const dataToSend = {
      ...this.formData,
      fileName: this.formData.uploadedFile?.name || null
    };

    console.log('Backend ga yuborilayotgan ma\'lumotlar:', dataToSend);

    // API so'rovi
    // this.http.post('api/endpoint', dataToSend).subscribe(...)

    this.visible = false;
    this.resetForm();
  }

  resetForm() {
    this.applicationForm?.resetForm();
    this.formData = {
      returnAmount: '',
      cardNumber: '',
      phoneNumber: '',
      mfo: '',
      bankName: '',
      accountNumber: '',
      uploadedFile: null,
      selectedTaxPeriod: null,
      selectedTaxPeriods: [],
      comment: ''
    };
  }
}
