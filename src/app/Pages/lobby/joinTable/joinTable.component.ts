import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DBService } from 'src/app/Services/Firebase/db.service';
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

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: any) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    let column = sortState.active;
    let msg = sortState.direction === "asc" ? `Sorted ${column} ascending` :
      sortState.direction === "desc" ? `Sorted ${column} descending` :
      "Sorting cleared"
    this._liveAnnouncer.announce(msg);
  }
  join(id: string) {
    this.db.joinLobby(id).subscribe({
      next: v => console.log(v),
      error: e => console.error(e)
    });
  }
}