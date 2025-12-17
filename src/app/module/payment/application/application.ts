// application.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Checkbox } from 'primeng/checkbox';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Region {
  name: string;
  code: string;
}

interface Bank {
  name: string;
  code: string;
}

interface BojxonaItem {
  imkoniyatTuri: string;
  tolovTuri: string;
  summasi: number | null;
  muddati: string;
  tugashSanasi: string;
  manbaTuri: string;
  huquqiyAsos: string;
}

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    RadioButtonModule,
    ButtonModule,
    Select,
    DatePicker,
    TableModule,
    Dialog,
    Checkbox,
    Toast,
  ],
  templateUrl: './application.html',
  styleUrl: './application.scss',
  providers: [MessageService],
})
export class Application implements OnInit {
  paymentForm!: FormGroup;
  paymentType: string = 'kechiktirib';
  selectedFile: File | null = null;
  tableData: BojxonaItem[] = [];
  showConfirmDialog: boolean = false;

  // Agreement checkboxes
  agreement1: boolean = false;
  agreement2: boolean = false;
  agreement3: boolean = false;
  agreementAll: boolean = false;

  // Current bojxona item being filled
  currentBojxona: BojxonaItem = {
    imkoniyatTuri: '',
    tolovTuri: '',
    summasi: null,
    muddati: '',
    tugashSanasi: '',
    manbaTuri: '',
    huquqiyAsos: '',
  };

  regions: Region[] = [
    { name: '1726 - Toshkent shahar', code: '1726' },
    { name: '1727 - Samarqand viloyati', code: '1727' },
    { name: '1728 - Buxoro viloyati', code: '1728' },
  ];

  banks: Bank[] = [
    { name: '00107 - "Акэабанк" АТБ', code: '00107' },
    { name: '00108 - "Ипотека банк" АТБ', code: '00108' },
    { name: '00109 - "Қишлоқ қурилиш банк" АТБ', code: '00109' },
  ];

  constructor(private fb: FormBuilder, private messageService: MessageService) {}

  // Toasts
  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: message });
  }

  showWarn(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Ogohlantirish', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Xatolik', detail: message });
  }

  // onInit
  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.paymentForm = this.fb.group({
      // UMUMIY MA'LUMOT
      hududiyBoshqarma: [null, Validators.required],
      arizachiNomi: ['', Validators.required],
      stir: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      telefonRaqami: ['', [Validators.required, Validators.pattern(/^\+?\d+$/)]],
      asosiyBankHisobraqami: ['', Validators.required],
      bankMFO: [null, Validators.required],

      // BOJXONA TO'LOVLARI
      taminotTuri: ['', Validators.required],
      taminotHujjatRaqami: ['', Validators.required],
      taminotHujjatSanasi: [null, Validators.required],
      taminotSummasi: [null, Validators.required],
      amalQilishMuddati: [null, Validators.required],

      // HUJJAT
      hujjatNomi: ['', Validators.required],
      hujjatRaqami: ['', Validators.required],
      hujjatSanasi: [null, Validators.required],
      hujjatFile: [null],
    });
  }

  // Tablega qo'shish
  addToTable() {
    // Validation
    if (
      !this.currentBojxona.tolovTuri ||
      !this.currentBojxona.summasi ||
      !this.currentBojxona.muddati ||
      !this.currentBojxona.tugashSanasi ||
      !this.currentBojxona.huquqiyAsos
    ) {
      this.showWarn("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    // Radio button dan imkoniyat turini olish
    const newItem: BojxonaItem = {
      imkoniyatTuri: this.paymentType === 'kechiktirib' ? 'Kechiktirish' : "Bo'lib-bo'lib to'lash",
      tolovTuri: this.currentBojxona.tolovTuri,
      summasi: this.currentBojxona.summasi,
      muddati: this.currentBojxona.muddati,
      tugashSanasi: this.formatDateToString(this.currentBojxona.tugashSanasi),
      manbaTuri: this.currentBojxona.manbaTuri,
      huquqiyAsos: this.currentBojxona.huquqiyAsos,
    };

    this.tableData.push(newItem);

    // Reset form
    this.currentBojxona = {
      imkoniyatTuri: '',
      tolovTuri: '',
      summasi: null,
      muddati: '',
      tugashSanasi: '',
      manbaTuri: '',
      huquqiyAsos: '',
    };

    console.log('Table data:', this.tableData);
  }

  // Tahrirlash
  editTableRow(index: number) {
    const item = this.tableData[index];
    this.currentBojxona = { ...item };
    this.tableData.splice(index, 1);
  }

  // O'chirish
  deleteTableRow(index: number) {
    if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
      this.tableData.splice(index, 1);
    }
  }

  // File upload
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.showError('Fayl hajmi 10MB dan oshmasligi kerak!');
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
      this.paymentForm.patchValue({
        hujjatFile: file,
      });
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.paymentForm.patchValue({
      hujjatFile: null,
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  // Number formatting
  formatNumber(value: number | null): string {
    if (!value) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Date formatting
  formatDateToString(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Open confirmation dialog
  openConfirmDialog() {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      this.showWarn("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    if (this.tableData.length === 0) {
      this.showWarn("Iltimos, kamida bitta bojxona to'lovini tablega qo'shing!");
      return;
    }

    // Reset agreements
    this.agreement1 = false;
    this.agreement2 = false;
    this.agreement3 = false;
    this.agreementAll = false;

    this.showConfirmDialog = true;
  }

  // Toggle all agreements
  toggleAllAgreements(event: any) {
    const checked = event.checked;
    this.agreement1 = checked;
    this.agreement2 = checked;
    this.agreement3 = checked;
  }

  // Check if all agreements are checked
  allAgreementsChecked(): boolean {
    const allChecked = this.agreement1 && this.agreement2 && this.agreement3;

    // Update agreementAll checkbox state
    if (allChecked && !this.agreementAll) {
      this.agreementAll = true;
    } else if (!allChecked && this.agreementAll) {
      this.agreementAll = false;
    }

    return allChecked;
  }

  // Form submission
  submitForm() {
    if (!this.allAgreementsChecked()) {
      this.showWarn('Iltimos, barcha rozilik checkboxlarini belgilang!');
      return;
    }

    const formValue = this.paymentForm.value;

    const finalData = {
      umumiyMalumot: {
        hududiyBoshqarma: formValue.hududiyBoshqarma?.name || '',
        hududiyBoshqarmaKodi: formValue.hududiyBoshqarma?.code || '',
        arizachiNomi: formValue.arizachiNomi,
        stir: formValue.stir,
        telefonRaqami: formValue.telefonRaqami,
        asosiyBankHisobraqami: formValue.asosiyBankHisobraqami,
        bankNomi: formValue.bankMFO?.name || '',
        bankMFO: formValue.bankMFO?.code || '',
      },
      bojxonaTolovlari: {
        tolovTuri: this.paymentType,
        taminotTuri: formValue.taminotTuri,
        taminotHujjatRaqami: formValue.taminotHujjatRaqami,
        taminotHujjatSanasi: this.formatDateToString(formValue.taminotHujjatSanasi),
        taminotSummasi: formValue.taminotSummasi,
        amalQilishMuddati: this.formatDateToString(formValue.amalQilishMuddati),
        bojxonaTolovlariRoyxati: this.tableData.map((item) => ({
          imkoniyatTuri: item.imkoniyatTuri,
          tolovTuri: item.tolovTuri,
          summasi: item.summasi,
          muddati: item.muddati,
          tugashSanasi: item.tugashSanasi,
          manbaTuri: item.manbaTuri,
          huquqiyAsos: item.huquqiyAsos,
        })),
      },
      hujjatlar: {
        hujjatNomi: formValue.hujjatNomi,
        hujjatRaqami: formValue.hujjatRaqami,
        hujjatSanasi: this.formatDateToString(formValue.hujjatSanasi),
        asosFayl: this.selectedFile
          ? {
              fileName: this.selectedFile.name,
              fileSize: this.selectedFile.size,
              fileType: this.selectedFile.type,
            }
          : null,
      },
      roziliklar: {
        rozilik1: this.agreement1,
        rozilik2: this.agreement2,
        rozilik3: this.agreement3,
        barcha: this.agreementAll,
      },
      yuborilganVaqt: new Date().toISOString(),
    };

    // backendga ketadigan json
    console.log(JSON.stringify(finalData, null, 2));

    this.showConfirmDialog = false;
    this.showSuccess('Ariza muvaffaqiyatli yuborildi!');
  }

  goBack() {
    window.history.back();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
