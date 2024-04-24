import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { CreateLobbyType, MatchType, StoredLobbyType } from "src/types/types";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class DBService {
    constructor(private http: HttpClient, private authService: AuthService) {}
    baseUrl = "https://us-central1-crooked-rook.cloudfunctions.net/";

    getBoard(name: string) {
        return this.http.get<any>(this.baseUrl+"nonauth/board/"+name, this.authService.getAuthHeader());
    }
    postBoard(board: any, code: string) {
        return this.http.post(this.baseUrl+'auth/board', 
        {board, code},
        this.authService.getAuthHeader());
    }
    createLobby(data: CreateLobbyType) {
        return this.http.post(this.baseUrl+"auth/lobby", {data}, this.authService.getAuthHeader());
    }
    getPublicLobbies() {
        return this.http.get<StoredLobbyType[]>(this.baseUrl+"auth/lobbies", this.authService.getAuthHeader());
    }
    joinLobby(id: string): Observable<{id: string}> {
        return this.http.get<{id: string}>(this.baseUrl+"auth/joinLobby/"+id, this.authService.getAuthHeader());
    }
    getMyMatches() {
        return this.http.get(this.baseUrl+"auth/matches/", this.authService.getAuthHeader());
    }
    makeMultiplayerMove(data: {matchId: string, src_x: number, src_y: number, dst_x: number, dst_y: number, promotion?: number | undefined}) {
        return this.http.post(this.baseUrl+"auth/move/", {data}, this.authService.getAuthHeader());
    }
}