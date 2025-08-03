import type { Language, Translations } from './languages';
import { translations } from './languages';

class I18nManager {
  private currentLanguage: Language = 'en';
  private listeners: (() => void)[] = [];

  constructor() {
    // Load saved language from localStorage or detect browser language
    this.loadSavedLanguage();
  }

  private loadSavedLanguage(): void {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.slice(0, 2) as Language;
      if (translations[browserLang]) {
        this.currentLanguage = browserLang;
      }
    }
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  public setLanguage(language: Language): void {
    if (translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('preferred-language', language);
      this.notifyListeners();
    }
  }

  public getTranslations(): Translations {
    return translations[this.currentLanguage];
  }

  public translate(key: string): string {
    const keys = key.split('.');
    let value: any = this.getTranslations();
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  public addLanguageChangeListener(callback: () => void): void {
    this.listeners.push(callback);
  }

  public removeLanguageChangeListener(callback: () => void): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  public getAvailableLanguages(): { code: Language; name: string }[] {
    const t = this.getTranslations();
    return [
      { code: 'en', name: t.languages.en },
      { code: 'fr', name: t.languages.fr },
      { code: 'es', name: t.languages.es }
    ];
  }
}

// Create singleton instance
export const i18n = new I18nManager();

// Helper function for easy translation access
export const t = (key: string): string => i18n.translate(key);

// Export types for convenience
export type { Language, Translations } from './languages';
