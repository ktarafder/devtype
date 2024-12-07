import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account-details',
  template: `
    <h2 mat-dialog-title>Account Details</h2>
    <mat-dialog-content>
      <p><strong>First Name:</strong> {{ data.first_name }}</p>
      <p><strong>Last Name:</strong> {{ data.last_name }}</p>
      <p><strong>Email:</strong> {{ data.email }}</p>
      <p><strong>Created At:</strong> {{ data.created_at }}</p>
      <p><strong>Total Score:</strong> {{ data.total_score }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class AccountDetailsComponent {
  constructor(
    private dialogRef: MatDialogRef<AccountDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close();
  }
}
