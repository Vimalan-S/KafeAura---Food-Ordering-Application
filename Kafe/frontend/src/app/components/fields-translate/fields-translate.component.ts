import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fields-translate',
  templateUrl: './fields-translate.component.html',
  styleUrl: './fields-translate.component.css'
})
export class FieldsTranslateComponent {
  kValue: string = '';
  en: string = '';
  tam: string = '';
  kValues: any[] = [];
  isEditing: { [key: string]: boolean } = {}; // Track which row is in edit mode
  toastMessage: string | null = null; // Message to show in the toast
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
  currentYear: number = new Date().getFullYear();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(){
    this.fetchKValues();
  }

  fetchKValues(){
    this.http.get<any[]>('http://localhost:3000/kValues')
     .subscribe(data => {
        this.kValues = data;

        const kValueObj: any = {};
        for (const obj of this.kValues) { // Process data after fetching it
            kValueObj[obj.kValue] = { "en": obj.en, "tam": obj.tam };
        }

        // You can now use kValue for further logic, like saving it locally
        localStorage.setItem('kValueObj', JSON.stringify(kValueObj));
        });
  }

  addKValue() {
      const data = { kValue: this.kValue, en: this.en};

      this.http.post('http://localhost:3000/add-kvalue', data).subscribe({
          next: (res) => {
            this.showToast('K-Value added successfully!', 'success');
          },
          error: (err) => {
            console.log('Failed to add K-Value: ' + err.error.message);
            this.showToast('Failed to add K-Value', 'danger');
          }
      });
  }

  generateTranslations() {
    this.http.post('http://localhost:3000/generate-tamil-translations', {}).subscribe({
        next: (response: any) => {
            this.showToast('Tamil translations generated successfully!', 'success');
        },
        error: (err) => {
            console.log('Failed to generate translations: ' + err.error.message);
            this.showToast('Failed to generate translations', 'danger');
        }
    });
    }

    // Enable editing for a specific row
  enableEditing(kValue: string): void {
    this.isEditing[kValue] = true;
  }

  // Save the updated row data
  saveRow(row: any): void {
    const updatedRow = { ...row };
    this.http.put(`http://localhost:3000/kValues`, updatedRow).subscribe(() => {
      this.isEditing[row.kValue] = false; // Disable editing after save
      this.showToast('kValue updated successfully!', 'success');
    });
  }

  deleteRow(row: any): void {
    if (confirm(`Are you sure you want to delete kValue: ${row.kValue}?`)) {
      this.http.delete(`http://localhost:3000/kValues/${row.kValue}`).subscribe({
        next: () => {
          this.kValues = this.kValues.filter((r) => r.kValue !== row.kValue); // Remove the row from the local array
          this.showToast('kValue deleted successfully!', 'success');
        },
        error: (err) => {
          console.error('Error deleting kValue:', err);
          this.showToast('Failed to delete kValue.', 'danger');
        },
      });
    }
  }
  
  // Cancel editing for a specific row
  cancelEditing(kValue: string): void {
    this.isEditing[kValue] = false;
    this.fetchKValues(); // Re-fetch data to revert changes
  }

  goToAddDish() { 
    this.router.navigate(['/admin/add-dish']);
  }

  goToUpdateMenu() {
    this.router.navigate(['/admin/update-dish']);
  }

  viewPastOrders(){
    this.router.navigate(['/admin/past-orders']);
  }

  goToUploadKnowledgeFile(){
    this.router.navigate(['/admin/upload-knowledge-file']);
  }

  goToFieldsTranslate(){
    this.router.navigate(['/admin/fields-translate']);
  }

  goToCategory(category: string) {
    this.router.navigate([`/admin/add-dish/${category}`]);
  }

  // Show toast
  showToast(message: string, type: 'success' | 'danger') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.closeToast(), 3000); // Auto-close after 3 seconds
  }

  // Close toast
  closeToast() {
    this.toastMessage = null;
  }

}
