import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './Pages/main/main.component';
import { LobbyComponent } from './Pages/lobby/lobby.component';
import { MatchesComponent } from './Pages/games/matches.component';
import { SearchComponent } from './Pages/search/search.component';

const routes: Routes = [
  {path: '', redirectTo: 'board', pathMatch: 'full'},
  {path: 'board', component: MainComponent},
  {path: 'lobby', component: LobbyComponent},
  {path: 'matches', component: MatchesComponent},
  {path: 'search', component: SearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
