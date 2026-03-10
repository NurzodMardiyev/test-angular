import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {PanelMenu} from 'primeng/panelmenu';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Divider} from 'primeng/divider';
import {PrimeTemplate} from 'primeng/api';
import {Ripple} from 'primeng/ripple';
import {Menues} from '../menues/menues';
import {Popover} from 'primeng/popover';
import {ThemeSwitcher} from '../../config/presets/themeswitcher';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../../config/language-switcher/language-switcher.component';
import {gsap} from 'gsap'
import {NgClass, NgOptimizedImage, NgStyle} from '@angular/common';
import {Card} from 'primeng/card';
import {Profile} from '../../component/profile/profile';

@Component({
  selector: 'app-desktop',
  imports: [
    Button,
    RouterOutlet,
    InputText,
    IconField,
    InputIcon,
    Divider,
    Menues,
    Popover,
    ThemeSwitcher,
    TranslatePipe,
    LanguageSwitcherComponent,
    NgClass,
    Card,
    Profile,
    NgStyle
  ],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
  standalone: true
})
export class Desktop implements AfterViewInit{
  @ViewChild('op') op!: Popover;
  @ViewChild('animated_box') box!: ElementRef;
  expanded = false;

  toggle(event: any) {
    this.op.toggle(event);
  }

  ngAfterViewInit(): void {
    gsap.from(this.box.nativeElement, {
      opacity: 0,
      y: 32,
      duration: 0.7,
      delay: 0.15,          // <<< ORQADAN KELADI
      ease: 'power3.out'
    });
  }


}
