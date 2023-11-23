import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { GameService } from "src/app/Services/game.service";
import { MatDividerModule } from '@angular/material/divider';
import { ErrorService } from "src/app/Services/error.service";

@Component({
    selector: 'app-tcr-canvas',
    templateUrl: './tcr-canvas.component.html',
    styleUrls: ['./tcr-canvas.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      MatButtonModule,
      MatIconModule,
      MatDividerModule,
    ],
})
export class TcrCanvasComponent {

}