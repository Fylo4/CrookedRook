import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GameService } from 'src/app/Services/game.service';
import { attrib_str, events_str } from 'src/assets/TCR_Core/Constants';
import { Piece } from 'src/assets/TCR_Core/Piece';

@Component({
  selector: 'app-piece-info',
  templateUrl: './piece-info.component.html',
  styleUrls: ['./piece-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
  ],
})
export class PieceInfoComponent implements OnInit {
  @Input() pieceId: number = 0;
  p!: Piece;
  constructor(public g: GameService) {}
  
  ngOnInit() {
    this.p = this.g.game.gameData.all_pieces[this.pieceId];
  }

  getPromToString(toArray: number[]) {
    return toArray.map(p => this.g.game.gameData.all_pieces[p].name);
  }
  getPromOnString(onArray: number[]) {
    return onArray.map(p => events_str[p]);
  }
  getAttribString(attrib: number) {
    return attrib_str[attrib];
  }
}
