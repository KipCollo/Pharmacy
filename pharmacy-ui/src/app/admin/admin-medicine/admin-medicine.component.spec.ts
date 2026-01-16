import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMedicineComponent } from './admin-medicine.component';

describe('AdminMedicineComponent', () => {
  let component: AdminMedicineComponent;
  let fixture: ComponentFixture<AdminMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMedicineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
