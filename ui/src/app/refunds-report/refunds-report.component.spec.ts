import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundsReportComponent } from './refunds-report.component';

describe('RefundsReportComponent', () => {
  let component: RefundsReportComponent;
  let fixture: ComponentFixture<RefundsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
