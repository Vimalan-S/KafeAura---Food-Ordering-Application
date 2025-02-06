import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beverages',
  templateUrl: './beverages.component.html',
  styleUrl: './beverages.component.css'
})
export class BeveragesComponent {
  beverageForm: FormGroup;
  dishCategory: string = 'beverages'; // Fixed as 'meal' for this component
  availableSlots = ['morning', 'afternoon', 'evening', 'night'];  // Available slot options
  toastMessage: string | null = null; // Message to show in the toast
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute, private router: Router
  ) {
    this.beverageForm = this.fb.group({
      dishName: ['', Validators.required],
      dishCategory: [this.dishCategory, Validators.required],
      dishDescription: ['', Validators.required],
      preparationTime: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      currentlyAvailable: [1, Validators.required],
      availableSlot: this.fb.array([], Validators.required),  // Initialize as FormArray
      images: this.fb.array([this.fb.control('')])
    });
  }

  // Getter for the images array
  get images() {
    return this.beverageForm.get('images') as FormArray;
  }

  // Getter for availableSlot as FormArray
  get availableSlot() {
    return this.beverageForm.get('availableSlot') as FormArray;
  }

  // Dynamically add image field
  addImageField() {
    this.images.push(this.fb.control(''));
  }

  // Submit the form
  submitForm() {
    if (this.beverageForm.valid) {
      const formData = this.beverageForm.value;

      // Convert availableSlot array to a JSON array of selected slots
      formData.availableSlot = this.availableSlots.filter((slot, index) => formData.availableSlot[index]);
      
      // Send form data to the backend
      this.http.post('http://localhost:3000/admin/add-dish/beverages', formData)
        .subscribe({
          next: (response) => {
            
            var dishName = formData.dishName;
            dishName = dishName.replaceAll(" ", "");
            dishName = 'k' + dishName;
            
            var data = { kValue: dishName, en: formData.dishName};
            
            this.http.post('http://localhost:3000/add-kvalue', data).subscribe({
              next: (res) => {
                  // alert('K-Value added successfully!')
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
                  this.beverageForm.reset();
              },
              error: (err) =>{
              console.log('Failed to add K-Value: ' + err.error.message); 
              this.showToast('Failed to add K-Value', 'danger');
              }  
            });
            
          },
          error: (error) => {
            console.error('Error adding dish', error);
            this.showToast('Failed to add dish', 'danger');
          }
        });
    }
  }

  // Initialize the checkboxes (empty values to begin with)
  ngOnInit() {
    this.initializeAvailableSlots();
  }

  // Initialize the available slots as unchecked
  private initializeAvailableSlots() {
    const slotControls = this.availableSlots.map(() => this.fb.control(false));  // Map to an array of FormControls
    const availableSlotFormArray = this.fb.array(slotControls);
    this.beverageForm.setControl('availableSlot', availableSlotFormArray);
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
