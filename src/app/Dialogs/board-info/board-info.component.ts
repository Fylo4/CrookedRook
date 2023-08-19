import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { PieceInfoComponent } from 'src/app/Components/piece-info/piece-info.component';
import { GameService } from 'src/app/Services/game.service';
import { Draws, PieceAttributes, Wins, attrib_str, events_str, wins_str } from 'src/assets/TCR_Core/Constants';
import { GameData } from 'src/assets/TCR_Core/tcr';

@Component({
  selector: 'app-board-info',
  templateUrl: './board-info.component.html',
  styleUrls: ['./board-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    PieceInfoComponent,
  ],
})
export class BoardInfoComponent {
  gd: GameData;
  turnOrderString: string;
  uniqueTurnOrder: boolean;
  allWins: WinDraw[] = [];
  allDraws: WinDraw[] = [];

  gamerules = [
    {name: "Flip colors", desc: "The dark squares are rendered as light, and light squares are rendered as dark", show: false},
    {name: "Has hand", desc: "Captured pieces go to your hand. On your turn, you can drop a piece from your hand to the board", show: true},
    {name: "Forced drop", desc: "If you can drop a piece, you must", show: true},
    {name: "Destroy on burn", desc: "When a piece is burned, it is removed from play instead of going to your hand", show: true},
    {name: "Destroy on capture", desc: "When a piece is landed on, it is removed from play instead of going to your hand", show: true},
    {name: "Berzerk", desc: "If you can make a capturing move, you must", show: true},
    {name: "Can pass", desc: "Players can choose to pass their turn", show: true},
  ];
  filteredGameRules: number[];

  constructor(
    public dialogRef: MatDialogRef<BoardInfoComponent>,
    public g: GameService
  ) {
    this.gd = g.game.gameData;
    this.uniqueTurnOrder = JSON.stringify(this.gd.turn_list) != JSON.stringify([false, true]);
    this.turnOrderString = this.gd.turn_list.map(e => e ? "Black" : "White").toString();
    this.filteredGameRules = this.gd.game_rules.filter(r => this.gamerules[r].show);
    this.allWins = this.gd.wins.map(w => this.getWinString(w));
    let endangered = this.gd.all_pieces.filter(p => p.attributes.includes(PieceAttributes.endangered)).map(p => p.name);
    if (endangered.length)
      this.allWins.push({name: 'Extinction', desc: `Remove all pieces of an endangered type from the board. (Endangered types: ${endangered})`})
    this.allWins.push({name: 'Total extinction', desc: 'Remove every enemy piece from the board'});
    this.allWins.push({name: 'Resignation', desc: 'Opponent resigns or runs out of time'});
    this.allDraws = this.gd.draws.map(d => this.getDrawString(d));
    this.allDraws.push({name: 'Agreement', desc: 'Both players agree to a draw'});
  }

  getWinString(win: number): WinDraw {
    let board = this.g.game.boardHistory[this.g.game.viewMove];
    let ntw = this.gd.nextTurnWins.includes(win) ? '*' : '';
    switch(win) {
      case Wins.bare_royal:
        return {name: "Bare Royal"+ntw, desc: "Remove all non-royal enemy pieces from the board"};
      case Wins.campmate:
        return {name: "Campmate"+ntw, desc: "Reach the specified zone with a royal piece"};
      case Wins.check_n:
        return {name: `${this.gd.n_check}-check`+ntw, desc: `Check the opponent ${this.gd.n_check} times`,
          progress: `White: ${board.times_checked.white}/${this.gd.n_check}, Black: ${board.times_checked.black}/${this.gd.n_check}`}
      case Wins.royal_capture_n:
        if (this.gd.royal_capture_n === 1)
          return {name: 'Royal Capture'+ntw, desc: 'Capture any royal piece'}
        return {name: `Royal Capture (${this.gd.royal_capture_n})`+ntw, desc: `Capture ${this.gd.royal_capture_n} royal pieces`,
          progress: `White: ${board.royals_killed.white}/${this.gd.royal_capture_n}, Black: ${board.royals_killed.black}/${this.gd.royal_capture_n}`}
      case Wins.royal_extinction:
        return {name: 'Royal Extinction'+ntw, desc: 'Remove all enemy royal pieces from the board'}
      case Wins.stalemate:
        return {name: 'Stalemate'+ntw, desc: 'Reach a position where you have no movement options'}
    }
    return {name: 'Unknown Win Condition', desc: `Oops, Fylo forgot to update the win condition messages. Tell him to add win condition ${win} to the board info panel.`}
  }

  getDrawString(draw: number): WinDraw {
    let board = this.g.game.boardHistory[this.g.game.viewMove];
    switch(draw) {
      case Draws.moves_force_n:
        return {name: `${this.gd.move_force_n}-move (forced)`, desc: `After ${this.gd.move_force_n} moves without a capture, promotion, or moving certain pieces, the game will automatically be declared a draw`,
          progress: `${Math.floor(board.draw_move_counter)}/${this.gd.move_force_n}`};
      case Draws.moves_n:
        return {name: `${this.gd.move_n}-move`, desc: `After ${this.gd.move_n} moves without a capture, promotion, or moving certain pieces, either player can declare a draw`,
          progress: `${Math.floor(board.draw_move_counter)}/${this.gd.move_n}`};
      case Draws.mutual_pass:
        return {name: 'Mutual pass', desc: 'If both players pass in a row, the game will be declared a draw'}
      case Draws.repetition_force_n:
        return {name: `${this.gd.repetition_force_n}-repetition (forced)`, desc: `If the same board state with the same player to move occurs ${this.gd.repetition_force_n} times or more, the game is automatically declared a draw. Note: The board state includes which pieces have already moved or captured, en passant information, and if there is a copycat on the board, what move it is copying.`}
      case Draws.repetition_n:
        return {name: `${this.gd.repetition_n}-repetition`, desc: `If the same board state with the same player to move occurs ${this.gd.repetition_n} times or more, either player can declare a draw. Note: The board state includes which pieces have already moved or captured, en passant information, and if there is a copycat on the board, what move it is copying.`}
      case Draws.stalemate:
        return {name: 'Stalemate', desc: 'If a player is in a position with no legal moves, the game is automatically declared a draw'}
    }
    return {name: 'Unknown Draw Condition', desc: `Oops, Fylo forgot to update the draw condition messages. Tell him to add draw condition ${draw} to the board info panel.`}
  }

  closeModal() {
    this.dialogRef.close();
  }
}
interface WinDraw {
  name: string,
  desc: string,
  progress?: string
}