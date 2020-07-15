import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private contacts: Contact[];
    contactListChangedEvent = new Subject<Contact[]>();
    maxContactId: number;

    constructor(private http: HttpClient) { }

    //maybe remove
    sortAndSend() {
        this.contacts.sort((a, b) => a.name < b.name ? 1 : b.name > a.name ? -1 : 0);
        this.contactListChangedEvent.next(this.contacts.slice());
    }

    addContact(newContact: Contact) {
        if (!newContact) {
            return;
        }
        this.maxContactId++;
        newContact.id = this.maxContactId.toString();
        this.contacts.push(newContact);
        this.storeContacts();
    }

    deleteContact(contact: Contact) {
        if (!contact) {
            return;
        }
        const pos = this.contacts.indexOf(contact);
        if (pos < 0) {
            return;
        }

        this.contacts.splice(pos, 1);
        this.storeContacts();
    }

    getContact(id: string): Contact {
        for (const contact of this.contacts) {
            if (contact.id === id) {
                return contact;
            }
        }

        return null;
    }

    getContacts() {
        this.http.get('http://localhost:3000/contacts')
        .subscribe(
            (contacts: Contact[]) => {
                this.contacts = contacts;

                this.maxContactId = this.getMaxId();

                this.contacts.sort((a, b) => (a.name < b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                this.contactListChangedEvent.next(this.contacts.slice());
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    getMaxId(): number {
        let maxId = 0;
        for (const contact of this.contacts) {
            let currentId = parseInt(contact.id);

            if (currentId > maxId) {
                maxId = currentId;
            }
        }

        return maxId;
    }

    storeContacts() {
        let contacts =JSON.stringify(this.contacts);

        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http.put('https://wdd430-6499a.firebaseio.com/contacts.json', contacts, { headers: headers })
        .subscribe(
            () => {
                this.contactListChangedEvent.next(this.contacts.slice());
            }
        );
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }

        const pos = this.contacts.indexOf(originalContact);

        if (pos < 0) {
            return;
        }

        newContact.id = originalContact.id;

        this.contacts[pos] = newContact;

        const contactsListClone = this.contacts.slice();

        this.contactListChangedEvent.next(contactsListClone);
    }
}