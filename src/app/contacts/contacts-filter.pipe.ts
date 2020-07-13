import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
  pure: false
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts: Contact[], term: string): any{
    let filteredContacts: Contact[] = [];

    if(term && term.length > 0){

    filteredContacts = contacts.filter(
      (contact: any) => contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }

  // if(filteredContacts.length < 1) {
  //    return filteredContacts;
  // }
  // else {
  //    return contacts; 
  //}
    return filteredContacts.length > 0 ? filteredContacts : contacts;
  }
}
