import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Devidedlist } from './devidedlist';

describe('Devidedlist', () => {
  let component: Devidedlist;
  let fixture: ComponentFixture<Devidedlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Devidedlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Devidedlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
