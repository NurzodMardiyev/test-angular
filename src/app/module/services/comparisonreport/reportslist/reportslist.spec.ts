import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportslist } from './reportslist';

describe('Reportslist', () => {
  let component: Reportslist;
  let fixture: ComponentFixture<Reportslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportslist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
