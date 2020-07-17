import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    documentListChangedEvent = new Subject<Document[]>();
    private documents: Document[];
    constructor(private http: HttpClient) { }

    sortAndSend() {
        this.documents.sort((a, b) => a.name < b.name ? 1 : b.name > a.name ? -1 : 0);
        this.documentListChangedEvent.next(this.documents.slice());
    }

    addDocument(document: Document) {
        if (!document) {
            return;
        }

        document.id = '';

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
            document,
            { headers: headers }).subscribe((responseData) => {
                this.documents.push(responseData.document);
                this.sortAndSend();
            }
            );
    }

    deleteDocument(document: Document) {
        if (!document) {
            return;
        }

        const pos = this.documents.findIndex(c => c.id === document.id);

        if (pos < 0) {
            return;
        }

        this.http.delete('http://localhost:3000/documents/' + document.id)
            .subscribe(
                (response: Response) => {
                    this.documents.splice(pos, 1);
                    this.sortAndSend();
                }
            );
    }

    getDocument(id: string) {
        return this.http.get<{ message: string, document: Document[] }>('http://localhost:3000/documents/' + id);
    }

    getDocuments() {
        this.http.get<{ message: string, documents: Document[] }>('http://localhost:3000/documents/')
            .subscribe(
                (responseData) => {
                    this.documents = responseData.documents;
                    this.sortAndSend();
                },
                (error: any) => {
                    console.log(error);
                }
            );
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
            return;
        }

        const pos = this.documents.findIndex(c => c.id === originalDocument.id);

        if (pos < 0) {
            return;
        }

        newDocument.id = originalDocument.id;

        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put('http://localhost:3000/documents/' + originalDocument.id,
            newDocument, { headers: headers })
            .subscribe(
                (response: Response) => {
                    this.documents[pos] = newDocument;
                    this.sortAndSend();
                }
            );
    }
}

/* getMaxId(): number {
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
} */