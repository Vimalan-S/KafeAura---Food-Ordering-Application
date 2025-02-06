import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-dish',
  templateUrl: './update-dish.component.html',
  styleUrls: ['./update-dish.component.css']
})
export class UpdateDishComponent implements OnInit {
  dishes: any[] = [];
  selectedCategory: string = '';
  toastMessage: string | null = null; // Message to show in the toast
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
  currentYear: number = new Date().getFullYear();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchDishes();
  }

  fetchDishes(): void {
    const url = this.selectedCategory
      ? `http://localhost:3000/admin/get-menu/${this.selectedCategory}`
      : 'http://localhost:3000/admin/get-menu';
    this.http.get<any[]>(url).subscribe((data) => {
      this.dishes = data.map(dish => this.transformAvailableSlot(dish)); // Transform availableSlot for each dish
    });
  }

  // Convert the availableSlot array to an object for easier checkbox binding
  transformAvailableSlot(dish: any) {
    const slots = ['morning', 'afternoon', 'evening', 'night'];
    const availableSlotObj: any = {};

    // Initialize the availableSlot object with false (unchecked)
    slots.forEach(slot => {
      availableSlotObj[slot] = dish.availableSlot.includes(slot); // Set to true if slot is in the array
    });

    // Set the transformed object back to the dish object
    dish.availableSlot = availableSlotObj;
    return dish;
  }

  // Convert the availableSlot object back to an array before submitting
  getAvailableSlotArray(dish: any) {
    return Object.keys(dish.availableSlot)
      .filter(slot => dish.availableSlot[slot]) // Only include slots that are true
      .map(slot => slot); // Return an array of selected slots
  }

  filterByCategory(): void {
    this.fetchDishes();
  }

  updateDish(dish: any): void {
    // Convert the availableSlot object back into an array of selected slots
    dish.availableSlot = this.getAvailableSlotArray(dish);

    const url = `http://localhost:3000/admin/update-menu/${dish.dishiId}`;
    this.http.put(url, dish).subscribe({
      next: () => this.showToast('Dish updated successfully', 'success'),
      error: () => this.showToast('Failed to update dish', 'danger')
    });
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
  
    goToCategory(category: string) {
      this.router.navigate([`/admin/add-dish/${category}`]);
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
  
}
