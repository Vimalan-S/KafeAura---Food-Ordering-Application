import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastOrdersOfCustomerComponent } from './past-orders-of-customer.component';

describe('PastOrdersOfCustomerComponent', () => {
  let component: PastOrdersOfCustomerComponent;
  let fixture: ComponentFixture<PastOrdersOfCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PastOrdersOfCustomerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PastOrdersOfCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
