import { LightningElement ,track,wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import TYPE from '@salesforce/schema/Account.Type';
export default class PickListSearch extends LightningElement {
        @wire(getPicklistValues, { recordTypeId: '0120I000001HwEJ', fieldApiName: TYPE }) typeArray;
        @track selectedItem;
        @track onLoad = true;
        renderedCallback(){
            if(this.typeArray.data && this.onLoad){
                this.onLoad=false;
                this.selectedItem = this.typeArray.data.values[0].value;
            }
        }
        get options() {
            return this.typeArray.data? this.typeArray.data.values : {};   
                 
        }
    
        handleChange(event) {
            // Get the string of the "value" attribute on the selected option
            this.selectedItem = event.detail.value;
        }
    
        handleTypeSearch(){
            this.dispatchEvent(new CustomEvent('searchtermselected',{detail : this.selectedItem}));
        }
    
    
}