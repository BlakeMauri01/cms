import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    messages: Message[] = [];
    messageListChangedEvent = new Subject<Message[]>();
    maxMessageId: number;

    constructor(private http: HttpClient) { }
    
    addMessage(newMessage: Message) {
        if (!newMessage) {
            return;
        }

        this.maxMessageId++;

        newMessage.id = this.maxMessageId.toString();

        this.messages.push(newMessage);

        this.storeMessages();
    }

    getMessage(id: string): Message {
        for (const message of this.messages) {
            if (message.id === id) {
                return message;
            }
        }

        return null;
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

    getMessages() {
        this.http.get('https://wdd430-6499a.firebaseio.com/messages.json')
        .subscribe(
            (messages: Message[]) => {
                this.messages = messages;

                this.maxMessageId = this.getMaxId();

                this.messages.sort((a, b) => (a.id < b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.messageListChangedEvent.next(this.messages.slice());
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    storeMessages() {
        let messages =JSON.stringify(this.messages);

        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http.put('https://wdd430-6499a.firebaseio.com/messages.json', messages, { headers: headers })
        .subscribe(
            () => {
                this.messageListChangedEvent.next(this.messages.slice());
            }
        );
    }    
}