import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id) {
        this.editMode = false;
        return;
      }

      this.contactService.getContact(this.id)
      .subscribe(contactData => {
        this.originalContact = contactData.contact;

        if(!this.originalContact) {
          return;
        }

        this.editMode = true;
        this.contact =JSON.parse(JSON.stringify(this.originalContact));

        if(
          this.originalContact.group &&
          this.originalContact.group.length > 0
        ) {
          this.groupContacts = JSON.parse(
            JSON.stringify(this.originalContact.group)
          )
        }
      });
    });

  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      '',
      value.id,
      value.name,
      value.email,
      value.imageUrl,
      this.groupContacts
    );

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(i: number) {
    if (i < 0 || i >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(i, 1);
  }
}
