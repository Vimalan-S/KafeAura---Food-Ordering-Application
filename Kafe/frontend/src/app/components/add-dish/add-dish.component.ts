// add-dish.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.css']
})
export class AddDishComponent {
  constructor(private router: Router) {}

  goToCategory(category: string) {
    this.router.navigate([`/admin/add-dish/${category}`]);
  }
}
