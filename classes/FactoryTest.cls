@isTest
public class FactoryTest {
	
    @isTest
    static void allFactoryTest() {
        
        System.Test.startTest();
        Brawl_Mart_Product__c bmp = TestBrawlMartProductFactory.createProduct('Test Test', 0.88, 1.88, 'Baby');
        Location__c store = TestLocationFactory.createStoreLocation();
        Location__c warehouse = TestLocationFactory.createWarehouseLocation();
        Stock__c mystock = TestStockFactory.createStock(bmp, store, 0, 0);
        
        System.Test.stopTest();
        //query and get the id's to match
        
        //WHY IS THIS NOT WORKING??? ASK DURING THE REVIEW! 
    }
}