import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  totalAmount: number = 0;
  stripe!: Stripe | null;
  paymentInitialized = false;
  paymentStatus = '';
  cart: any[] = []
  weatherData: any = {};
  rqstBody: any = {}
  selectedLanguage: string = 'en'; // Default to English
  toastMessage: string | null = null; // Message to show in the toast
toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
currentYear: number = new Date().getFullYear();

  constructor(private router: Router, private http: HttpClient) {}

  async ngOnInit() {
    this.totalAmount = this.calculateTotalCost();

    // Load Stripe
    this.stripe = await loadStripe('pk_test_51QbWqUQQSH4dR5LjOEfdGdNVmKSNZjJxkXXpGqlHvvACIqiRr6Xn7RauNo60RqB6ZvTJS8m9yZu6MMmC2F795XY200tSGuhRlc');
    const elements = this.stripe?.elements();

    // Create card element
    const cardElement = elements?.create('card');
    cardElement?.mount('#payment-form');
    this.paymentInitialized = true;

    // Add Stripe form validation (optional)
    cardElement?.on('change', (event) => {
      this.paymentStatus = event.error ? event.error.message : '';
    });
  }

  async makePayment() {
    if (!this.stripe) return;
  
    // Create a payment intent on the backend
    const response = await fetch('http://localhost:3000/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: this.totalAmount * 100 }), // amount in cents
    });
    const { clientSecret } = await response.json();
  
    // Confirm payment on the frontend
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret);
  
    if (error) {
      this.paymentStatus = 'Payment failed: ' + error.message;
    } else if (paymentIntent?.status === 'succeeded') {
      this.paymentStatus = 'Payment done! Fetching weather data...';
  
      const apiUrl = 'http://api.weatherapi.com/v1/current.json?key=89d167c12daf4c1f8fb00931242812&q=Puducherry';
  
      // Fetch weather data
      this.http.get(apiUrl).subscribe({
        next: (data: any) => {
          this.weatherData = data.current; // Populate weatherData
  
          // Prepare the request body
          const rqstBody: any = {
            cart: history.state['cart'],
            selectedTime: history.state['selectedTime'],
            weatherData: this.weatherData,
            totalAmount: this.totalAmount,
            deliveryType: history.state['deliveryType']
          };
  
          // Send the POST request to place the order
          this.http.post('http://localhost:3000/orders', rqstBody).subscribe({
            next: (response) => {
              this.showToast('Order placed successfully!', 'success');
              setTimeout(() => this.router.navigate(['/customer/home']), 5000);
            },
            error: (error) => {
              console.error('Error placing order:', error);
              this.showToast('Failed to place order.', 'danger');
            }
          });
        },
        error: (error) => {
          console.error('Error fetching weather data:', error);
          this.showToast('Failed to fetch weather data.', 'danger');
        }
      });
    }
    setTimeout(() => this.router.navigate(['/customer/home']), 5000);
  }
  
  calculateTotalCost(): number {
    return history.state['cart'].reduce(
      (total: number, item: { quantity: number; price: number; }) => total + item.quantity * item.price,
      0
    );
  }

  changeLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;
    this.selectedLanguage = language;

    // Save the selected language to localStorage
    localStorage.setItem('siteLanguage', this.selectedLanguage);

    this.showToast(`Language changed to: ${this.selectedLanguage}`, 'success');
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
