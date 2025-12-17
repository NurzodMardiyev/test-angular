import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ChartModule} from 'primeng/chart';
import {InputTextModule} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ChartModule,
    InputTextModule,
    PaginatorModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  totalRequests = 105;

  // Status card statistics
  statusStats = [
    { label: 'Yangi', value: 24, color: '#4ea5ff', icon: 'pi pi-plus' },
    { label: 'Jarayonda', value: 36, color: '#13c6b3', icon: 'pi pi-sync' },
    { label: 'Qabul qilingan', value: 28, color: '#5ec64d', icon: 'pi pi-check' },
    { label: 'Rad etilgan', value: 17, color: '#ff6b6b', icon: 'pi pi-times' }
  ];

  // Chart data
  chartData = {
    labels: [
      'Kechtiktirib yoo‘ lob-li-bo‘lib to‘lash',
      'Qaytarilgan mablag‘lar',
      'Solishtirma dalolatnoma',
      'Bosh ta minot',
      'Dastlabki qaror'
    ],
    datasets: [
      {
        label: 'Murojaatlar',
        data: [50, 30, 80, 40, 55],
        backgroundColor: '#4ea5ff'
      }
    ]
  };

  chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  // Financial block
  financeInfo = [
    { name: "Kechtiktirib bo‘lib-bo‘lib to‘lash", amount: 100000000, color: 'text-red-500' },
    { name: "Qaytarilgan mablag‘lar", amount: 50000000, color: 'text-green-500' },
    { name: "Depozit qoldiq", amount: 70000000, color: 'text-blue-500' },
  ];

  // Table data
  tableData = [
    { number: "1726/000025", date: "02.07.2025", type: "Bo‘lib-bo‘lib to‘lash", amount: "100 000 000", status: "Yangi", statusType: 'info', response: "---", responseDate: "---", executor: "---" },
    { number: "1726/000025", date: "02.07.2025", type: "Kechtiktirib to‘lash", amount: "100 000 000", status: "Jarayonda", statusType: 'warning', response: "---", responseDate: "---", executor: "Ergashev Vosid Yoqubovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Bo‘lib-bo‘lib to‘lash", amount: "100 000 000", status: "Rad etilgan", statusType: 'danger', response: "---", responseDate: "---", executor: "Maxmudov Farhod Rustam o‘g‘li" },
    { number: "1726/000025", date: "02.07.2025", type: "Dastlabki qaror", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Boltiayev Iskandar Athamovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o‘g‘li" }
  ];

  searchText = '';
}
