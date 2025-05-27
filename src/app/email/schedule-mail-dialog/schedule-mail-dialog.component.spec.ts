/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMailDialogComponent } from './schedule-mail-dialog.component';

describe('ScheduleMailDialogComponent', () => {
  let component: ScheduleMailDialogComponent;
  let fixture: ComponentFixture<ScheduleMailDialogComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleMailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleMailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
