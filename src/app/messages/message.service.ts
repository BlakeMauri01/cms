import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    messages: Message[] = [];
    messageChangeEvent = new EventEmitter<Message[]>();
    maxMessageId: number;

    constructor(private http: HttpClient) { }

    getMessage(id: string): Message {
        for (const message of this.messages) {
            if (message.id === id) {
                return message;
            }
        }

        return null;
    }

    getMessages() {
        this.http.get('https://wdd430-6499a.firebaseio.com/messages.json')
        .subscribe(
            (messages: Message[]) => {
                this.messages = messages;

                this.maxMessageId = this.getMaxId();

                this.messages.sort((a, b) => (a.id < b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.messageChangeEvent.next(this.messages.slice());
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    getMaxId(): number {
        let maxId = 0;
        for (const message of this.messages) {
            let currentId = parseInt(message.id);

            if (currentId > maxId) {
                maxId = currentId;
            }
        }

        return maxId;
    }

    storeMessages() {
        let messages =JSON.stringify(this.messages);

        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http.put('https://wdd430-6499a.firebaseio.com/messages.json', messages, { headers: headers })
        .subscribe(
            () => {
                this.messageChangeEvent.next(this.messages.slice());
            }
        );
    }

    addMessage(message: Message) {
        this.messages.push(message);
        this.messageChangeEvent.emit(this.messages.slice());
    }
    
}