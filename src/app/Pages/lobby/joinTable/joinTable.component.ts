import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/Firebase/auth.service';
import { DBService } from 'src/app/Services/Firebase/db.service';
import { GameService } from 'src/app/Services/game.service';
import { StoredLobbyType } from 'src/types/types';

@Component({
  selector: 'app-join-table',
  templateUrl: './joinTable.component.html',
  styleUrls: ['./joinTable.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class JoinTableComponent implements AfterViewInit, OnChanges {
  @Input() lobbies: StoredLobbyType[] = []
  displayedColumns: string[] = ['boardName', 'host', 'hostColor', 'saved', 'join'];
  dataSource = new MatTableDataSource(this.lobbies);

  constructor(private _liveAnnouncer: LiveAnnouncer, private db: DBService) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.lobbies);
  }

  announceSortChange(sortState: any) {
    let column = sortState.active;
    let msg = sortState.direction === "asc" ? `Sorted ${column} ascending` :
      sortState.direction === "desc" ? `Sorted ${column} descending` :
      "Sorting cleared"
    this._liveAnnouncer.announce(msg);
  }

  gameService = inject(GameService);
  router = inject(Router)
  user = inject(AuthService)
  join(id: string) {
    this.db.joinLobby(id).subscribe(matchId => {
      this.router.navigate(['/play/'+matchId.id]);
    });
  }
}