import { Component, OnInit } from '@angular/core';
import {Contact} from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
contacts: Contact[] = [
  new Contact('1', 'Brother Barzee', 'barzeer@byui.edu', '208-496-3768', 'assets/images/barzeer.jpg', null),
  new Contact('2', 'Brother Thayne', 'thayneti@byui.edu', '208-496-3777', 'assets/images/thayneti.jpg', null),
  new Contact('3', 'Brother Thompson', 'thompsonda@byui.edu', '208-496-3739', 'assets/images/thompsonda.jpg', null)

];
  constructor() { }

  ngOnInit(): void {
  }

}
