import { LightningElement,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord,updateRecord , getFieldValue } from 'lightning/uiRecordApi';
import { fireEvent,registerListener, unregisterAllListeners} from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import Id from '@salesforce/schema/Account.Id';
import Name from '@salesforce/schema/Account.Name';
import Industry from '@salesforce/schema/Account.Industry';
import Type from '@salesforce/schema/Account.Type';
import Website from '@salesforce/schema/Account.Website';
import Phone from '@salesforce/schema/Account.Phone';
export default class LdsDetailComponent extends LightningElement {
    @track setEdit=true;
    @track hideButton=false;
    @track hideEdit=false;
    @track showMode=false;
    @wire(CurrentPageReference) pageRef;
    message;
    connectedCallback() {
        console.log('connected callback');
        registerListener('showrecord', this.handleMessage, this);
    }
   // below method will provide the current id of the record we are trying to pass to the component
    handleMessage(myMessage) {        
        this.message = myMessage;
        this.showMode=true;       
    }
    // getting data using wire service
    @wire(getRecord, { recordId: '$message', fields: [Name, Industry,Type,Website,Phone] })
    accountdata;
    //using data returned from wire service to set the flags for display and hide the content on UI 
    renderedCallback(){
        if( this.accountdata.data != undefined && this.accountdata.data != null && Object.keys(this.accountdata.data).length > 0 ){
            console.log('showMode--');
            this.showMode=true;
        }
    }
     get name() {
        return getFieldValue(this.accountdata.data, Name);
    }

    get industry() {
        return getFieldValue(this.accountdata.data, Industry);
    }

    get type(){
        return getFieldValue(this.accountdata.data, Type);
    }
    
    get website() {
        return getFieldValue(this.accountdata.data, Website);
    }
    get phone() {
        return getFieldValue(this.accountdata.data, Phone);
    }
    
   // this method executes after we click Edit button, the flags set in this method are used for rendering the elements on UI
    handleEdit(event) {
        //it will trigger on edit button
        this.setEdit = false;
        this.hideButton=true; 
        this.hideEdit=true;       
        console.log("reached here");
      }
      //this method is setting flag to send screen in viewmode 
      handleCancel(event){
        this.showMode=true;
        this.hideButton=false;
        this.setEdit = true;
        this.hideEdit=false; 
      }

// below method is called on click of save and the changes made by user are saved in the salesforce database
      updateAccount() {
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputFields) => {
                inputFields.reportValidity();
                return validSoFar && inputFields.checkValidity();
            }, true);

        if (allValid) {
            // Create the recordInput object
            const fields = {};
            fields[Id.fieldApiName] = this.message;
            fields[Name.fieldApiName] = this.template.querySelector("[data-field='name']").value;
            fields[Type.fieldApiName] = this.template.querySelector("[data-field='type']").value;
            fields[Industry.fieldApiName] = this.template.querySelector("[data-field='industry']").value;
            fields[Website.fieldApiName] = this.template.querySelector("[data-field='website']").value;
            fields[Phone.fieldApiName] = this.template.querySelector("[data-field='phone']").value;
            console.log('check names-'+ JSON.stringify(Name));
            const recordInput = { fields };
            updateRecord(recordInput)
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Account Updated Successfully',
                            variant: 'success'
                        })
                    );
                    fireEvent(this.pageRef, 'recordupdated', true);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
        else {
            // The form is not valid
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Something is wrong',
                    message: 'Check your input and try again.',
                    variant: 'error'
                })
             );
        }
    }
    disconnectCallback() {
        unregisterAllListeners(this);
    }
}