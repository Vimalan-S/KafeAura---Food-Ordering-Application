import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isAdmin: boolean = true; // Default to admin
  selectedLanguage: string = 'en'; // Default to English
  toastMessage: string | null = null; // Message to show in the toast
toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
currentYear: number = new Date().getFullYear();

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // Define the form with validators
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      role: ['admin', Validators.required],
      floorNumber: [''],
      cabinNumber: ['']
    });

    // Listen for changes in the role selection
    this.registerForm.get('role')?.valueChanges.subscribe(value => {
      this.isAdmin = value === 'admin';
      if (this.isAdmin) {
        // Remove validators for customer-specific fields
        this.registerForm.get('floorNumber')?.clearValidators();
        this.registerForm.get('cabinNumber')?.clearValidators();
      } else {
        // Add validators for customer-specific fields
        this.registerForm.get('floorNumber')?.setValidators([Validators.required]);
        this.registerForm.get('cabinNumber')?.setValidators([Validators.required]);
      }
      this.registerForm.get('floorNumber')?.updateValueAndValidity();
      this.registerForm.get('cabinNumber')?.updateValueAndValidity();
    });
  }

  ngOnInit(){
    // Load language from localStorage if available
    const savedLanguage = localStorage.getItem('siteLanguage');
    if (savedLanguage) {
        this.selectedLanguage = savedLanguage;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
  
      // Simulate API call
      this.http.post('http://localhost:3000/register', formData).subscribe(
        (response) => {
          this.showToast('Registration successful!', 'success');
          this.registerForm.reset();
          this.router.navigate(['/login']); // Redirect to /login
        },
        (error) => {
          this.showToast('Registration failed. Please try again.', 'danger');
        }
      );
    }
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
