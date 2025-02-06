import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  selectedLanguage: string = 'en'; // Default to English
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
currentYear: number = new Date().getFullYear();
toastMessage: string | null = null; // Message to show in the toast

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['admin', Validators.required],
    });
  }

  ngOnInit(){
    // Load language from localStorage if available
    const savedLanguage = localStorage.getItem('siteLanguage');
    if (savedLanguage) {
        this.selectedLanguage = savedLanguage;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showToast('Please fill all fields correctly.', 'danger');
      return;
    }

    const loginData = this.loginForm.value;

    this.http.post('http://localhost:3000/login', loginData).subscribe(
      (response: any) => {
        if (response.success) {
          this.showToast('Login successful', 'success');
          
          if (response.role === 'admin') {
            this.router.navigate(['/admin/home']);
          } else if (response.role === 'customer') {
            this.router.navigate(['/customer/home']);
          }
        } else {
          this.showToast('Invalid Credentials', 'danger');
        }
      },
      (error) => {
        this.showToast('Login failed. Please try again.', 'danger');
      }
    );
  }

  changeLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;
    this.selectedLanguage = language;

    // Save the selected language to localStorage
    localStorage.setItem('siteLanguage', this.selectedLanguage);

    console.log(`Language changed to: ${this.selectedLanguage}`);
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
