import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

import { CustomerHomeComponent } from './components/customer-home/customer-home.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';

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

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'admin/home', component: AdminHomeComponent },
  { path: 'customer/home', component: CustomerHomeComponent },
  { path: 'orders/:customerId', component: PastOrdersOfCustomerComponent },

  { path: 'admin/add-dish', component: AddDishComponent },
  { path: 'admin/add-dish/meals', component: MealComponent },
  { path: 'admin/add-dish/snacks', component: SnacksComponent },
  { path: 'admin/add-dish/desserts', component: DessertsComponent },
  { path: 'admin/add-dish/beverages', component: BeveragesComponent },
  { path: 'admin/past-orders', component: PastOrdersComponent }, 
  { path: 'admin/upload-knowledge-file', component: UploadKnowledgeFileComponent }, 
  { path: 'admin/fields-translate', component: FieldsTranslateComponent },

  { path: 'admin/update-dish', component: UpdateDishComponent },
  { path: 'customer/payment', component: PaymentComponent },

  { path: 'test', component: TestComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
