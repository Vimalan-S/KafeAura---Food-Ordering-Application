import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-desserts',
  templateUrl: './desserts.component.html',
  styleUrl: './desserts.component.css'
})
export class DessertsComponent {
  dessertForm: FormGroup;
  dishCategory: string = 'dessert'; // Fixed as 'meal' for this component
  availableSlots = ['morning', 'afternoon', 'evening', 'night']; 
  toastMessage: string | null = null; // Message to show in the toast
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
  currentYear: number = new Date().getFullYear();
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute, private router: Router
  ) {
    this.dessertForm = this.fb.group({
      dishName: ['', Validators.required],
      dishCategory: [this.dishCategory, Validators.required],
      dishDescription: ['', Validators.required],
      preparationTime: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      currentlyAvailable: [1, Validators.required],
      availableSlot: this.fb.array([], Validators.required), 
      images: this.fb.array([this.fb.control('')])
    });
  }

  get images() {
    return this.dessertForm.get('images') as any;
  }

  addImageField() {
    this.images.push(this.fb.control(''));
  }

  submitForm() {
    if (this.dessertForm.valid) {
      const formData = this.dessertForm.value;

      // Convert availableSlot array to a JSON array of selected slots
      formData.availableSlot = this.availableSlots.filter((slot, index) => formData.availableSlot[index]);
      
      this.http.post('http://localhost:3000/admin/add-dish/desserts', formData)
        .subscribe({
          next: (response) => {
            var dishName = formData.dishName;
            dishName = dishName.replaceAll(" ", "");
            dishName = 'k' + dishName;
            
            var data = { kValue: dishName, en: formData.dishName};
            
            this.http.post('http://localhost:3000/add-kvalue', data).subscribe({
              //   next: (res) => alert('K-Value added successfully!'),
              error: (err) => {
                console.log('Failed to add K-Value: ' + err.error.message);
                this.showToast('Failed to add K-Value', 'danger');
              }
            });
            
            var dishDescription = dishName.replaceAll(" ", "") + 'Description';
            data = { kValue: dishDescription, en: formData.dishDescription};
            
            this.http.post('http://localhost:3000/add-kvalue', data).subscribe({
              //   next: (res) => alert('K-Value added successfully!'),
              error: (err) => {
                console.log('Failed to add K-Value: ' + err.error.message);
                this.showToast('Failed to add K-Value', 'danger');
              }
            });
            
            this.showToast('Dish details and its KValues added successfully', 'success');
            this.dessertForm.reset();
          },
          error: (error) => {
            console.error('Error adding dish', error);
            this.showToast('Failed to add dish', 'danger');
          }
        });
    }
  }

  ngOnInit() {
    this.initializeAvailableSlots();
  }

  // Initialize the available slots as unchecked
  private initializeAvailableSlots() {
    const slotControls = this.availableSlots.map(() => this.fb.control(false));  // Map to an array of FormControls
    const availableSlotFormArray = this.fb.array(slotControls);
    this.dessertForm.setControl('availableSlot', availableSlotFormArray);
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
