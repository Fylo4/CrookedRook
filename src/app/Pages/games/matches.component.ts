import { Component } from '@angular/core';
import { MatchesTableComponent } from './matchesTable/matchesTable.component';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
  standalone: true,
  imports: [MatchesTableComponent],
})
export class MatchesComponent {

}
