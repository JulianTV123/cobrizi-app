import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemissionForm } from './remission-form';

describe('RemissionForm', () => {
  let component: RemissionForm;
  let fixture: ComponentFixture<RemissionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemissionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RemissionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
