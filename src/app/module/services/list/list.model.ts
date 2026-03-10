import {SafeResourceUrl} from '@angular/platform-browser';

export interface ServicesListModel {
  name: string;
  comment: string;
  servicePayType: 'free' | 'pay';
  servicePeriod: number;
  servicePersonType: 'physically' | 'legal' | 'physically_and_legal';
}

export interface Service {
  title: string;
  desc: string;
  type: string;
  video: string;
  icon: string;
  button: string;
  safeEmbed?: SafeResourceUrl;
  expanded?: boolean;
}
