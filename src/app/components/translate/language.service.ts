import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'language';

  constructor(
    private translate: TranslateService,
  ) {
  }

  initLanguage(): void {
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY);
    const defaultLang = savedLanguage || 'uz';

    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);

    if (!savedLanguage) {
      localStorage.setItem(this.LANGUAGE_KEY, defaultLang);
    }
  }

  switchLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }

  getCurrentLanguage(): string {
    return localStorage.getItem(this.LANGUAGE_KEY) || 'uz';
  }
}

