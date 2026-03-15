import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateForm } from './associate-form';

describe('AssociateForm', () => {
  let component: AssociateForm;
  let fixture: ComponentFixture<AssociateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
