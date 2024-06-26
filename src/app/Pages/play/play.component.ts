import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { GamePageComponent } from "src/app/Components/game-page/game-page.component";
import { AuthService } from "src/app/Services/Firebase/auth.service";
import { DBService } from "src/app/Services/Firebase/db.service";
import { HistoryRecord } from "src/assets/TCR_Core/board/make_move";
import { cyrb128 } from "src/assets/TCR_Core/random";
import { GameContainer } from "src/assets/TCR_Core/tcr";
import { chess } from "src/assets/boards/Chess/chess";
import { MatchType } from "src/types/types";

@Component({
    selector: 'app-play',
    styleUrl: './play.component.scss',
    templateUrl: './play.component.html',
    standalone: true,
    imports: [GamePageComponent],
})
export class PlayComponent implements OnInit, OnDestroy {
    private matchId = '';
    private movesSub?: undefined | Unsubscribe;
    private myMoveList: any[] = [];
    private matchDataSub?: undefined | Unsubscribe;
    private matchData?: MatchType;
    private gameInitiated = false;

    thisGame?: GameContainer;
    private route = inject(ActivatedRoute);
    private auth = inject(AuthService);

    ngOnInit(): void {
        this.matchId = this.route.snapshot.paramMap.get('id') ?? '';
        if (!this.matchId) {
            console.error("Match ID is undefined");
            return;
        }
        if (!this.auth.db) {
            console.error("Database not initialized");
            return;
        }

      this.matchDataSub = onSnapshot(doc(this.auth.db!, "Matches", this.matchId, "match", "matchData"), (doc) => {
        const matchData = doc.data();
        if (matchData) {
            this.matchData = {
                blackId: matchData['blackId'],
                blackName: matchData['blackName'],
                whiteId: matchData['whiteId'],
                whiteName: matchData['whiteName'],
                boardCode: matchData['boardCode'],
                dateTimeStarted: matchData['dateTimeStarted'],
                isPrivate: matchData['isPrivate'],
                toMove: matchData['toMove'],
                turnNum: matchData['turnNum'],
            };
            if (!this.gameInitiated) {
                this.initMatch();
            }
        }
      })
    }

    db = inject(DBService);
    user = inject(AuthService);
    initMatch() {
        this.db.getBoard(this.matchData!.boardCode).subscribe(b => {
            this.thisGame = new GameContainer(b.data, cyrb128(b.seed+'')[0], "server");
            this.thisGame.multiplayerData = {
                isInMultiplayerGame: true,
                myName: this.user.user?.name ?? '',
                otherName: this.matchData!.blackId === this.user.user?.id ? this.matchData!.whiteName : this.matchData!.blackName,
                myCol: this.matchData!.blackId === this.user.user?.id,
            };
            this.thisGame.handleMultiplayerMove = (src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number | undefined) => {
                console.log("hello")
                this.db.makeMultiplayerMove({matchId: this.matchId, src_x, src_y, dst_x, dst_y, promotion}).subscribe();
            }
            this.movesSub = onSnapshot(doc(this.auth.db!, "Matches", this.matchId, "match", "moves"), (doc) => {
                const d = doc.data();
                console.log("movesSub update", d);
              const moveArr = d ? (d['moves']??[]) : [];
              if (moveArr) this.verifyMoveHistory(moveArr);
            });
        });
        this.gameInitiated = true;
    }

    ngOnDestroy(): void {
        if (this.movesSub != undefined) this.movesSub();
        if (this.matchDataSub != undefined) this.matchDataSub();
    }

    verifyMoveHistory(moveArray: {src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number}[]) {
        for (let a = 0; a < moveArray.length; a ++) {
            if (this.myMoveList.length <= a) {
                // We're behind, fast-forward
                console.log("Fast-forwarding");
                const m = moveArray[a];
                this.thisGame!.makeMove(m.src_x, m.src_y, m.dst_x, m.dst_y, m.promotion);
                this.thisGame!.renderAfterMove();
                this.myMoveList.push({...m})
            }
            else if (JSON.stringify(this.myMoveList[a]) != JSON.stringify(moveArray[a])) {
                // In the future, handle this better
                console.error("Move conflict detected");
            }
        }
    }
}