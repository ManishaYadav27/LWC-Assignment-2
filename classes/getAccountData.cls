public with sharing class getAccountData {
    @AuraEnabled(Cacheable = true)
    public static list<Account> getAccounts(String accName, Integer queryLimit){
        String aName='%'+accName+'%';
        list<Account> acclst = [SELECT  Id, Name, Industry, Phone, Type From Account WHERE Name LIKE : aName Limit : queryLimit];
        return acclst; 
    }
    
    @AuraEnabled(Cacheable = true)
    public static list<Account> getAccountList(String accName, Integer queryLimit){
        String aName='%'+accName+'%';
        list<Account> acclst = [SELECT  Id, Name, Industry, Phone, Type , Website From Account WHERE Type LIKE : aName Limit : queryLimit];
        return acclst; 
    }
    
    
}