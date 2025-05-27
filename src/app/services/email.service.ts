import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../environment/env';
import { EMAIL_SUBJECT, EMAIL_Body } from '../../common/defaults';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly _snackBar = inject(MatSnackBar);
  
  constructor(private readonly http: HttpClient) {}
  sendEmail(emailData: any): Observable<any> {
    return this.http.post<any>(`${API_URL}send-emails`, emailData);
  }

  combineFormData(
    configForm: any,
    emailForm: any,
    selectedFile: File | null
  ): FormData {
    const formData = new FormData();
    formData.append('senderGmail', configForm.get('senderGmail')?.value);
    formData.append('password', configForm.get('password')?.value);
    formData.append(
      'subject',
      emailForm.get('subject')?.value ?? EMAIL_SUBJECT
    );
    formData.append('body', emailForm.get('body')?.value ?? EMAIL_Body);
    formData.append(
      'companies',
      JSON.stringify(emailForm.get('companies')?.value)
    );
    if (selectedFile) {
      formData.append('attachment', selectedFile, selectedFile.name);
    }
    return formData;
  }

   openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
