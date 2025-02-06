import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';

interface NutritionChartOptions {
  chart: ApexChart;
  series: ApexNonAxisChartSeries;
  labels: string[];
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
}
@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css'],
})
export class CustomerHomeComponent implements OnInit {
  menuItems: any[] = [];
  cart: any[] = [];
  selectedDish: any = null;
  isCartModalOpen = false;
  isChatbotOpen = false;
  chatHistory: { type: 'user' | 'bot'; content: string }[] = [];
  userQuestion = '';
  isDishModalOpen = false;
  isNutritionModalOpen = false;
  nutritionData: any;
  nutritionLabels = [
    'Calories', 'Serving Size (g)', 'Total Fat (g)', 'Saturated Fat (g)', 
    'Protein (g)', 'Sodium (mg)', 'Potassium (mg)', 'Cholesterol (mg)', 
    'Carbohydrates (g)', 'Fiber (g)', 'Sugar (g)'
  ];
  nutritionSeriesInGrams: any[] = [];
  nutritionSeriesInMilligrams: any[] = [];
  calories: number = 0;

    // Filtered labels for grams (g) and milligrams (mg)
    nutritionLabelsInGrams: string[] = [];
    nutritionLabelsInMilligrams: string[] = [];
  
// Chart Options Configuration
chartOptionsInGrams: NutritionChartOptions = {
  chart: {
    type: 'pie',
    height: 800,
    width: '100%',
    background: '#ffffff'
  },
  series: [],
  labels: [
    'Total Fat',
    'Saturated Fat',
    'Protein',
    'Carbohydrates',
    'Fiber',
    'Sugar'
  ],
  title: {
    text: 'Nutrients (in grams)',
    align: 'center',
    style: {
      fontSize: '24px',
      fontWeight: 'bold'
    }
  },

  responsive: [{
    breakpoint: 1600,
    options: {
      chart: {
        height: 700
      }
    }
  }, {
    breakpoint: 1200,
    options: {
      chart: {
        height: 600
      }
    }
  }]
};

chartOptionsInMilligrams: NutritionChartOptions = {
  chart: {
    type: 'pie',
    height: 800,
    width: '100%',
    background: '#ffffff'
  },
  series: [],
  labels: [
    'Sodium',
    'Potassium',
    'Cholesterol'
  ],
  title: {
    text: 'Nutrients (in milligrams)',
    align: 'center',
    style: {
      fontSize: '24px',
      fontWeight: 'bold'
    }
  },

  responsive: [{
    breakpoint: 1600,
    options: {
      chart: {
        height: 700
      }
    }
  }, {
    breakpoint: 1200,
    options: {
      chart: {
        height: 600
      }
    }
  }]
};
  totalAmount: any = 0;
  timeForm: FormGroup;
  // selectedTime: string | null = null;
  minTime: string = ''; // Minimum selectable time
  t: number = 20; // Time offset in minutes
  timeControl = new FormControl('');
  // minTime: string;
  selectedTime: any;
  timeBufferMinutes = 20;
  selectedLanguage: string = 'en'; // Default to English
  kValues: any[] = [];
  toastType: 'success' | 'danger' = 'success'; // Toast type (success or error)
  currentYear: number = new Date().getFullYear();
  toastMessage: string | null = null; // Message to show in the toast
  selectedCategory: string = 'all';
  filteredMenuByCategory: any[] = [];
  allMenuItems: any[] = []; // Store all menu items
  selectedDeliveryType: string = 'DineIn';
  weatherData: any;
  suggestedFoods: any[] = [];
  inputObj: any = {};
  hourRotation: number = 0;
  minuteRotation: number = 0;

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder) {
    // Initialize the form with a 'selectedTime' control
    this.timeForm = this.fb.group({
      selectedTime: [''] // Default value is an empty string
    });
  }

  ngOnInit(): void {

     // Load language from localStorage if available
     const savedLanguage = localStorage.getItem('siteLanguage');
     if (savedLanguage) {
         this.selectedLanguage = savedLanguage;
     }

    this.fetchMenuItems();
    this.getFoodSuggestions();
    // Filter labels for grams and milligrams once the component initializes
    this.nutritionLabelsInGrams = this.nutritionLabels.filter(label => label.includes('(g)'));
    this.nutritionLabelsInMilligrams = this.nutritionLabels.filter(label => label.includes('(mg)'));

    this.calculateMinTime();
    this.setMinTime();
  }
  
  getFoodSuggestions() {
    const apiUrl = 'http://api.weatherapi.com/v1/current.json?key=89d167c12daf4c1f8fb00931242812&q=Puducherry';
    
    // Fetch weather data
    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        this.weatherData = data.current; // Populate weatherData
        
        this.inputObj = {
          "customerId": 1 ,
          "bookedTimeSlot" : this.getCurrentTimeSlot(),
          "day" : new Date().getDay(),
          "feelslike_c" : this.weatherData.feelslike_c ,
          "feelslike_f" : this.weatherData.feelslike_f ,
          "heatindex_c" : this.weatherData.heatindex_c ,
          "heatindex_f" : this.weatherData.heatindex_f ,
          "cloud" : this.weatherData.cloud ,
          "precip_mm" : this.weatherData.precip_mm ,
          "text" : this.weatherData?.condition?.text ,
        }
    
        this.http.post('http://localhost:3000/api/predict', { "inputObj": this.inputObj }).subscribe(
          (response: any) => {
            console.log("Predicted Foods: ", response.result);
            // console.log("JSON.parse(response): ", JSON.parse(response));

            this.suggestedFoods = this.allMenuItems.filter(food => response.result.includes(food.dishiId));
            console.log("SuggestedFoods: ", this.suggestedFoods);
            
          },
          (error) => {
            console.error('Error when predicting:', error);
          }
        );
      },
      error: (error: any) => {
        console.error('Error fetching weather data:', error);
        this.showToast('Failed to fetch weather data.', 'danger');
      }
    });

  }

  getCurrentTimeSlot(){
    const currentTime = new Date();
    const hours = currentTime.getHours(); // Get the current hour

    if (hours >= 21 || hours < 9) {
      return 0; // Time outside the specified slots
    } else if (hours >= 9 && hours < 12) {
      return 1; // 9 AM to 12 PM
    } else if (hours >= 12 && hours < 15) {
      return 2; // 12 PM to 3 PM
    } else if (hours >= 15 && hours < 19) {
      return 3; // 3 PM to 7 PM
    } else if (hours >= 19 && hours < 22) {
      return 4; // 7 PM to 10 PM
    } else {
      return 0; // Default case (fallback, though this should never hit)
    }
  }
  // Example object with dynamic values
  myObject = {
    id: 1,
    name: 'John Doe',
    timestamp: new Date(),
  };

  openCartModal() {
    this.isCartModalOpen = true;
  }

  closeCartModal() {
    this.isCartModalOpen = false;
  }

  fetchMenuItems() {
    this.http.get<any[]>('http://localhost:3000/admin/get-menu').subscribe(
      (data) => {
        this.allMenuItems = data.map((dish) => ({
          ...dish,
          quantity: 0,
        }));
        this.menuItems = [...this.allMenuItems]; // Initialize menuItems with all items
      },
      (error) => {
        console.error('Failed to fetch menu items', error);
      }
    );
  }

  filterByCategory() {
    console.log("this.selectedCategory: ", this.selectedCategory);
    
    if (this.selectedCategory === 'all') {
      this.menuItems = [...this.allMenuItems];
    } else {
      this.menuItems = this.allMenuItems.filter(
        item => item.dishCategory.toLowerCase() === this.selectedCategory.toLowerCase()
      );

      console.log("After filtering: ", this.menuItems);
      
    }
  }

  increaseQuantity(dish: any) {
    dish.quantity += 1;
  }

  decreaseQuantity(dish: any) {
    if (dish.quantity > 1) {
      dish.quantity -= 1;
    }
  }

  addToCart(dish: any) {
    const existingItem = this.cart.find(
      (item) => item.dishiId === dish.dishiId
    );
    if (existingItem) {
      existingItem.quantity = dish.quantity; // Update quantity if the dish already exists in the cart
    } else {
      this.cart.push({
        ...dish, // Push the whole dish object
        quantity: dish.quantity, // Include the quantity in the cart
      });
    }
    this.showToast(`${dish.dishName} Added to Cart`, 'success');
  }

  calculateTotalCost(): number {
    return this.cart.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }

  openDishDetails(dish: any) {
    this.selectedDish = dish;
    this.isDishModalOpen = true;
    this.calories = parseFloat(this.selectedDish.calories) || 0;
  }

  toggleChatbot(): void {
    this.isChatbotOpen = !this.isChatbotOpen;
  }

  sendMessage(): void {
    const question = this.userQuestion.trim();
    if (!question) return;

    // Add user message to chat history
    this.chatHistory.push({ type: 'user', content: question });

    // Clear input field
    this.userQuestion = '';

    // Call the /chat endpoint
    this.http.post('http://localhost:3000/chat', { question }).subscribe(
      (response: any) => {
        const answer = response.answer || 'No response';
        this.chatHistory.push({ type: 'bot', content: answer });
      },
      (error) => {
        console.error('Error in chatbot request:', error);
        this.chatHistory.push({
          type: 'bot',
          content: 'Error fetching response from chatbot.',
        });
      }
    );
  }

  // Close dish details modal
  closeDishModal() {
    this.isDishModalOpen = false;
  }

  // Show nutrition modal
  showNutrition() {
    this.nutritionData = {
      calories: parseFloat(this.selectedDish.calories) || 0,
      serving_size_g: parseFloat(this.selectedDish.serving_size_g) || 0,
      fat_total_g: parseFloat(this.selectedDish.fat_total_g) || 0,
      fat_saturated_g: parseFloat(this.selectedDish.fat_saturated_g) || 0,
      protein_g: parseFloat(this.selectedDish.protein_g) || 0,
      sodium_mg: parseFloat(this.selectedDish.sodium_mg) || 0,
      potassium_mg: parseFloat(this.selectedDish.potassium_mg) || 0,
      cholesterol_mg: parseFloat(this.selectedDish.cholesterol_mg) || 0,
      carbohydrates_total_g: parseFloat(this.selectedDish.carbohydrates_total_g) || 0,
      fiber_g: parseFloat(this.selectedDish.fiber_g) || 0,
      sugar_g: parseFloat(this.selectedDish.sugar_g) || 0,
    };

     // Fill nutritionSeries for grams (g) and milligrams (mg)
     this.nutritionSeriesInGrams = [
      this.nutritionData.fat_total_g,
      this.nutritionData.fat_saturated_g,
      this.nutritionData.protein_g,
      this.nutritionData.carbohydrates_total_g,
      this.nutritionData.fiber_g,
      this.nutritionData.sugar_g
    ];

    this.nutritionSeriesInMilligrams = [
      this.nutritionData.sodium_mg,
      this.nutritionData.potassium_mg,
      this.nutritionData.cholesterol_mg
    ];

    
    this.isNutritionModalOpen = true;
    // Assign the series data to the chart options dynamically
    this.chartOptionsInGrams.series = this.nutritionSeriesInGrams;
    this.chartOptionsInMilligrams.series = this.nutritionSeriesInMilligrams;
    
  }

  // Close nutrition modal
  closeNutritionModal() {
    this.isNutritionModalOpen = false;
  }

  proceedToPayment() {
    this.totalAmount = this.calculateTotalCost();
    this.router.navigate(['/customer/payment'], 
      { state: { 
        cart: this.cart , 
        selectedTime: this.selectedTime,
        deliveryType: this.selectedDeliveryType 
      }
    });
  }

  setMinTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + this.calculateMaxPreparationTime());
    this.minTime = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMinTime(){
    const now = new Date();
    now.setMinutes(now.getMinutes() + this.calculateMaxPreparationTime());
    return this.minTime = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onTimeChange() {
    const selectedTime = this.timeControl.value;
    
    if (selectedTime && selectedTime < this.getMinTime()) {
      this.timeControl.setErrors({ invalidTime: true });
      this.selectedTime = null;
    } else {
      this.timeControl.setErrors(null);
      this.selectedTime = selectedTime;
    }
  }

  calculateMinTime(): void {
    const now = new Date(); // Get the current time
    now.setMinutes(now.getMinutes() + this.t); // Add `t` minutes to current time

    // Format time to `HH:mm` (24-hour format) for the `min` attribute
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.minTime = `${hours}:${minutes}`;
  }

  calculateMaxPreparationTime() {
    if (this.cart.length === 0) {
      return 0; // Handle empty cart case
    }
    const maxTime = Math.max(...this.cart.map(item => item.preparationTime));
    return maxTime;
  }

  viewPastOrdersOfThisCustomer() {
    const customerId = 1;
    this.router.navigate(['/orders', customerId]);
  }  

  changeLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;
    this.selectedLanguage = language;

    // Save the selected language to localStorage
    localStorage.setItem('siteLanguage', this.selectedLanguage);
    this.showToast(`Language changed to: ${this.selectedLanguage}`, 'success');
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

  getDayName(day: number): string {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[day] || '';
  }
}
