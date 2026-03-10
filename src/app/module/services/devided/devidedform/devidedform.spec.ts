import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Devidedform } from './devidedform';

describe('Devidedform', () => {
  let component: Devidedform;
  let fixture: ComponentFixture<Devidedform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Devidedform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Devidedform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
