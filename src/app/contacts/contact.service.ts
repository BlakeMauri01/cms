import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    contactListChangedEvent = new Subject<Contact[]>();
    private contacts: Contact[] = [];
    constructor(private http: HttpClient) { }

    sortAndSend() {
        this.contacts.sort((a, b) => a.name < b.name ? 1 : b.name > a.name ? -1 : 0);
        this.contactListChangedEvent.next(this.contacts.slice());
    }

    addContact(contact: Contact) {
        if (!contact) {
            return;
        }

        contact.id = '';

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
            contact,
            { headers: headers }).subscribe((responseData) => {
                this.contacts.push(responseData.contact);
                this.sortAndSend();
            }
            );
    }

    deleteContact(contact: Contact) {
        if (!contact) {
            return;
        }

        const pos = this.contacts.findIndex(c => c.id === contact.id);

        if (pos < 0) {
            return;
        }

        this.http.delete('http://localhost:3000/contacts/' + contact.id)
            .subscribe(
                (response: Response) => {
                    this.contacts.splice(pos, 1);
                    this.sortAndSend();
                }
            );
    }

    getContact(id: string) {
        return this.http.get<{ message: string, contact: Contact[] }>('http://localhost:3000/contacts/' + id);
    }

    getContacts() {
        this.http.get<{ message: string, contacts: Contact[] }>('http://localhost:3000/contacts/')
            .subscribe(
                (responseData) => {
                    this.contacts = responseData.contacts;
                    this.sortAndSend();
                },
                (error: any) => {
                    console.log(error);
                }
            );
    }


    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }

        const pos = this.contacts.findIndex(c => c.id === originalContact.id);

        if (pos < 0) {
            return;
        }

        newContact.id = originalContact.id;

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put('http://localhost:3000/contacts/' + originalContact.id,
            newContact, { headers: headers })
            .subscribe(
                (response: Response) => {
                    this.contacts[pos] = newContact;
                    this.sortAndSend();
                }
            );
    }
}

/*     getMaxId(): number {
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
        let contacts = JSON.stringify(this.contacts);

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put('http://localhost:3000/contacts/', contacts, { headers: headers })
            .subscribe(
                () => {
                    this.contactListChangedEvent.next(this.contacts.slice());
                }
            );
    }
} */