@isTest
public class TestStockFactory {

    public static Stock__c createStock(Brawl_Mart_Product__c bmp, Location__c location, Integer quantityShippedWeekly, Integer currentQuantity) {
        Stock__c stock = new Stock__c();
        
        stock.Brawl_Mart_Product__c = bmp.Id;
        stock.Location__c = location.Id;
        stock.Quantity_Shipped_Weekly__c = quantityShippedWeekly;
        stock.Current_Quantity__c = currentQuantity; 
        
        
        insert stock;
        
        Stock__c stock1 = [SELECT Id, Brawl_Mart_Product__c, Location__c, Quantity_Shipped_Weekly__c, Current_Quantity__c, Retail_Price__c
                           FROM Stock__c
                           WHERE Id = :stock.Id];
        
        return stock1;
        
        
    }
    
    public static Stock__c createStock1(Brawl_Mart_Product__c bmp, Location__c location, Integer quantityShippedWeekly, Integer currentQuantity) {
        Stock__c stock = new Stock__c();
        
        stock.Brawl_Mart_Product__c = bmp.Id;
        stock.Location__c = location.Id;
        stock.Quantity_Shipped_Weekly__c = quantityShippedWeekly;
        stock.Current_Quantity__c = currentQuantity; 
        
        
        //insert stock;
        
        /*Stock__c stock1 = [SELECT Id, Brawl_Mart_Product__c, Location__c, Quantity_Shipped_Weekly__c, Current_Quantity__c, Retail_Price__c
                           FROM Stock__c
                           WHERE Id = :stock.Id]; */
        
        return stock;
        
        
    }
}