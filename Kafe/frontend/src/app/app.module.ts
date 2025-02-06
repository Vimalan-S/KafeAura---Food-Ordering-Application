import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { AddDishComponent } from './components/add-dish/add-dish.component';
import { MealComponent } from './components/add-dish/meal/meal.component';
import { SnacksComponent } from './components/add-dish/snacks/snacks.component';
import { DessertsComponent } from './components/add-dish/desserts/desserts.component';
import { BeveragesComponent } from './components/add-dish/beverages/beverages.component';
import { UpdateDishComponent } from './components/update-dish/update-dish.component';
import { PaymentComponent } from './components/payment/payment.component';
import { TestComponent } from './components/test/test.component';
import { PastOrdersComponent } from './components/past-orders/past-orders.component';
import { UploadKnowledgeFileComponent } from './components/upload-knowledge-file/upload-knowledge-file.component';
import { PastOrdersOfCustomerComponent } from './components/past-orders-of-customer/past-orders-of-customer.component';
import { FieldsTranslateComponent } from './components/fields-translate/fields-translate.component';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    AdminHomeComponent,
    CustomerHomeComponent,
    AddDishComponent,
    MealComponent,
    SnacksComponent,
    DessertsComponent,
    BeveragesComponent,
    UpdateDishComponent,
    PaymentComponent,
    TestComponent,
    PastOrdersComponent,
    UploadKnowledgeFileComponent,
    PastOrdersOfCustomerComponent,
    FieldsTranslateComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule ,
    FormsModule,
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
