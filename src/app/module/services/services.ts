import {Component, OnInit} from '@angular/core';
import {NgFor} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';

interface ServiceItem {
  title: string;
  desc: string;
  type: string;
  video: string;
  icon: string;
  id?: string;
  embed?: string;
  safeEmbed?: any;
  thumbnail?: string;
  isExpanded?: boolean;
  button?: any;
}

@Component({
  selector: 'app-services',
  imports: [NgFor],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  standalone: true
})
export class Services implements OnInit {
  // constructor(private router: Router) {}

  constructor(private sanitizer: DomSanitizer, private router: Router ) {}

  activeFilter = 'all';

  services: ServiceItem[] = [
    {
      title: "kechiktirib/Boʻlib-Boʻlib toʻlash",
      desc: "TIF subyektlari bojxona toʻlovlarini maʻlum muddatlarga boʻlib yoki kechiktirib loremasdfhjsfdjha toʻlash imkoniyatiga ega boʻladilar",
      type: "paid",
      video: "https://www.youtube.com/watch?v=o8PhyYAH1Vc",
      icon: "assets/icons/refund.svg",
      button:"devided"
    },
    {
      title: "Pul mablag‘larini qaytarish",
      desc: "TIF subyektlariga bojxona organlarida mavjud qoldiq pul mablagʻlarini oʻz hisobraqamlariga qaytarish xizmati",
      type: "free",
      video: "https://www.youtube.com/watch?v=o8PhyYAH1Vc",
      icon: "assets/icons/refund.svg",
      button:"return"
    },
    {
      title: "SOLISHTIRMA DALOLATNOMA",
      desc: "Qoldiq summalarga aniqlik kiritish xizmati",
      type: "paid",
      video: "https://www.youtube.com/watch?v=o8PhyYAH1Vc",
      icon: "assets/icons/report.svg",
      button:"akt"
    }
  ];

  ngOnInit() {
    this.services = this.services.map(s => ({
      ...s,
      isExpanded: false,
      id: Services.extractVideoId(s.video),
      embed: Services.toEmbedUrl(s.video),
      safeEmbed: this.sanitizer.bypassSecurityTrustResourceUrl(
        Services.toEmbedUrl(s.video)
      ),
      thumbnail: Services.getThumbnail(s.video)
    }));
  }

  toggleDesc(s: ServiceItem) {
    s.isExpanded = !s.isExpanded;
  }

  // -------------------
  // STATIC UTIL METHODS
  // -------------------

  private static extractVideoId(url: string): string {
    const watch = url.match(/v=([^&]+)/);
    if (watch) return watch[1];

    const short = url.match(/youtu\.be\/([^?]+)/);
    if (short) return short[1];

    const embed = url.match(/embed\/([^?]+)/);
    if (embed) return embed[1];

    return "";
  }

  private static toEmbedUrl(url: string): string {
    const id = Services.extractVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}` : "";
  }

  private static getThumbnail(url: string): string {
    const id = Services.extractVideoId(url);
    return id
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : "assets/no-thumb.png";
  }


  // -------------------
  // FILTERS
  // -------------------

  get freeCount() {
    return this.services.filter(s => s.type === 'free').length;
  }

  get paidCount() {
    return this.services.filter(s => s.type === 'paid').length;
  }

  get filteredServices() {
    if (this.activeFilter === 'free') return this.services.filter(s => s.type === 'free');
    if (this.activeFilter === 'paid') return this.services.filter(s => s.type === 'paid');
    return this.services;
  }

  setFilter(f: string) {
    this.activeFilter = f;
  }

  goToSplit(button: any) {
    this.router.navigate(['services/devided'], {
      queryParams: { button }
    });
  }

}

