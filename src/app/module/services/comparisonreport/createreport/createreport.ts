import {ChangeDetectorRef, Component, OnInit, signal, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {CommonModule, DatePipe, Location} from "@angular/common";
import {Skeleton} from "primeng/skeleton";
import {TableModule} from "primeng/table";
import {DatePicker} from 'primeng/datepicker';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {firstValueFrom} from 'rxjs';
import {Services} from '../../../../service/services/services';
import {DialogService} from 'primeng/dynamicdialog';
import {Select} from 'primeng/select';
import {InputText} from 'primeng/inputtext';
import {Payment, ResponsiblePerson} from '../comparisonreport.model';
import {FormStateService} from '../../../../config/states/form-state.service';
import {MessageService} from 'primeng/api';
import {ReviseEnum} from '../../../../service/enums/ReviseStatus';

@Component({
  selector: 'app-createreport',
  standalone: true,
  imports: [
    Card,
    TableModule,
    DatePicker,
    FormsModule,
    ReactiveFormsModule,
    Button,
    Dialog,
    CommonModule,
    Skeleton,
    Select,
    InputText
  ],
  templateUrl: './createreport.html',
  styleUrl: './createreport.scss',
  providers: [DialogService, DatePipe]
})
export class Createreport implements OnInit {

  payments: Payment[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  tinLoading: boolean = false;
  displayDialog: boolean = false;
  startDate: Date = new Date(2025, 0, 1);
  endDate: Date = new Date(2025, 11, 15);

  rowData: any[] = [];

  // Totals
  totalTmzDebet: number = 0;
  totalTmzKredit: number = 0;
  totalBojxonaDebet: number = 0;
  totalBojxonaKredit: number = 0;

  saldoStart = {
    tmzDebet: 230698746.52,
    tmzKredit: 0,
    bojxonaDebet: 0,
    bojxonaKredit: 230698746.52
  };
  rowHeight: number | undefined;
  detailRowHeight: number | undefined;

  selectedRole = signal<'DIREKTOR' | 'BUXGALTER' | null>(null);
  name = signal('');
  isLocked = signal(false);

  reviseFormSubmit = false;
  reviseForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: Services,
    private location: Location,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private formStateService: FormStateService
  ) {
    this.reviseForm = this.formBuilder.group({
      status: [''],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      confPer: ['', Validators.required],
      confPerType: [this.selectedRole(), Validators.required]
    });

    this.formStateService.setForm(this.reviseForm);
    this.reviseForm.updateValueAndValidity();

  }

  ngOnInit() {
    this.loadData();
    this.rowHeight = 24;
    this.detailRowHeight = 300;
  }

  loadData() {
    this.loading = true;
    this.payments = [
      {
        id: 1, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000016',
        hujjatTuri: 'КТД', byudRaqami: '26010/03.01.2025/000016',
        tmzDebet: 0, tmzKredit: 11250000, bojxonaDebet: 11250000, bojxonaKredit: 0
      },
      {
        id: 2, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000016',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 937500, bojxonaKredit: 0
      },
      {
        id: 3, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000017',
        hujjatTuri: 'КТД', byudRaqami: '26010/03.01.2025/000017',
        tmzDebet: 0, tmzKredit: 5625000, bojxonaDebet: 5625000, bojxonaKredit: 0
      },
      {
        id: 4, sana: '04.01.2025', hujjatRaqami: '26010/04.01.2025/000018',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '26010/04.01.2025/000018',
        tmzDebet: 151162088.95, tmzKredit: 0, bojxonaDebet: 0, bojxonaKredit: 151162088.95
      },
      {
        id: 5, sana: '04.01.2025', hujjatRaqami: '26010/04.01.2025/000019',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 937500, bojxonaKredit: 0
      },
      {
        id: 6, sana: '05.01.2025', hujjatRaqami: '26010/05.01.2025/000020',
        hujjatTuri: 'КТД', byudRaqami: '26010/05.01.2025/000020',
        tmzDebet: 0, tmzKredit: 3000000, bojxonaDebet: 3000000, bojxonaKredit: 0
      },
      {
        id: 7, sana: '06.01.2025', hujjatRaqami: '26010/06.01.2025/000021',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 375000, bojxonaKredit: 0
      },
      {
        id: 8, sana: '07.01.2025', hujjatRaqami: '26010/07.01.2025/000022',
        hujjatTuri: 'КТД', byudRaqami: '26010/07.01.2025/000022',
        tmzDebet: 0, tmzKredit: 562500, bojxonaDebet: 562500, bojxonaKredit: 0
      },
      {
        id: 1, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000016',
        hujjatTuri: 'КТД', byudRaqami: '26010/03.01.2025/000016',
        tmzDebet: 0, tmzKredit: 11250000, bojxonaDebet: 11250000, bojxonaKredit: 0
      },
      {
        id: 2, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000016',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 937500, bojxonaKredit: 0
      },
      {
        id: 3, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000017',
        hujjatTuri: 'КТД', byudRaqami: '26010/03.01.2025/000017',
        tmzDebet: 0, tmzKredit: 5625000, bojxonaDebet: 5625000, bojxonaKredit: 0
      },
      {
        id: 4, sana: '04.01.2025', hujjatRaqami: '26010/04.01.2025/000018',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '26010/04.01.2025/000018',
        tmzDebet: 151162088.95, tmzKredit: 0, bojxonaDebet: 0, bojxonaKredit: 151162088.95
      },
      {
        id: 5, sana: '04.01.2025', hujjatRaqami: '26010/04.01.2025/000019',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 937500, bojxonaKredit: 0
      },
      {
        id: 6, sana: '05.01.2025', hujjatRaqami: '26010/05.01.2025/000020',
        hujjatTuri: 'КТД', byudRaqami: '26010/05.01.2025/000020',
        tmzDebet: 0, tmzKredit: 3000000, bojxonaDebet: 3000000, bojxonaKredit: 0
      },
      {
        id: 7, sana: '06.01.2025', hujjatRaqami: '26010/06.01.2025/000021',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 375000, bojxonaKredit: 0
      },
      {
        id: 8, sana: '07.01.2025', hujjatRaqami: '26010/07.01.2025/000022',
        hujjatTuri: 'КТД', byudRaqami: '26010/07.01.2025/000022',
        tmzDebet: 0, tmzKredit: 562500, bojxonaDebet: 562500, bojxonaKredit: 0
      },
      {
        id: 1, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000016',
        hujjatTuri: 'КТД', byudRaqami: '26010/03.01.2025/000016',
        tmzDebet: 0, tmzKredit: 11250000, bojxonaDebet: 11250000, bojxonaKredit: 0
      },
      {
        id: 2, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000016',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 937500, bojxonaKredit: 0
      },
      {
        id: 3, sana: '03.01.2025', hujjatRaqami: '26010/03.01.2025/000017',
        hujjatTuri: 'КТД', byudRaqami: '26010/03.01.2025/000017',
        tmzDebet: 0, tmzKredit: 5625000, bojxonaDebet: 5625000, bojxonaKredit: 0
      },
      {
        id: 4, sana: '04.01.2025', hujjatRaqami: '26010/04.01.2025/000018',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '26010/04.01.2025/000018',
        tmzDebet: 151162088.95, tmzKredit: 0, bojxonaDebet: 0, bojxonaKredit: 151162088.95
      },
      {
        id: 5, sana: '04.01.2025', hujjatRaqami: '26010/04.01.2025/000019',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 937500, bojxonaKredit: 0
      },
      {
        id: 6, sana: '05.01.2025', hujjatRaqami: '26010/05.01.2025/000020',
        hujjatTuri: 'КТД', byudRaqami: '26010/05.01.2025/000020',
        tmzDebet: 0, tmzKredit: 3000000, bojxonaDebet: 3000000, bojxonaKredit: 0
      },
      {
        id: 7, sana: '06.01.2025', hujjatRaqami: '26010/06.01.2025/000021',
        hujjatTuri: 'ГТДИМ ЭКД', byudRaqami: '',
        tmzDebet: 0, tmzKredit: 0, bojxonaDebet: 375000, bojxonaKredit: 0
      },
      {
        id: 8, sana: '07.01.2025', hujjatRaqami: '26010/07.01.2025/000022',
        hujjatTuri: 'КТД', byudRaqami: '26010/07.01.2025/000022',
        tmzDebet: 0, tmzKredit: 562500, bojxonaDebet: 562500, bojxonaKredit: 0
      }
    ];

    this.totalRecords = this.payments.length;
    this.prepareGridData();
    this.calculateTotals();
    this.loading = false;
  }
  prepareGridData() {
    this.rowData = this.payments.map((payment, index) => ({
      tr: index + 1,
      sana: payment.sana,
      hujjatRaqami: payment.hujjatRaqami,
      hujjatTuri: payment.hujjatTuri,
      byudRaqami: payment.byudRaqami,
      tmzDebet: payment.tmzDebet,
      tmzKredit: payment.tmzKredit,
      bojxonaDebet: payment.bojxonaDebet,
      bojxonaKredit: payment.bojxonaKredit,
    }));
  }
  calculateTotals() {
    this.totalTmzDebet = this.payments.reduce((sum, p) => sum + p.tmzDebet, 0);
    this.totalTmzKredit = this.payments.reduce((sum, p) => sum + p.tmzKredit, 0);
    this.totalBojxonaDebet = this.payments.reduce((sum, p) => sum + p.bojxonaDebet, 0);
    this.totalBojxonaKredit = this.payments.reduce((sum, p) => sum + p.bojxonaKredit, 0);
  }
  goBack() {
    this.location.back();
  }
  refreshData() {
    this.reviseForm.patchValue({
      fromDate: null,
      toDate: null
    });

    this.reviseForm.get('fromDate')?.markAsPristine();
    this.reviseForm.get('fromDate')?.markAsUntouched();
    this.reviseForm.get('toDate')?.markAsPristine();
    this.reviseForm.get('toDate')?.markAsUntouched();

    this.loadData();
  }

  minToDate: Date | null = null;
  onFromDateChange(date: Date) {
    this.minToDate = date;
    const toDateControl = this.reviseForm.get('toDate');
    if (toDateControl?.value && toDateControl.value < date) {
      toDateControl.reset();
    }
  }

  async showConfirmationDialog() {
    this.displayDialog = true;
  }
  async onSendReviseToAccept() {
    this.reviseFormSubmit = true;

    if (this.reviseForm.invalid || !this.name()) {

      this.reviseForm.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Maʼlumot yetarli emas',
        detail: 'TIN noto‘g‘ri yoki tasdiqlanmagan. Iltimos, tekshiring.',
        life: 3000
      });

      return;
    }

    try {
      const rawValue = this.reviseForm.value;

      const formData = {
        ...rawValue,
        status: ReviseEnum.ReviseStatus.YANGI,
        fromDate: this.datePipe.transform(rawValue.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(rawValue.toDate, 'yyyy-MM-dd'),
      };
      const response = await firstValueFrom(this.service.create(formData, "revise"));

      if (response && response.success) {
        this.reviseFormSubmit = false;
        this.cd.detectChanges();
        this.location.back();
      }
    } catch (e) {
      console.error('API xatolik:', e);
    } finally {
      this.reviseFormSubmit = false;
    }
  }

  formatNumber(value: number): string {
    if (!value && value !== 0) return '---';
    return value.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  formatDate(date: Date): string {
    return date.toLocaleDateString('ru-RU');
  }
  onExportExcel() {
    const ws_data = [
      ['SOLISHTIRMA DALOLATNOMA'],
      ['"TOSHKENT METALLURGIYA ZAVODI" MCHJ'],
      [`Davr: ${this.formatDate(this.startDate)} - ${this.formatDate(this.endDate)}`],
      [],
      ['Сальдо 01.01.2025 йил ҳолатига', '', '', '', '',
        this.saldoStart.tmzDebet, this.saldoStart.tmzKredit,
        this.saldoStart.bojxonaDebet, this.saldoStart.bojxonaKredit],
      [],
      ['T/r', 'Сана', 'Ҳужжат рақами', 'Ҳужжат тури', 'БЮД рақами',
        'TMZ Дебет', 'TMZ Кредит', 'Bojxona Дебет', 'Bojxona Кредит']
    ];

    this.payments.forEach((p, i) => {
      ws_data.push([
        i + 1, p.sana, p.hujjatRaqami, p.hujjatTuri, p.byudRaqami || '---',
        p.tmzDebet, p.tmzKredit, p.bojxonaDebet, p.bojxonaKredit
      ]);
    });

    ws_data.push([]);
    ws_data.push(['Жами', '', '', '', '',
      this.totalTmzDebet, this.totalTmzKredit,
      this.totalBojxonaDebet, this.totalBojxonaKredit]);

    // const ws = XLSX.utils.aoa_to_sheet(ws_data);
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Hisobot');
    // XLSX.writeFile(wb, `Dalolatnoma_${new Date().toLocaleDateString()}.xlsx`);
  }
  onExportPdf() {
    // const doc = new jsPDF('landscape');

    // doc.setFontSize(16);
    // doc.text('SOLISHTIRMA DALOLATNOMA', 148, 15, {align: 'center'});
    // doc.setFontSize(10);
    // doc.text('"TOSHKENT METALLURGIYA ZAVODI" MCHJ', 148, 22, {align: 'center'});

    // autoTable(doc, {
    //   head: [[
    //     'T/r', 'Сана', 'Ҳужжат рақами', 'Ҳужжат тури', 'БЮД рақами',
    //     'TMZ Дебет', 'TMZ Кредит', 'Bojxona Дебет', 'Bojxona Кредит'
    //   ]],
    //   body: this.payments.map((p, i) => [
    //     i + 1, p.sana, p.hujjatRaqami, p.hujjatTuri, p.byudRaqami || '---',
    //     this.formatNumber(p.tmzDebet), this.formatNumber(p.tmzKredit),
    //     this.formatNumber(p.bojxonaDebet), this.formatNumber(p.bojxonaKredit)
    //   ]),
    //   foot: [[
    //     'Жами', '', '', '', '',
    //     this.formatNumber(this.totalTmzDebet), this.formatNumber(this.totalTmzKredit),
    //     this.formatNumber(this.totalBojxonaDebet), this.formatNumber(this.totalBojxonaKredit)
    //   ]],
    //   startY: 30,
    //   styles: {fontSize: 7,},
    //   headStyles: {fillColor: [30, 64, 175], textColor: 255},
    //   footStyles: {fillColor: [200, 200, 200], fontStyle: 'bold'}
    // });
    //
    // doc.save(`Dalolatnoma_${new Date().toLocaleDateString()}.pdf`);
  }

  onRoleChange(role: any) {
    this.selectedRole.set(role.code);
  }

  isCheckDisabled(): boolean {
    const len = this.reviseForm.get('confPer')?.value.length;
    return !((len === 9 || len === 14) && this.selectedRole() !== null);
  }
  async searchTin() {
    if (this.isCheckDisabled() || this.tinLoading) return;
    const control = this.reviseForm.get('confPer');
    if (!control || !control.value || control.value.length < 9 || this.tinLoading) {
      control?.setErrors({ required: true });
      control?.markAsTouched();
      return;
    }

    this.tinLoading = true;
    this.cd.detectChanges();

    try {
      const response: any = await firstValueFrom(this.service.pintin_url(this.reviseForm.get('confPer')?.value));

      if (response && (response.fullName || response.name || response.fio || response.shortName)) {
        const displayName = response.fullName || response.name || response.fio || response.shortName;

        this.name.set(displayName);
        this.isLocked.set(true);
        control.setErrors(null);

        console.log('Forma yangilandi:', this.reviseForm.value);
      } else {
        this.name.set('');
        this.isLocked.set(false);
      }
    } catch (error) {
      console.error('Xatolik:', error);
      this.name.set('Namega ornatishda Xatolik yuz berdi');
    } finally {
      this.tinLoading = false;
      this.cd.detectChanges();
    }
  }
  unlockInput() {
    this.isLocked.set(false);
  }
}
