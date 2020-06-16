import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  constructor() { }

  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  
  documents: Document[] = [
    new Document('1', 'Document 1', 'Description 1', 'https://www.document.com', null),
    new Document('2', 'Document 2', 'Description 2', 'https://www.document.com', null),
    new Document('3', 'Document 3', 'Description 3', 'https://www.document.com', null),
    new Document('4', 'Document 4', 'Description 4', 'https://www.document.com', null)

  ];

  ngOnInit(): void {
  }
  onSelectedDocument
  (document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
