import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EmailService } from '../../services/email.service';
import { LoaderComponent } from '../../loader/loader.component';
// Define DialogData interface
export interface DialogData {
  animal: string;
}

@Component({
  selector: 'app-schedule-mail-dialog',
  templateUrl: './schedule-mail-dialog.component.html',
  styleUrls: ['./schedule-mail-dialog.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    LoaderComponent,
  ],
  providers: [provideNativeDateAdapter()],
})
export class ScheduleMailDialogComponent implements OnInit {
  dateTimeForm: FormGroup = new FormGroup({});
  readonly dialogRef = inject(MatDialogRef<ScheduleMailDialogComponent>);
  readonly data: any = inject<DialogData>(MAT_DIALOG_DATA);
  currentDate: string = new Date().toISOString().split('T')[0];
  isLoading: any;
  loaderMessage = 'Scheduling email, please wait';

  constructor(private readonly emailService: EmailService) {}

  ngOnInit() {
    this.generateDateTimeForm();
  }

  generateDateTimeForm() {
    this.dateTimeForm = new FormGroup({
      scheduledDate: new FormControl('', Validators.required),
      scheduledTime: new FormControl('', Validators.required),
    });
  }

  get scheduledDate() {
    return this.dateTimeForm.get('scheduledDate')?.value;
  }

  get scheduledTime() {
    return this.dateTimeForm.get('scheduledTime')?.value;
  }
  cancel() {
    this.dialogRef.close({status: 'cancel'});
  }

  sendScheduleMail() {
    if (this.scheduledDate && this.scheduledTime) {
      this.isLoading = true;
      const [hours, minutes] = this.scheduledTime.split(':').map(Number);
      const date = new Date(this.scheduledDate);
      const scheduledTime = this.ISOStringDate(date, hours, minutes);
      this.data.append('schedule_time', scheduledTime);
      this.emailService.sendEmail(this.data).subscribe({
        next: (response: any) => this.successResponse(response.message),
        error: (error) => this.failureResponse(error.error),
      });
    } else {
      console.warn('Date and/or time not selected');
    }
  }

  successResponse(message: any) {
    this.isLoading = false;
    this.loaderMessage = 'Email scheduled successfully';
    this.emailService.openSnackBar(message, 'Ok');
    this.dialogRef.close({status: 'success'});
  }

  failureResponse(errorMsg: any) {
    this.isLoading = false;
    console.error('Error:', errorMsg.error);
    this.loaderMessage = `Error: ${errorMsg.error}`;
    this.emailService.openSnackBar(errorMsg.error, 'Close');
  }

  ISOStringDate(date: Date, hours: number, minutes: number): string {
    const dateString = date.toISOString().split('T')[0];
    console.log(date, dateString);
    return `${dateString}T${hours.toString()}:${minutes.toString()}:00`;
  }
}
