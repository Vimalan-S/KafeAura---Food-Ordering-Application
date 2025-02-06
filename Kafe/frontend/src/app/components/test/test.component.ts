import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {
  resultArray: number[] = [];

  constructor(private testService: TestService) {}

  doubleArray() {
    const randomArray = [1, 2, 3, 4, 5]; // Example array

    this.testService.doubleArray(randomArray).subscribe({
      next: (response: any) => {
        this.resultArray = response.doubledArray;
      },
      error: (err: any) => {
        console.error('Error doubling array:', err);
      },
    });
  }
}
