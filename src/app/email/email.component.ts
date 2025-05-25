import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
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
import { API_URL, EMAIL_Body, EMAIL_REGEX, EMAIL_SUBJECT } from '../../common/defaults';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    MatIconModule
  ],
})
export class EmailComponent implements OnInit {
  emailForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  private _snackBar = inject(MatSnackBar);
  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      companies: this.fb.array([
        this.fb.group({
          company: ['', Validators.required],
          email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
        }),
      ]),
      subject: [EMAIL_SUBJECT ?? '', Validators.required],
      body: [EMAIL_Body ?? '' , Validators.required],
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
  }

  removeCompany() {
    if (this.companies.length > 1) {
      this.companies.removeAt(this.companies.length - 1);
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.emailForm.patchValue({
      attachment: this.selectedFile
    })
  }

  submitForm() {
    console.log(this.emailForm.value);
    const formData = new FormData();
    formData.append('subject', this.emailForm.value.subject);
    formData.append('body', this.emailForm.value.body);
    formData.append(
      'company_email_list',
      JSON.stringify(this.emailForm.value.companies)
    );
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http.post(`${API_URL}.send-emails`, formData).subscribe(
      (response) => {
        if(response) {
          this.openSnackBar('Emails sent successfully', 'Ok');
          this.emailForm.reset();
        }
      },
      (error) => {
        console.error('Error:', error);
        this.openSnackBar(error, 'Close')
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
