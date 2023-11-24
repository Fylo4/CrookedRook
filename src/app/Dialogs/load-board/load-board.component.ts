import { Component, OnInit } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { BoardLoadingService } from 'src/app/Services/board-loading.service';
import { GameService } from 'src/app/Services/game.service';
import { ErrorService } from 'src/app/Services/error.service';
var Hjson = require('hjson');

@Component({
    selector: 'app-load-board',
    templateUrl: './load-board.component.html',
    styleUrls: ['./load-board.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        CommonModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
    ],
})
export class LoadBoardComponent implements OnInit {
    loadFrom: string = 'canon';
    canonSelector: any;
    errorStr: string = '';

    fileName = '';
    extension = '';
    reader = new FileReader();
    file: any = undefined;
    importCode: string = "";

    constructor(
        public dialogRef: MatDialogRef<LoadBoardComponent>,
        public loader: BoardLoadingService,
        public g: GameService,
        private error: ErrorService
    ) {}
    ngOnInit(): void {
        this.reader.onload = (e: any) => {
            let data = String.fromCharCode.apply(
                null,
                Array.from(new Uint8Array(e.target.result))
            );
            let fileResult: any;
            if (this.extension === 'hjson') {
                fileResult = Hjson.parse(data);
                // console.log("Hjson imports aren't implemented yet");
                // return;
            }
            else {
                fileResult = this.error.handle(JSON.parse, data);
            }
            if (fileResult)
                this.error.handle(this.g.game.startFromJson, fileResult, undefined, "file");
        };
    }

    closeModal() {
        this.dialogRef.close();
    }
    load() {
        if (this.loadFrom === 'canon') {
            let x = this.loader.getFromName(this.canonSelector);
            if (!x) {
                this.errorStr = 'Board not found';
                return;
            }
            this.error.handle(this.g.game.startFromJson, x.value, undefined, "canon");
            this.dialogRef.close();
        } else if (this.loadFrom === 'file') {
            if (this.file != undefined) {
              this.reader.readAsArrayBuffer(this.file);
            }
            this.dialogRef.close();
        } else if (this.loadFrom === 'import') {
            this.error.handle(this.g.game.importHistory, this.importCode);
            this.dialogRef.close();
        }
    }
    loadRandom() {
        this.error.handle(this.g.game.startFromJson, this.loader.getRandomBoard().value, undefined, "canon");
        this.dialogRef.close();
    }

    onFileSelected() {
        const inputNode: any = document.querySelector('#file');

        let n = inputNode.files[0].name.toLowerCase();
        if (n.endsWith('.hjson') || n.endsWith('.json')) {
            this.fileName = inputNode.files[0].name.split('.')[0];
            if (this.fileName === '') this.fileName = 'no-name';
            this.extension = n.endsWith('.hjson') ? 'hjson' : 'json';
            this.file = inputNode.files[0];
        } else {
            this.errorStr =
                'File not recognized, please select a .json or .hjson file';
        }
    }
}
