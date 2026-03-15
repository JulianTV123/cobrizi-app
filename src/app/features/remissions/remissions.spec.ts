import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Remissions } from './remissions';

describe('Remissions', () => {
  let component: Remissions;
  let fixture: ComponentFixture<Remissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Remissions],
    }).compileComponents();

    fixture = TestBed.createComponent(Remissions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
