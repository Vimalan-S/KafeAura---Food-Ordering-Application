import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-past-orders',
  templateUrl: './past-orders.component.html',
  styleUrl: './past-orders.component.css'
})
export class PastOrdersComponent {
  orders: any[] = [];
  dayMap: { [key: number]: string } = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    0: 'Sunday',
  };
  foodMap: any = {};
  toastMessage: string | null = null; // Message to show in the toast
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
  currentYear: number = new Date().getFullYear();

  constructor(private http: HttpClient, private router: Router){

  }
  ngOnInit(){
    this.getFoodNames();
    this.getAllOrders();
  }

  getAllOrders(){
    this.http.get<any[]>('http://localhost:3000/orders').subscribe(
      (response) => {
        this.orders = response.sort((a: any, b: any) => b.id - a.id);
      },
      (error) => {
        console.error('Unable to fetch Orders...', error);
        this.showToast('Unable to fetch Orders', 'danger');
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
        this.showToast('Unable to fetch Food names', 'danger');
      }
    );
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
