import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Devided} from './devided';

describe('Devided', () => {
  let component: Devided;
  let fixture: ComponentFixture<Devided>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Devided]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Devided);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
