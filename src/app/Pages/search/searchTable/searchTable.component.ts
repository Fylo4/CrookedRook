import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-search-table',
  templateUrl: './searchTable.component.html',
  styleUrls: ['./searchTable.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SearchTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['boardCode', 'boardName', 'creator', 'date', 'size', 'plays', 'rating', 'open'];
  dataRows: SearchTableRow[] = [
    {boardCode: "chess", boardName: "Chess", creator: "TCRCanon", date: new Date(2023,8,14,8,36,30), size: {str: "64 (8x8)", count: 64}, plays: 10, rating: 4.5},
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
export interface SearchTableRow {
  boardCode: string,
  boardName: string,
  creator: string,
  date: Date,
  size: {str: string, count: number},
  plays: number,
  rating: number,
}