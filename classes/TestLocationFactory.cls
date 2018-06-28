@isTest
public class TestLocationFactory {

    public static Location__c createStoreLocation() {
        Id storeRecordTypeId = Schema.SObjectType.Location__c.getRecordTypeInfosByName().get('Store').getRecordTypeId();
        
        Location__c sLocation = new Location__c();
        sLocation.Name = 'Test Store Location, VA';
        sLocation.RecordTypeId = storeRecordTypeId;
        
        insert sLocation;
        
        return sLocation;
    }
    
    public static Location__c createWarehouseLocation() {
        Id warehouseRecordTypeId = Schema.SObjectType.Location__c.getRecordTypeInfosByName().get('Warehouse').getRecordTypeId();
        
        Location__c wLocation = new Location__c();
        wLocation.Name = 'Test Warehouse Location, VA';
        wLocation.RecordTypeId = warehouseRecordTypeId;
        
        insert wLocation;
        
        return wLocation;
    }
}