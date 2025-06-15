import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertHabitDialog } from './upsert-habit-dialog';

describe('UpsertHabitDialog', () => {
  let component: UpsertHabitDialog;
  let fixture: ComponentFixture<UpsertHabitDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertHabitDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertHabitDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
