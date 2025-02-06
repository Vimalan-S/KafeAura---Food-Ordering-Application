import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  file: File | null = null;
  orders: any[] = [];
  array: any[] = [];
  subscription!: Subscription;
  pendingOrders: any[] = [];
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
  allOrdersTillNow: any[] = [];
  cabinObj: any = {};
  floorObj: any = {};

  constructor(private http: HttpClient, private router: Router) {}


  ngOnInit(){
    this.getPendingOrders();
    this.getFoodNames();
    this.getCabinDetails();
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
        this.showToast('File uploaded and processed successfully.', 'success');
      },
      (error) => {
        console.error('Upload error:', error);
        this.showToast('Failed to upload file.', 'danger');
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

  getPendingOrders(){
    this.http.get<any[]>('http://localhost:3000/pendingOrders').subscribe(
      (response) => {
        this.pendingOrders = response.sort((a: any, b: any) => a.pickupTime.localeCompare(b.pickupTime));  
      },
      (error) => {
        console.error('Unable to fetch Pending Orders...', error);
        this.showToast('Unable to fetch Pending Orders', 'danger');
      }
    );
  }

  updateOrder(order: any) {
    const updatedOrder = { ...order, status: order.status };

    // Send updated status to the backend
    this.http
      .put(`http://localhost:3000/orders/${order.id}`, updatedOrder)
      .subscribe(
        (response) => {
          // Remove the order from the table
          this.pendingOrders = this.pendingOrders.filter((o) => o.id !== order.id);
          this.showToast('Order updated successfully', 'success');
        },
        (error) => {
          console.error('Error updating order:', error);
          this.showToast('Error updating order', 'danger');
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

  trainMLModel() {

    this.http.get<any[]>('http://localhost:3000/orders').subscribe(
      (response) => {
        this.allOrdersTillNow = response.sort((a: any, b: any) => b.id - a.id);
        this.showToast('Fetched all Orders successfully!', 'success');

        this.http.post('http://localhost:3000/api/test', { array: this.allOrdersTillNow }).subscribe({
            next: (response: any) => {
              this.toastType = 'success';
              this.toastMessage = 'ML model training completed successfully!';
              console.log('Response:', response);

              this.http.post('http://localhost:3000/saveMLModel', {}).subscribe({
                next: (response: any) => {
                  this.toastType = 'success';
                  this.toastMessage = 'ML model saved to Database successfully!';
                  console.log('Response:', response);
                },
                error: (error) => {
                  this.toastType = 'danger';
                  this.toastMessage = 'Failed to save model to database.';
                  console.error('Error:', error);
                }
            });
            },
            error: (error) => {
              this.toastType = 'danger';
              this.toastMessage = 'Failed to complete model training.';
              console.error('Error:', error);
            }
        });
      },
      (error) => {
        console.error('Unable to fetch Orders...', error);
        this.showToast('Unable to fetch Orders', 'danger');
      }
    );
  }

  getCabinDetails(){
    this.http.get<any[]>('http://localhost:3000/customerDetails').subscribe(
      (response) => {
        for(const obj of response){
          this.floorObj[obj.id] = {"floorId": obj.floorNumber} 
          this.cabinObj[obj.id] = {"cabinId": obj.cabinNumber} 
        }
      },
      (error) => {
        console.error('Unable to fetch Cabin Details...', error);
        this.showToast('Unable to fetch Cabin Details', 'danger');
      }
    );
  }
}
