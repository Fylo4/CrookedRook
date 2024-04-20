import { Component } from '@angular/core';
import { MatchesTableComponent } from './matchesTable/matchesTable.component';
import { DBService } from 'src/app/Services/Firebase/db.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
  standalone: true,
  imports: [MatchesTableComponent],
})
export class MatchesComponent {
  constructor(private db: DBService) {
    this.db.getMyMatches().subscribe({
      next: v => console.log(v),
      error: e => console.error(e),
    })
  }
}
