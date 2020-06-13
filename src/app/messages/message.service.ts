import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    messages: Messages[] = [];
    contactSelectedEvent = new EventEmitter<Message>();

    constructor() {
        this.messages = MOCKMESSAGES;
    }

    getContact(id: string): Message {
        for (const contact of this.messages) {
            if (contact.id === id) {
                return contact;
            }
        }

        return null;
    }

    getContacts(): Message[] {
        return this.messages.slice();
    }
}