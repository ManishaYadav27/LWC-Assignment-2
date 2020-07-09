import { LightningElement,track } from 'lwc';

export default class RootParent extends LightningElement {
 @track searchTermFromEvent;
    handleSearchSelectEvent(event){
        this.searchTermFromEvent= event.detail;
    }
}