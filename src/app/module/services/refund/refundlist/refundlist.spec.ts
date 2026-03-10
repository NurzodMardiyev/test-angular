import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Refundlist } from './refundlist';

describe('Refundlist', () => {
  let component: Refundlist;
  let fixture: ComponentFixture<Refundlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Refundlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Refundlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
