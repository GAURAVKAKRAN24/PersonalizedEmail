import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  EMAIL_Body,
  EMAIL_REGEX,
  EMAIL_SUBJECT,
  SUCCESS,
} from '../../common/defaults';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { EmailService } from '../services/email.service';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleMailDialogComponent } from './schedule-mail-dialog/schedule-mail-dialog.component';
import { LoaderComponent } from '../loader/loader.component';
import { SENDER_GMAIL_PASSWORD, SENDER_MAIL } from '../environment/env';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatStepperModule,
    MatMenuModule,
    LoaderComponent,
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '400ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95)' })
        ),
      ]),
    ]),
  ],
})
export class EmailComponent implements OnInit {
  @ViewChild('bottomOfForm') bottomOfForm!: ElementRef;
  emailForm: FormGroup = new FormGroup({});
  configForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;

  isLoading = false;
  loaderMessage = '📩 Sending emails please wait';
  sentSuccess = false;
  isRemove = false;
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly fb: FormBuilder,
    private readonly emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.generateConfigForm();
    this.generateSendMailForm();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ScheduleMailDialogComponent, {
      data: this.emailService.combineFormData(
        this.configForm,
        this.emailForm,
        this.selectedFile
      ),
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result.status === SUCCESS) {
        this.resetEmailForm();
      }
    });
  }

  generateConfigForm() {
    this.configForm = this.fb.group({
      senderGmail: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      password: ['', Validators.required],
    });
  }

  generateSendMailForm() {
    this.emailForm = this.fb.group({
      companies: this.fb.array([
        this.fb.group({
          company: ['', Validators.required],
          email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
        }),
      ]),
      subject: [EMAIL_SUBJECT ?? '', Validators.required],
      body: [EMAIL_Body ?? '', Validators.required],
      attachment: [null],
    });
  }

  get companies() {
    return this.emailForm.get('companies') as FormArray;
  }

  addCompany() {
    this.companies.push(
      this.fb.group({
        company: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      })
    );

    setTimeout(() => {
      this.bottomOfForm.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    this.isRemove = false;
  }

  removeCompany(index: number) {
    if (this.companies.length > 1) {
      this.companies.removeAt(index);
      // this.companies.removeAt(this.companies.length - 1);
    }
  }

  removeConfirm() {
    this.isRemove = !this.isRemove;
    if (this.companies.length === 1) {
      this.isRemove = false;
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files?.[0];
    this.emailForm.patchValue({
      attachment: this.selectedFile,
    });
  }

  submitForm() {
    this.isLoading = true;

    this.emailService
      .sendEmail(
        this.emailService.combineFormData(
          this.configForm,
          this.emailForm,
          this.selectedFile
        )
      )
      .subscribe({
        next: (response: any) => this.successResponse(response),
        error: (error) => this.failureResponse(error),
      });
  }

  successResponse(response: any) {
    if (response) {
      this.emailService.openSnackBar(response.message, 'Ok');
      this.loaderMessage = `📩 ${response.message}`;
      this.mailSendSuccess();
      this.resetEmailForm();
    }
  }

  failureResponse(error: any) {
    console.error('Error:', error);
    this.emailService.openSnackBar(error.message, 'Close');
    this.loaderMessage = `📩 ${error.message}`;
    this.mailSendSuccess();
    this.resetEmailForm();
  }

  scheduleMail() {
    this.openDialog();
  }

  mailSendSuccess() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  resetEmailForm() {
    this.companies.clear();
    this.emailForm.reset();
    this.addCompany();
  }
}
