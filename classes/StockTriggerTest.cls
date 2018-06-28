@isTest
public class StockTriggerTest {

    @isTest
    static void defaultRetailPriceTest() {
        
        //create the test code.
       	Brawl_Mart_Product__c bmp = TestBrawlMartProductFactory.createProduct('Test Product Floral', 0.88, 1.68, 'Floral');
        Location__c location = TestLocationFactory.createStoreLocation();
        
        System.Test.startTest();
        Stock__c stock = TestStockFactory.createStock1(bmp, location, 0, 0);
        List<Stock__c> stocks = new List<Stock__c>();
        stocks.add(stock);
        StockTriggerHandler.defaultRetailPrice(stocks);
        System.Test.stopTest();
        
        //check to make sure
      
        System.assertEquals(bmp.Suggested_Retail_Price__c, stock.Retail_Price__c);
        
        
        
        
    }
    
    @isTest
    static void productStockedOnlyOnceAtLocation() {
        
        //create the test data
        Brawl_Mart_Product__c bmp = TestBrawlMartProductFactory.createProduct('Test Product Floral', 0.88, 1.68, 'Floral');
        Location__c location = TestLocationFactory.createStoreLocation();
        Stock__c stock = TestStockFactory.createStock1(bmp, location, 0, 0);
        insert stock;
        //pre-asserts 
        List<Stock__c> preTestStockList = [SELECT Id FROM Stock__c];
        
        System.assertEquals(1, preTestStockList.size());
        
        //stock the same product again 
        System.Test.startTest();
        Stock__c stock1 = new Stock__c();
        
        stock1.Brawl_Mart_Product__c = bmp.Id;
        stock1.Location__c = location.Id;
        stock1.Quantity_Shipped_Weekly__c = 0;
        stock1.Current_Quantity__c = 0; 
        
        List<Stock__c> stocksList = new List<Stock__c>();
        stocksList.add(stock1);
        //Database.SaveResult result = Database.insert(stock1, false);
        StockTriggerHandler.productStockedOnlyOnceAtLocation(stocksList);
        
        System.Test.stopTest();
        
		//assert that there is still only one 
		List<Stock__c> postTestStockList = [SELECT Id FROM Stock__c];
        
        System.assertEquals(1, postTestStockList.size());
        
        
        
		        
    }
    
    @isTest
    static void stockRetailPriceAtLeastProductWholesalePrice_onInsert() {
        
        //create the test data
        Brawl_Mart_Product__c bmp = TestBrawlMartProductFactory.createProduct('Test Product Floral', 0.88, 1.68, 'Floral');
        Location__c location = TestLocationFactory.createStoreLocation();
        
        System.Test.startTest();
        Stock__c stock = new Stock__c();
        
        stock.Brawl_Mart_Product__c = bmp.Id;
        stock.Location__c = location.Id;
        stock.Quantity_Shipped_Weekly__c = 0;
        stock.Current_Quantity__c = 0;
        //this retail price is one penny cheaper than the wholesale price
        stock.Retail_Price__c = 0.87;
        List<Stock__c> stockList = new List<Stock__c>();
        stockList.add(stock);
        
        //Database.SaveResult result = Database.insert(stock, false);
        StockTriggerHandler.stockRetailPriceAtLeastProductWholesalePrice(stockList);
        System.Test.stopTest();
        
        //check the results 
        //error message check 
        
    }
    
    @isTest
    static void stockRetailPriceAtLeastProductWholesalePrice_onUpdate() {
        
        //create the test data 
        Brawl_Mart_Product__c bmp = TestBrawlMartProductFactory.createProduct('Test Product Floral', 0.88, 1.68, 'Floral');
        Location__c location = TestLocationFactory.createStoreLocation();
        Stock__c stock = TestStockFactory.createStock(bmp, location, 0, 0);
        
        System.Test.startTest();
        stock.Retail_Price__c = 0.87;
        Database.SaveResult result = Database.update(stock, false);
        System.Test.stopTest();
        
        //asserts
        //error message assertion
        System.assertEquals(false, result.isSuccess());
    }
    
    @isTest
    static void preventDeletionOfStockedQuantities() {
        
        //create the test data 
        Brawl_Mart_Product__c bmp = TestBrawlMartProductFactory.createProduct('Test Product Floral', 0.88, 1.68, 'Floral');
        Location__c location = TestLocationFactory.createStoreLocation();
        Stock__c stock = TestStockFactory.createStock(bmp, location, 0, 1);
        
        System.Test.startTest();
        Database.DeleteResult delResult = Database.delete(stock, false);
        System.Test.stopTest();
        
        //assert failure
        System.assertEquals(false, delResult.isSuccess());
        
        
    }
}