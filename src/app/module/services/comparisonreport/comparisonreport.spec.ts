import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comparisonreport } from './comparisonreport';

describe('Comparisonreport', () => {
  let component: Comparisonreport;
  let fixture: ComponentFixture<Comparisonreport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comparisonreport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comparisonreport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
