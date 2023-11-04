import { Component, OnInit } from '@angular/core';
import { SearchTableComponent } from './searchTable/searchTable.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { DBService } from 'src/app/Services/Firebase/db.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    SearchTableComponent,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class SearchComponent implements OnInit {

  constructor(public db: DBService) {}

  ngOnInit() {
    this.db.getBoards().subscribe((value) => {
      console.log("Boards: ")
      console.log(value);
    })
  }
}
