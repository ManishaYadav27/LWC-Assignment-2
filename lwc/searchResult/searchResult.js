import { LightningElement,api,wire } from 'lwc';
import getAccountList from '@salesforce/apex/getAccountData.getAccountList';
import { refreshApex } from '@salesforce/apex';
import { fireEvent,registerListener, unregisterAllListeners} from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
export default class SearchResult extends LightningElement {
@wire(CurrentPageReference) pageRef;
@api selectedItem;
@wire (getAccountList, {accName : '$selectedItem', queryLimit: 50}) mAccountList; // using wire to get records from Apex class, passing 2 variables as method parameters
connectedCallback() {
    console.log('connected callback in search result');
    registerListener('recordupdated', this.handleMessage, this);
}
//refreshing the component to load latest data 
handleMessage(myMessage) { 
    console.log('refreshed apex'); 
refreshApex(this.mAccountList);
}
}