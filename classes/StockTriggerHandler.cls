public class StockTriggerHandler {
	
    public static void defaultRetailPrice(List<Stock__c> triggerNew) {
        //defaut stock retail price is product suggested retail price 
        
        //collect all the stocks with null retail prices
        Set<Id> productIds0 = new Set<Id>();
        List<Stock__c> nullRetailPriceStockSubset = new List<Stock__c>();
        for(Stock__c stock : triggerNew) {
            if(stock.Retail_Price__c == NULL) {
                productIds0.add(stock.Brawl_Mart_Product__c);
                nullRetailPriceStockSubset.add(stock);
            }
        }
        Map<Id, Brawl_Mart_Product__c> prodId_prod_map0 = new Map<Id, Brawl_Mart_Product__c>([SELECT Id, Suggested_Retail_Price__c
                                                                  FROM Brawl_Mart_Product__c
                                                                  WHERE Id IN :productIds0]);
                
        for(Stock__c stock : nullRetailPriceStockSubset) {
            Brawl_Mart_Product__c bmp = prodId_prod_map0.get(stock.Brawl_Mart_Product__c);
            stock.Retail_Price__c = bmp.Suggested_Retail_Price__c;
        }
                
    }
    
    public static void productStockedOnlyOnceAtLocation(List<Stock__c> triggerNew) {
        //ensure that a product is not stocked at a particular location more than once
        Set<Id> parentLocationIds = new Set<Id>();
        Set<Id> parentBrawlMartProductIds = new Set<Id>();
        Set<String> concatenateIdsTrigger = new Set<String>();
        Set<String> concatenateIdsLandscape = new Set<String>();
        
        for(Stock__c stock : triggerNew) {
            parentLocationIds.add(stock.Location__c);
        }
        
        List<Stock__c> landscapeStocks = [SELECT Id, Brawl_Mart_Product__c, Location__c 
                                          FROM Stock__c
                                          WHERE Location__c IN :parentLocationIds];
        for(Stock__c stock : landscapeStocks) {
            String catIdLandscape = (String)stock.Brawl_Mart_Product__c + (String)stock.Location__c;
            concatenateIdsLandscape.add(catIdLandscape);
            System.debug(catIdLandscape);
        }
        
        for(Stock__c stock : triggerNew) {
            String catId = (String)stock.Brawl_Mart_Product__c + (String)stock.Location__c;
            concatenateIdsTrigger.add(catId);
            System.debug(catId);
            if(concatenateIdsLandscape.contains(catId)){
                stock.addError('&Product Stocked Only Once At Each Location!%');
                //throw new AuraHandledException('(Aura) Product Stocked Only Once At Each Location!');
            }
        }
        
        
    }
    
    public static void stockRetailPriceAtLeastProductWholesalePrice(List<Stock__c> triggerNew) {
        //ensure that the retail price on a given stock is at least the wholesale price of the product
        Set<Id> productIds = new Set<Id>();
        for(Stock__c stock : triggerNew) {
            productIds.add(stock.Brawl_Mart_Product__c);
        }
                
        Map<Id, Brawl_Mart_Product__c> prodId_prod_map = new Map<Id, Brawl_Mart_Product__c>([SELECT Id, Wholesale_Price__c
                                                          FROM Brawl_Mart_Product__c
                                                          WHERE Id IN :productIds]);
                
        //do the actual checking 
        for(Stock__c stock : triggerNew) {
            Brawl_Mart_Product__c bmp = prodId_prod_map.get(stock.Brawl_Mart_Product__c);
            if(stock.Retail_Price__c < bmp.Wholesale_Price__c) {
                stock.addError('The stock retail price must be greater than or equal to the wholesale retail price!');
                //throw new AuraHandledException('The stock retail price must be greater than or equal to the wholesale retail price!');
            } 
        }
    }
    
    public static void preventDeletionOfStockedQuantities(List<Stock__c> triggerOld) {
        System.debug('This is the before delete trigger');
        for(Stock__c stock : triggerOld) {
            if(stock.Current_Quantity__c > 0){
                stock.addError('Cannot delete stock that has a current stock quantity greater than zero!');
                //throw new AuraHandledException('Cannot delete stock that has a current stock quantity greater than zero!');
            } else if (stock.Current_Quantity__c < 0 ) {
                stock.addError('Cannot delete stock because it has a negative stock quantity!');
                //throw new AuraHandledException('Cannot delete stock because it has a negative stock quantity!');
            }
        }
    }
}