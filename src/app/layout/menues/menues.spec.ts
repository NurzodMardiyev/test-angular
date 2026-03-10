import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menues } from './menues';

describe('Menues', () => {
  let component: Menues;
  let fixture: ComponentFixture<Menues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menues]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menues);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
