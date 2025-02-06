import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  pure: false // Marking the pipe as impure to handle dynamic changes
})
export class TranslatePipe implements PipeTransform {

  transform(kValue: string): string {
    if (!kValue) return '';

    // Fetch site language and kValueObj from localStorage
    const siteLanguage = localStorage.getItem('siteLanguage') || 'en'; // Default to English
    const kValueObj = JSON.parse(localStorage.getItem('kValueObj') || '{}');

    // Check if the kValue exists in the object
    if (kValueObj[kValue]) {
      return kValueObj[kValue][siteLanguage] || ''; // Return the translation for the chosen language
    }

    // If kValue is not found, return an empty string or a fallback
    return kValue;
  }
}
