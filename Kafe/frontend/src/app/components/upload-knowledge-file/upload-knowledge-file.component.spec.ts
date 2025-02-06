import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadKnowledgeFileComponent } from './upload-knowledge-file.component';

describe('UploadKnowledgeFileComponent', () => {
  let component: UploadKnowledgeFileComponent;
  let fixture: ComponentFixture<UploadKnowledgeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadKnowledgeFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadKnowledgeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
