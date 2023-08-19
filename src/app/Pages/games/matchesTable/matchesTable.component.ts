import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-matches-table',
  templateUrl: './matchesTable.component.html',
  styleUrls: ['./matchesTable.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MatchesTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['boardName', 'opponent', 'myColor', 'turnNumber', 'turn', 'open'];
  dataRows = [
    {boardName: "chess", opponent: "Ristet", myColor: "black", turnNumber: "22", turn: "Theirs"},
  ];
  dataSource = new MatTableDataSource(this.dataRows);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
}