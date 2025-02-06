import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-knowledge-file',
  templateUrl: './upload-knowledge-file.component.html',
  styleUrl: './upload-knowledge-file.component.css'
})
export class UploadKnowledgeFileComponent {
  file: File | null = null;
  toastMessage: string | null = null; // Message to show in the toast
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
  currentYear: number = new Date().getFullYear();
  
  constructor(private http: HttpClient, private router: Router){

  }
  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }

  onUpload() {
    if (!this.file) return;

    const formData = new FormData();
    formData.append('file', this.file);

    this.http.post('http://localhost:3000/upload', formData).subscribe(
      (response) => {
        this.showToast('File uploaded and processed successfully', 'success');
      },
      (error) => {
        console.error('Upload error:', error);
        this.showToast('Failed to upload file', 'danger');
      }
    );
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
}
