@isTest
public class LightningControllerTest {

    @isTest
    static void queryStoreLocationsApexTest() {
        //create test data 
        TestLocationFactory.createStoreLocation();
        TestLocationFactory.createWarehouseLocation();
        
        //test 
        System.Test.startTest();
        List<Location__c> onlyStoreLocations = LightningController.queryStoreLocationsApex();
        System.Test.stopTest();
        
        //assert
        System.assertEquals(1, onlyStoreLocations.size());
    }
    
    @isTest
    static void queryBrawlMartProductTest() {
        //create test data 
        TestLocationFactory.createStoreLocation();
        Brawl_Mart_Product__c bmp1 = TestBrawlMartProductFactory.createProduct('test1', 0.88, 1.88, 'Meat & Seafood');
        Brawl_Mart_Product__c bmp2 = TestBrawlMartProductFactory.createProduct('test2', 0.99, 1.99, 'Floral');
        Brawl_Mart_Product__c bmp3 = TestBrawlMartProductFactory.createProduct('test3', 1.40, 2.40, 'Produce');
        Brawl_Mart_Product__c bmp4 = TestBrawlMartProductFactory.createProduct('test4', 1.80, 2.80, 'Baby');
        
        //test
        System.Test.startTest();
        Map<String, List<Brawl_Mart_Product__c>> myMap = LightningController.queryBrawlMartProduct();
        System.Test.stopTest();
        
        //assertions 
        
        System.assertEquals(bmp1, myMap.get('Meat & Seafood')[0]);
        System.assertEquals(bmp2, myMap.get('Floral')[0]);
        System.assertEquals(bmp3, myMap.get('Produce')[0]);
        System.assertEquals(bmp4, myMap.get('Baby')[0]);
        
    }
    
    @isTest
    static void queryStockApexTest() {
        //set up the test data
        Location__c location = TestLocationFactory.createStoreLocation();
        Brawl_Mart_Product__c bmp1 = TestBrawlMartProductFactory.createProduct('test1', 0.88, 1.88, 'Baby');
        Brawl_Mart_Product__c bmp2 = TestBrawlMartProductFactory.createProduct('test2', 0.89, 1.89, 'Baby');
        Stock__c stock1 = TestStockFactory.createStock(bmp1, location, 0, 0);
        Stock__c stock2 = TestStockFactory.createStock(bmp2, location, 0, 0);
        
        //test 
        System.Test.startTest();
        List<Stock__c> queriedStocks = LightningController.queryStockApex(location.Id);
        System.Test.stopTest();
        
        //assertions
        System.assertEquals(2, queriedStocks.size());
    }
    
    @isTest
    static void addBrawlMartProductApex() {
       	//set up the test data
        Location__c location = TestLocationFactory.createStoreLocation();
        Brawl_Mart_Product__c bmp1 = TestBrawlMartProductFactory.createProduct('test1', 0.88, 1.88, 'Baby');
        
        
        //test 
        System.Test.startTest();
        Stock__c addedStock = LightningController.addBrawlMartProductApex(bmp1, location.Id);
        System.Test.stopTest();
        
        //assertions
        List<Stock__c> assertStocks = [SELECT Id FROM Stock__c WHERE Brawl_Mart_Product__c = :bmp1.Id AND Location__c = :location.Id];
        
        System.assertEquals(1, assertStocks.size());
    }
    
    @isTest
    static void saveSelectedApex() {
        
        //set up the test data
        Location__c location = TestLocationFactory.createStoreLocation();
        Brawl_Mart_Product__c bmp1 = TestBrawlMartProductFactory.createProduct('test1', 0.88, 1.88, 'Baby');
        Brawl_Mart_Product__c bmp2 = TestBrawlMartProductFactory.createProduct('test2', 0.89, 1.89, 'Baby');
        Stock__c stock1 = TestStockFactory.createStock(bmp1, location, 0, 0);
        Stock__c stock2 = TestStockFactory.createStock(bmp2, location, 0, 0); 
        
        List<Stock__c> stocksToSave = new List<Stock__c>();
        stocksToSave.add(stock1);
        stocksToSave.add(stock2);
        
        //run the test 
        List<Stock__c> savedStocks = LightningController.saveSelectedApex(stocksToSave);
        
        //assertions
    }
    
    @isTest
    static void deleteSelectedApex() {
        
        //set up the test data
        Location__c location = TestLocationFactory.createStoreLocation();
        Brawl_Mart_Product__c bmp1 = TestBrawlMartProductFactory.createProduct('test1', 0.88, 1.88, 'Baby');
        Brawl_Mart_Product__c bmp2 = TestBrawlMartProductFactory.createProduct('test2', 0.89, 1.89, 'Baby');
        Stock__c stock1 = TestStockFactory.createStock(bmp1, location, 0, 0);
        Stock__c stock2 = TestStockFactory.createStock(bmp2, location, 0, 0);
        
        List<Stock__c> stocksToDelete = new List<Stock__c>();
        stocksToDelete.add(stock1);
        stocksToDelete.add(stock2);
        
        //run the test
        List<Stock__c> deletedStocks = LightningController.deleteSelectedApex(stocksToDelete);
        //assertions
        
        
    }
    
    @isTest
    static void querySearchStockApex() {
        //set up the test data
        Location__c location = TestLocationFactory.createStoreLocation();
        Brawl_Mart_Product__c bmp1 = TestBrawlMartProductFactory.createProduct('test1', 0.88, 1.88, 'Baby');
        Brawl_Mart_Product__c bmp2 = TestBrawlMartProductFactory.createProduct('check2', 0.89, 1.89, 'Baby');
        Brawl_Mart_Product__c bmp3 = TestBrawlMartProductFactory.createProduct('test3', 0.88, 1.88, 'Floral');
        Brawl_Mart_Product__c bmp4 = TestBrawlMartProductFactory.createProduct('check4', 0.89, 1.89, 'Floral');
        Stock__c stock1 = TestStockFactory.createStock(bmp1, location, 0, 0);
        Stock__c stock2 = TestStockFactory.createStock(bmp2, location, 0, 0);
        Stock__c stock3 = TestStockFactory.createStock(bmp3, location, 0, 0);
        Stock__c stock4 = TestStockFactory.createStock(bmp4, location, 0, 0);
        
        //test 
        System.Test.startTest();
        List<Stock__c> testNameSearchStocks = LightningController.querySearchStockApex('test', 'Brawl_Mart_Product__r.Name', location.Id);
        List<Stock__c> checkNameSearchStocks = LightningController.querySearchStockApex('check', 'Brawl_Mart_Product__r.Name', location.Id);
        List<Stock__c> floralCategorySearchStocks = LightningController.querySearchStockApex('floral', 'Brawl_Mart_Product__r.Category__c', location.Id);
        List<Stock__c> babyCategorySearchStocks = LightningController.querySearchStockApex('baby', 'Brawl_Mart_Product__r.Category__c', location.Id);
        System.Test.stopTest();
        
        //assertions
        System.assertEquals(stock1.Id, testNameSearchStocks[0].Id);
        System.assertEquals(stock3.Id, testNameSearchStocks[1].Id);
        
        System.assertEquals(stock2.Id, checkNameSearchStocks[0].Id);
        System.assertEquals(stock4.Id, checkNameSearchStocks[1].Id);
        
        System.assertEquals(stock4.Id, floralCategorySearchStocks[0].Id);
        System.assertEquals(stock3.Id, floralCategorySearchStocks[1].Id);
        
        System.assertEquals(stock2.Id, babyCategorySearchStocks[0].Id);
        System.assertEquals(stock1.Id, babyCategorySearchStocks[1].Id);
        
        
    }
}