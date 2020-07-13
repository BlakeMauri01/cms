import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
messages: Message[] = [];
subscription: Subscription

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.subscription = this.messageService.messageListChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages
      }
    );
    this.messageService.getMessages();
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
