import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './Pages/lobby/lobby.component';
import { MatchesComponent } from './Pages/games/matches.component';
import { SearchComponent } from './Pages/search/search.component';
import { BoardComponent } from './Pages/board/board.component';
import { PlayComponent } from './Pages/play/play.component';

const routes: Routes = [
  {path: '', component: BoardComponent, pathMatch: 'full'},
  {path: 'board', component: BoardComponent},
  {path: 'lobby', component: LobbyComponent},
  {path: 'matches', component: MatchesComponent},
  {path: 'search', component: SearchComponent},
  {path: 'play/:id', component: PlayComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
