import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-details',
  template: `
    <h2 mat-dialog-title class="dialog-title">Account Details</h2>
    <mat-dialog-content class="dialog-content">
      <div class="detail-row"><strong>First Name:</strong> {{ data.first_name }}</div>
      <div class="detail-row"><strong>Last Name:</strong> {{ data.last_name }}</div>
      <div class="detail-row"><strong>Email:</strong> {{ data.email }}</div>
      <div class="detail-row"><strong>Created At:</strong> {{ data.created_at }}</div>
      <div class="detail-row"><strong>Total Score:</strong> {{ data.total_score }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button color="primary" (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  styleUrls: ['./account-details.component.css'], // Add the custom CSS
})
export class AccountDetailsComponent {
  constructor(
    private dialogRef: MatDialogRef<AccountDetailsComponent>, // Handles closing the modal
    @Inject(MAT_DIALOG_DATA) public data: any // Injects data passed to the modal
  ) {}

  // Close method for the dialog
  close() {
    this.dialogRef.close();
  }
}
