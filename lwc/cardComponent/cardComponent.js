import { LightningElement, api, wire } from 'lwc';
import {  fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class CardComponent extends LightningElement {

    @api cardaccount;
    @wire(CurrentPageReference) pageRef;
    showDetailsRecord(event){
        fireEvent(this.pageRef, 'showrecord', this.cardaccount.Id);
    }
}