import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-past-orders-of-customer',
  templateUrl: './past-orders-of-customer.component.html',
  styleUrl: './past-orders-of-customer.component.css'
})
export class PastOrdersOfCustomerComponent {
  orders: any[] = [];
  dayMap: { [key: number]: string } = {
    1: 'kMonday',
    2: 'kTuesday',
    3: 'kWednesday',
    4: 'kThursday',
    5: 'kFriday',
    6: 'kSaturday',
    7: 'kSunday',
  };
  foodMap: any = {};
  customerId!: number;
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
  currentYear: number = new Date().getFullYear();
  toastMessage: string | null = null; // Message to show in the toast
  selectedLanguage: string = 'en'; // Default to English

  constructor(private http: HttpClient, private route: ActivatedRoute){
  
    }
    ngOnInit(){
      this.customerId = Number(this.route.snapshot.paramMap.get('customerId'));
      this.getFoodNames();
      this.getAllOrdersOfCustomer();
    }
  
    getAllOrdersOfCustomer(){
      this.http.get<any[]>(`http://localhost:3000/orders/${this.customerId}`).subscribe(
        (response) => {
          this.orders = response.sort((a: any, b: any) => b.id - a.id);
        },
        (error) => {
          console.error('Unable to fetch Orders...', error);
        }
      );
    }
  
    getFoodNames(){
      this.http.get<any[]>('http://localhost:3000/foodNames').subscribe(
        (response) => {
          response.forEach(
            (food) => {
              this.foodMap[food.dishiId] = food.dishName;
            }
          ); 
        },
        (error) => {
          console.error('Unable to fetch Food names...', error);
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
