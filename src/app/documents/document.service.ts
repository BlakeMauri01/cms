import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    documents: Document[];
    documentListChangedEvent = new Subject<Document[]>();
    maxDocumentId: number;

    constructor(private http: HttpClient) { }

    addDocument(newDocument: Document) {
        if (!newDocument) {
            return;
        }

        this.maxDocumentId++;

        newDocument.id = this.maxDocumentId.toString();

        this.documents.push(newDocument);

        this.storeDocuments();
    }

    deleteDocument(document: Document) {
        if (!document) {
            return;
        }


        const pos = this.documents.indexOf(document);

        if (pos < 0) {
            return;
        }

        this.documents.splice(pos, 1);

        this.storeDocuments();
    }

    getDocument(id: string): Document {
        for (const document of this.documents) {
            if (document.id === id) {
                return document;
            }
        }

        return null;
    }

    getDocuments() {
        this.http.get('http://localhost:3000/documents')
        .subscribe(
            (documents: Document[]) => {
                this.documents = documents;

                this.maxDocumentId = this.getMaxId();

                this.documents.sort((a, b) => (a.name < b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                this.documentListChangedEvent.next(this.documents.slice());
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    getMaxId(): number {
        let maxId = 0;
        for (const document of this.documents) {
            let currentId = parseInt(document.id);

            if (currentId > maxId) {
                maxId = currentId;
            }
        }

        return maxId;
    }

    storeDocuments() {
        let documents =JSON.stringify(this.documents);

        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http.put('http://localhost:3000/documents.json', documents, { headers: headers })
        .subscribe(
            () => {
                this.documentListChangedEvent.next(this.documents.slice());
            }
        );
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
            return;
        }

        const pos = this.documents.indexOf(originalDocument);

        if (pos < 0) {
            return;
        }

        newDocument.id = originalDocument.id;

        this.documents[pos] = newDocument;
    
        const documentsListClone = this.documents.slice();
        
        this.documentListChangedEvent.next(documentsListClone);
    }
}