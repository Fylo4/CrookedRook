import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private index = 0;
  messageErrors: MessageError[] = [];

  addError(text: string) {
    this.messageErrors.push({
      id: this.index,
      text: text,
      isError: true
    });
    this.index ++;
  }

  addMessage(text: string) {
    this.messageErrors.push({
      id: this.index,
      text: text,
      isError: false
    });
    this.index ++;
  }

  deleteMessageError(id: number) {
    let i = this.messageErrors.findIndex(e => e.id === id);
    if (i >= 0)
      this.messageErrors.splice(i, 1);
    else
      this.addError("Message/Error id "+id+" not found");
  }

  handle(func: Function, ...params: any) {
    try {
      return func(...params);
    } catch (e: any) {
      let msg = "Unknown error";
      if ('message' in e) msg = e.message;
      this.addError(msg);
      console.error(e);
    }
  }

  constructor() { }
}
export interface MessageError {
  id: number;
  text: string;
  isError: boolean;
}