import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class DBService {
    constructor(private http: HttpClient) {}
    getBoards() {
        return this.http.get("https://getallboards-mlqacmsctq-uc.a.run.app");
    }
}