import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsTranslateComponent } from './fields-translate.component';

describe('FieldsTranslateComponent', () => {
  let component: FieldsTranslateComponent;
  let fixture: ComponentFixture<FieldsTranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldsTranslateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FieldsTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
