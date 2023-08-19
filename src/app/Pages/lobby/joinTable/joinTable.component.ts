import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

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
export class JoinTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['boardName', 'host', 'hostColor', 'saved', 'join'];
  dataRows = [
    {boardName: "fShogi", host: "fFylo", hostColor: "Random", private: "No", saved: "No"},
    {boardName: "aShogi", host: "aFylo", hostColor: "White", private: "No", saved: "Yes"},
    {boardName: "eShogi", host: "eFylo", hostColor: "Black", private: "Yes", saved: "No"},
    {boardName: "bShogi", host: "dFylo", hostColor: "Random", private: "Yes", saved: "No"},
    {boardName: "dShogi", host: "bFylo", hostColor: "Black", private: "No", saved: "Yes"},
    {boardName: "cShogi", host: "cFylo", hostColor: "White", private: "No", saved: "No"},
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