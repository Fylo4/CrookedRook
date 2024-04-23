import { Component, inject } from "@angular/core";
import { GamePageComponent } from "src/app/Components/game-page/game-page.component";
import { GameService } from "src/app/Services/game.service";

@Component({
    selector: 'app-board',
    styleUrl: './board.component.scss',
    templateUrl: './board.component.html',
    standalone: true,
    imports: [GamePageComponent],
})
export class BoardComponent {
    gameService = inject(GameService);
}