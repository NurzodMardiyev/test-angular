import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  NgZone,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {ChartModule} from 'primeng/chart';
import {isPlatformBrowser, NgClass, NgStyle} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  imports: [
    Card,
    Tag,
    TableModule,
    ChartModule,
    NgStyle,
    InputText,
    IconField,
    InputIcon,
    NgClass,
    Button
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy  {
  totalRequests = 105;
  basicData: any;
  basicOptions: any;
  platformId = inject(PLATFORM_ID);
  segments = [
    { value: 8,  color: '#2E65DD' },
    { value: 50, color: '#28B7FD' },
    { value: 38, color: '#22c55e' },
    { value: 4,  color: '#ef4444' }
  ];
  progress = [
    { value: 8,  colorTo: '#2E66DF', colorFrom: '#193779', icon: './assets/icons/yangi_murojaat_icon.svg', text: 'Yangi' },
    { value: 50, colorTo: '#28B7FD', colorFrom: '#186D97', icon: './assets/icons/jarayonda_murojaat_icon.svg', text: 'Jarayonda' },
    { value: 38, colorTo: '#4DD56F', colorFrom: '#286F3A', icon: './assets/icons/qabul_murojaat_icon.svg', text: 'Qabul qilingan' },
    { value: 4,  colorTo: '#F2553C', colorFrom: '#8C3123', icon: './assets/icons/radetilgan_murojaat_icon.svg', text: 'Rad etilgan' }
  ];
  data: any;
  dataPie: any;
  options: any;
  optionsPie: any;
  totalRecords: number = 1;
  expanded = false;
  @ViewChild('chart') chart: any;
  @ViewChild('chartPie') chartPie: any;

  private zone = inject(NgZone);
  private observer: MutationObserver | null = null;
  private checkInterval: any;
  private lastPrimaryColor: string = '';

  isTableExpanded = false; // Jadval holati uchun

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart();
    this.initChartPie();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Birinchi usul: MutationObserver (class o'zgarishi uchun)
      this.observer = new MutationObserver(() => {
        this.zone.run(() => {
          this.checkAndUpdateColors();
        });
      });

      this.observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style', 'data-p-theme', 'data-theme']
      });

      // Ikkinchi usul: setInterval (CSS variable o'zgarishini tekshirish)
      this.checkInterval = setInterval(() => {
        this.checkAndUpdateColors();
      }, 200); // Har 200ms da tekshiradi

      // Boshlang'ich rangni saqlash
      this.lastPrimaryColor = this.getThemeColors().primary;
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private checkAndUpdateColors() {
    const currentPrimary = this.getThemeColors().primary;

    // Agar rang o'zgargan bo'lsa, yangilash
    if (currentPrimary && currentPrimary !== this.lastPrimaryColor) {
      this.lastPrimaryColor = currentPrimary;
      this.updateChart();
    }
  }

  // Chart data
  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const { primary, textSecondary, surfaceBorder } = this.getThemeColors();

      this.basicData = {
        labels: [
          ['Kechiktirib yoki', 'bolib-bolib tolash'],
          ['Qaytarilgan', 'mablaglar'],
          ['Solishtirma', 'dalolatnoma'],
          ['Bosh', 'taʼminot'],
          ['Dastlabki', 'qaror']
        ],
        datasets: [
          {
            data: [540, 325, 702, 620, 532],
            backgroundColor: [primary, primary, primary, primary, primary],
            barPercentage: 0.5,
          },
        ],
      };

      this.basicOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: {
              color: textSecondary,
              maxRotation: 0,
              minRotation: 0,
              font: {
                size: 11
              },
              autoSkip: false
            },
            grid: {
              display: false,
              drawBorder: false
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              display: true,
              color: textSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            },
          },
        },
      };
      this.cd.markForCheck();
    }
  }

  initChartPie() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color').trim() ||
        documentStyle.getPropertyValue('--text-color').trim();
      const primary = documentStyle.getPropertyValue('--p-primary-color').trim();
      const orange = documentStyle.getPropertyValue('--p-orange-500').trim();
      const gray = documentStyle.getPropertyValue('--p-gray-500').trim();

      this.dataPie = {
        labels: ['Kechiktirib/bolib-bolib tolash', 'Qaytarilgan mablaglar', 'Depozit qoldiq'],
        datasets: [
          {
            data: [100000000, 50000000, 70000000],
            backgroundColor: [primary, orange, gray],
            hoverBackgroundColor: [
              this.adjustColorBrightness(primary, 10),
              this.adjustColorBrightness(orange, 10),
              this.adjustColorBrightness(gray, 10)
            ]
          }
        ]
      };

      this.optionsPie = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor
            }
          }
        }
      };
      this.cd.markForCheck();
    }
  }

  updateChart() {
    const { primary, textSecondary, surfaceBorder } = this.getThemeColors();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color').trim() ||
      documentStyle.getPropertyValue('--text-color').trim();
    const orange = documentStyle.getPropertyValue('--p-orange-500').trim();
    const gray = documentStyle.getPropertyValue('--p-gray-500').trim();

    // Bar Chart yangilash
    if (this.basicData) {
      this.basicData = {
        ...this.basicData,
        datasets: [
          {
            ...this.basicData.datasets[0],
            backgroundColor: [primary, primary, primary, primary, primary]
          }
        ]
      };

      this.basicOptions = {
        ...this.basicOptions,
        scales: {
          x: {
            ...this.basicOptions.scales.x,
            ticks: {
              ...this.basicOptions.scales.x.ticks,
              color: textSecondary
            }
          },
          y: {
            ...this.basicOptions.scales.y,
            ticks: {
              ...this.basicOptions.scales.y.ticks,
              color: textSecondary
            },
            grid: {
              ...this.basicOptions.scales.y.grid,
              color: surfaceBorder
            }
          }
        }
      };
    }

    // Pie Chart yangilash
    if (this.dataPie) {
      this.dataPie = {
        ...this.dataPie,
        datasets: [{
          ...this.dataPie.datasets[0],
          backgroundColor: [primary, orange, gray],
          hoverBackgroundColor: [
            this.adjustColorBrightness(primary, 10),
            this.adjustColorBrightness(orange, 10),
            this.adjustColorBrightness(gray, 10)
          ]
        }]
      };

      this.optionsPie = {
        ...this.optionsPie,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor
            }
          }
        }
      };
    }

    // Angular change detection
    this.cd.detectChanges();

    // Chart.js ni majburan yangilash
    setTimeout(() => {
      if (this.chart?.chart) {
        this.chart.chart.update('none');
      }
      if (this.chartPie?.chart) {
        this.chartPie.chart.update('none');
      }
    }, 50);
  }

  private getThemeColors() {
    if (!isPlatformBrowser(this.platformId)) {
      return { primary: '', textSecondary: '', surfaceBorder: '' };
    }

    const style = getComputedStyle(document.documentElement);
    return {
      primary: style.getPropertyValue('--p-primary-color').trim() || '#6366f1',
      textSecondary: style.getPropertyValue('--p-text-muted-color').trim() ||
        style.getPropertyValue('--text-color-secondary').trim() || '#6c757d',
      surfaceBorder: style.getPropertyValue('--p-content-border-color').trim() ||
        style.getPropertyValue('--surface-border').trim() || '#dee2e6',
    };
  }

  private adjustColorBrightness(color: string, percent: number): string {
    if (!color) return color;

    // Agar color RGB formatda bo'lsa
    if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (match) {
        let [r, g, b] = match.map(Number);
        r = Math.min(255, Math.max(0, r + percent));
        g = Math.min(255, Math.max(0, g + percent));
        b = Math.min(255, Math.max(0, b + percent));
        return `rgb(${r}, ${g}, ${b})`;
      }
    }
    // Agar HEX formatda bo'lsa
    if (color.startsWith('#')) {
      let hex = color.replace('#', '');
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);
      r = Math.min(255, Math.max(0, r + percent));
      g = Math.min(255, Math.max(0, g + percent));
      b = Math.min(255, Math.max(0, b + percent));
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  }

  // Table data
  tableData = [
    { number: "1726/000025", date: "02.07.2025", type: "Bo'lib-bo'lib to'lash", amount: "100 000 000", status: "Yangi", statusType: 'info', response: "---", responseDate: "---", executor: "---" },
    { number: "1726/000025", date: "02.07.2025", type: "Kechtiktirib to'lash", amount: "100 000 000", status: "Jarayonda", statusType: 'warning', response: "---", responseDate: "---", executor: "Ergashev Vosid Yoqubovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Bo'lib-bo'lib to'lash", amount: "100 000 000", status: "Rad etilgan", statusType: 'danger', response: "---", responseDate: "---", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Dastlabki qaror", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Boltiayev Iskandar Athamovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Bo'lib-bo'lib to'lash", amount: "100 000 000", status: "Yangi", statusType: 'info', response: "---", responseDate: "---", executor: "---" },
    { number: "1726/000025", date: "02.07.2025", type: "Kechtiktirib to'lash", amount: "100 000 000", status: "Jarayonda", statusType: 'warning', response: "---", responseDate: "---", executor: "Ergashev Vosid Yoqubovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Bo'lib-bo'lib to'lash", amount: "100 000 000", status: "Rad etilgan", statusType: 'danger', response: "---", responseDate: "---", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Dastlabki qaror", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Boltiayev Iskandar Athamovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Bo'lib-bo'lib to'lash", amount: "100 000 000", status: "Yangi", statusType: 'info', response: "---", responseDate: "---", executor: "---" },
    { number: "1726/000025", date: "02.07.2025", type: "Kechtiktirib to'lash", amount: "100 000 000", status: "Jarayonda", statusType: 'warning', response: "---", responseDate: "---", executor: "Ergashev Vosid Yoqubovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Bo'lib-bo'lib to'lash", amount: "100 000 000", status: "Rad etilgan", statusType: 'danger', response: "---", responseDate: "---", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Dastlabki qaror", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Boltiayev Iskandar Athamovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Bo'lib-bo'lib to'lash", amount: "100 000 000", status: "Yangi", statusType: 'info', response: "---", responseDate: "---", executor: "---" },
    { number: "1726/000025", date: "02.07.2025", type: "Kechtiktirib to'lash", amount: "100 000 000", status: "Jarayonda", statusType: 'warning', response: "---", responseDate: "---", executor: "Ergashev Vosid Yoqubovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Bo'lib-bo'lib to'lash", amount: "100 000 000", status: "Rad etilgan", statusType: 'danger', response: "---", responseDate: "---", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Dastlabki qaror", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Boltiayev Iskandar Athamovich" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" },
    { number: "1726/000025", date: "02.07.2025", type: "Pul qaytarish", amount: "100 000 000", status: "Qabul qilingan", statusType: 'success', response: "TN2500012/25", responseDate: "05/07/2025", executor: "Maxmudov Farhod Rustam o'g'li" }
  ];



  toggleTableExpand() {
    this.isTableExpanded = !this.isTableExpanded;
    if (this.isTableExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
}
