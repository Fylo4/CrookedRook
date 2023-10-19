import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ErrorService } from 'src/app/Services/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
  ],
})
export class ErrorComponent {
  constructor(public error: ErrorService) {
    // error.addError("test error");
    // error.addMessage("test message");
    // error.addError("test error2");
    // error.addMessage("test message2");
  }
}
