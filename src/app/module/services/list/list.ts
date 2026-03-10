import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {Dialog} from "primeng/dialog";
import {SelectButton} from "primeng/selectbutton";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Service} from './list.model';


@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
    SelectButton,
    Button,
    Dialog,
    FormsModule,
    Card,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List implements OnInit{
  layout: string = 'grid';
  options: string[] = ['grid', 'list'];
  activeFilter = 'all';
  videoDialogVisible = false;
  selectedVideoUrl: SafeResourceUrl | null = null;
  selectedVideoTitle = '';

  services: Service[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeServices();
    this.loadServicesFromAPI();
  }

  private initializeServices() {
    this.services = this.services.map(service => ({
      ...service,
      safeEmbed: this.getEmbedUrl(service.video),
      isExpanded: false
    }));
  }

  private loadServicesFromAPI() {
    this.getServicesLists().then((data) => {
      if (data && data.length > 0) {
        this.services = data.map((item: any) => ({
          title: item.title || item.name,
          desc: item.desc || item.description,
          type: item.type || 'free',
          video: item.video || '',
          icon: item.icon || 'assets/icons/default.svg',
          button: item.button || 'detail',
          safeEmbed: this.getEmbedUrl(item.video || ''),
          isExpanded: false
        }));
      }
    }).catch(err => {
      console.error('Error loading services:', err);
    });
  }


  getServicesLists() {
    return Promise.resolve(this.getServicesFirst());
  }

  getServicesFirst() {
    return this.services = [
      {
        title: "kechiktirib/Boʻlib-Boʻlib toʻlash",
        desc: "TIF subyektlari bojxona toʻlovlarini maʻlum muddatlarga boʻlib yoki kechiktirib loremasdfhjsfdjha toʻlash imkoniyatiga ega boʻladilar",
        type: "paid",
        video: "https://www.youtube.com/watch?v=o8PhyYAH1Vc",
        icon: "M10.032 32.0513C7.15369 31.2371 4.90633 29.6922 3.28994 27.4167C1.67355 25.1411 0.865356 22.6689 0.865356 20C0.865356 17.3311 1.67355 14.8589 3.28994 12.5833C4.90633 10.3078 7.15369 8.76292 10.032 7.94875V10.5833C8.0598 11.25 6.45563 12.4444 5.21952 14.1667C3.98341 15.8889 3.36536 17.8333 3.36536 20C3.36536 22.1667 3.98341 24.1111 5.21952 25.8333C6.45563 27.5556 8.0598 28.75 10.032 29.4167V32.0513ZM23.3654 32.5C19.8954 32.5 16.9445 31.2842 14.5129 28.8525C12.0812 26.4208 10.8654 23.47 10.8654 20C10.8654 16.53 12.0812 13.5792 14.5129 11.1475C16.9445 8.71583 19.8954 7.5 23.3654 7.5C25.0384 7.5 26.6191 7.80986 28.1074 8.42958C29.5955 9.04931 30.9133 9.91153 32.0608 11.0163L30.3045 12.7725C29.3984 11.8986 28.3573 11.2181 27.1812 10.7308C26.0048 10.2436 24.7329 10 23.3654 10C20.5876 10 18.2265 10.9722 16.282 12.9167C14.3376 14.8611 13.3654 17.2222 13.3654 20C13.3654 22.7778 14.3376 25.1389 16.282 27.0833C18.2265 29.0278 20.5876 30 23.3654 30C24.7329 30 26.0048 29.7564 27.1812 29.2692C28.3573 28.7819 29.3984 28.1014 30.3045 27.2275L32.0608 28.9837C30.9133 30.0885 29.5955 30.9507 28.1074 31.5704C26.6191 32.1901 25.0384 32.5 23.3654 32.5ZM33.0449 26.0896L31.2883 24.3333L34.3716 21.25H21.7949V18.75H34.3716L31.2883 15.6667L33.0449 13.9104L39.1345 20L33.0449 26.0896Z",
        button: "devided",
        expanded: false,
      },
      {
        title: "Pul mablag‘larini qaytarish",
        desc: "TIF subyektlariga bojxona organlarida mavjud qoldiq pul mablagʻlarini oʻz hisobraqamlariga qaytarish xizmati",
        type: "free",
        video: "https://www.youtube.com/watch?v=o8PhyYAH1Vc",
        icon: "M7.21165 32.7886V30.2886H12.0833L10.8716 29.1286C9.5022 27.8614 8.52845 26.443 7.9504 24.8736C7.37234 23.3041 7.08331 21.7182 7.08331 20.1157C7.08331 17.2354 7.92678 14.6526 9.61373 12.3673C11.3007 10.0821 13.5128 8.51316 16.25 7.66066V10.2952C14.2391 11.0814 12.6254 12.3693 11.4087 14.159C10.1918 15.9484 9.58331 17.934 9.58331 20.1157C9.58331 21.419 9.83012 22.685 10.3237 23.9136C10.8173 25.1422 11.5855 26.2779 12.6283 27.3207L13.6858 28.3786V23.8144H16.1858V32.7886H7.21165ZM23.75 32.3398V29.7052C25.7608 28.9191 27.3746 27.6312 28.5912 25.8415C29.8082 24.0521 30.4166 22.0665 30.4166 19.8848C30.4166 18.5815 30.1698 17.3155 29.6762 16.0869C29.1826 14.8583 28.4144 13.7226 27.3716 12.6798L26.3141 11.6219V16.1861H23.8141V7.21191H32.7883V9.71191H27.9166L29.1283 10.8719C30.4466 12.1905 31.4076 13.6216 32.0112 15.1652C32.6148 16.7091 32.9166 18.2823 32.9166 19.8848C32.9166 22.7651 32.0732 25.3479 30.3862 27.6332C28.6993 29.9184 26.4872 31.4873 23.75 32.3398Z",
        button: "refund",
        expanded: false,
      },
      {
        title: "SOLISHTIRMA DALOLATNOMA",
        desc: "Qoldiq summalarga aniqlik kiritish xizmati",
        type: "paid",
        video: "https://www.youtube.com/watch?v=o8PhyYAH1Vc",
        icon: "M17.5 37.6918V34.1664H8.84626C8.00432 34.1664 7.29168 33.8747 6.70834 33.2914C6.12501 32.708 5.83334 31.9954 5.83334 31.1535V8.84595C5.83334 8.00401 6.12501 7.29137 6.70834 6.70803C7.29168 6.1247 8.00432 5.83303 8.84626 5.83303H17.5V2.30762H20V37.6918H17.5ZM8.84626 31.6664H17.5V27.4997H12.0833V24.9997H17.5V21.2497H12.0833V18.7497H17.5V14.9997H12.0833V12.4997H17.5V8.33303H8.84626C8.71793 8.33303 8.60043 8.3865 8.49376 8.49345C8.38682 8.60012 8.33334 8.71762 8.33334 8.84595V31.1535C8.33334 31.2818 8.38682 31.3993 8.49376 31.506C8.60043 31.6129 8.71793 31.6664 8.84626 31.6664ZM23.4938 8.33303V5.83303H31.3142C32.1561 5.83303 32.8688 6.1247 33.4521 6.70803C34.0351 7.29137 34.3267 8.00401 34.3267 8.84595V31.1535C34.3267 31.9954 34.0351 32.708 33.4521 33.2914C32.8688 33.8747 32.1561 34.1664 31.3142 34.1664H23.4938V31.6664H31.3142C31.4422 31.6664 31.5597 31.6129 31.6667 31.506C31.7736 31.3993 31.8271 31.2818 31.8271 31.1535V8.84595C31.8271 8.71762 31.7736 8.60012 31.6667 8.49345C31.5597 8.3865 31.4422 8.33303 31.3142 8.33303H23.4938ZM23.4938 21.2497V18.7497H28.9104V21.2497H23.4938ZM23.4938 14.9997V12.4997H28.9104V14.9997H23.4938Z",
        button: "comparisonreport",
        expanded: false,
      },
      {
        title: "BOSH TAʼMINOT",
        desc: "To‘lovchi bir nechta bojxona operatsiyalari bo‘yicha yuzaga keladigan bojxona to‘lovlarini bank kafolati, sug‘urta yoki tovar",
        type: "paid",
        video: "https://www.youtube.com/watch?v=o8PhyYAH1Vc",
        icon: "M20.5129 35.8337C19.6709 35.8337 18.9583 35.542 18.375 34.9587C17.7916 34.3753 17.5 33.6627 17.5 32.8207V20.5132C17.5 19.6713 17.7916 18.9587 18.375 18.3753C18.9583 17.792 19.6709 17.5003 20.5129 17.5003H32.8204C33.6623 17.5003 34.375 17.792 34.9583 18.3753C35.5416 18.9587 35.8333 19.6713 35.8333 20.5132V32.8207C35.8333 33.6627 35.5416 34.3753 34.9583 34.9587C34.375 35.542 33.6623 35.8337 32.8204 35.8337H20.5129ZM20.5129 33.3337H32.8204C32.9487 33.3337 33.0662 33.2802 33.1729 33.1732C33.2798 33.0666 33.3333 32.9491 33.3333 32.8207V20.5132C33.3333 20.3849 33.2798 20.2674 33.1729 20.1607C33.0662 20.0538 32.9487 20.0003 32.8204 20.0003H20.5129C20.3845 20.0003 20.267 20.0538 20.1604 20.1607C20.0534 20.2674 20 20.3849 20 20.5132V32.8207C20 32.9491 20.0534 33.0666 20.1604 33.1732C20.267 33.2802 20.3845 33.3337 20.5129 33.3337ZM10.8333 29.3591V13.8466C10.8333 13.0046 11.125 12.292 11.7083 11.7087C12.2916 11.1253 13.0043 10.8337 13.8462 10.8337H29.3587V13.3337H13.8462C13.7179 13.3337 13.6004 13.3871 13.4937 13.4941C13.3868 13.6007 13.3333 13.7182 13.3333 13.8466V29.3591H10.8333ZM4.16663 22.6924V7.17991C4.16663 6.33796 4.45829 5.62533 5.04163 5.04199C5.62496 4.45866 6.3376 4.16699 7.17954 4.16699H22.692V6.66699H7.17954C7.05121 6.66699 6.93371 6.72046 6.82704 6.82741C6.7201 6.93407 6.66663 7.05158 6.66663 7.17991V22.6924H4.16663Z",
        button: "comparisonreport",
        expanded: false,
      },
      {
        title: "DASTLABKI QAROR",
        desc: "TIF ishtirokchilari tomonidan olib kelinadigan tovarlarga nisbatan imtiyoz qoʻllanilishini aniqlovchi hujjat TIF subyektlariga bojxona organlarida mavjud qoldiq pul mablagʻlarini oʻz hisobraqamlariga qaytarish xizmati",
        type: "paid",
        video: "https://www.youtube.com/watch?v=o8PhyYAH1Vc",
        icon: "M12.0212 27.9334H22.7583V25.8393H12.0212V27.9334ZM12.0212 21.0468H27.9787V18.9526H12.0212V21.0468ZM12.0212 14.1601H27.9787V12.0659H12.0212V14.1601ZM8.4404 34.1663C7.72401 34.1663 7.1104 33.9109 6.59956 33.4001C6.08873 32.8893 5.83331 32.2756 5.83331 31.5593V8.44009C5.83331 7.7237 6.08873 7.11009 6.59956 6.59926C7.1104 6.08843 7.72401 5.83301 8.4404 5.83301H31.5596C32.276 5.83301 32.8896 6.08843 33.4004 6.59926C33.9112 7.11009 34.1666 7.7237 34.1666 8.44009V31.5593C34.1666 32.2756 33.9112 32.8893 33.4004 33.4001C32.8896 33.9109 32.276 34.1663 31.5596 34.1663H8.4404ZM8.4404 32.0722H31.5596C31.6879 32.0722 31.8055 32.0188 31.9125 31.9122C32.0191 31.8052 32.0725 31.6876 32.0725 31.5593V8.44009C32.0725 8.31176 32.0191 8.19412 31.9125 8.08717C31.8055 7.98051 31.6879 7.92718 31.5596 7.92718H8.4404C8.31206 7.92718 8.19442 7.98051 8.08748 8.08717C7.98081 8.19412 7.92748 8.31176 7.92748 8.44009V31.5593C7.92748 31.6876 7.98081 31.8052 8.08748 31.9122C8.19442 32.0188 8.31206 32.0722 8.4404 32.0722Z",
        button: "comparisonreport",
        expanded: false,
      }

    ];
  }

  openVideoDialog(service: Service, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedVideoUrl = service.safeEmbed || null;
    this.selectedVideoTitle = service.title;
    this.videoDialogVisible = true;
  }

  protected extractVideoId(url: string): string {
    if (!url) return '';

    const watchMatch = url.match(/v=([^&]+)/);
    if (watchMatch) return watchMatch[1];

    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) return shortMatch[1];

    const embedMatch = url.match(/embed\/([^?]+)/);
    if (embedMatch) return embedMatch[1];

    return '';
  }

  private getEmbedUrl(url: string): SafeResourceUrl {
    const id = this.extractVideoId(url);
    const embedUrl = id ? `https://www.youtube.com/embed/${id}` : '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  goToSplit(button: string) {
    this.router.navigate([`services/${button}`]);
  }

  toggleDescription(s: any) {
    s.expanded = !s.expanded;
  }
}
