/**
 * @author Radialspark, Julian Danciu (JavaDoc)
 * @description Controller for the Lightning Independent Project Component 
 * @history
 *  1/16/2018 | jdanciu | created the class 
 */
public with sharing class LightningController {
	
    /**
     * @description queries for store locations 
     * @return List of locations 
     */
    @AuraEnabled //called by <c:selectBrawlMartStore/>
    public static List<Location__c> queryStoreLocationsApex(){
        //query all Brawl-Mart Store locations for 
        //<c:selectBrawlMartStore/> lightning component 
        
        RecordType recType = [SELECT Id, Name, DeveloperName FROM RecordType WHERE Name = 'Store' LIMIT 1];
        
        //Id storeRecordTypeId = Schema.SObjectType.Location__c.getRecordTypeInfosByName().get('Store').getRecordTypeId();
        //developer name 
        List<Location__c> storeList = [SELECT 
                                       	Id, 
                                       	RecordTypeId, 
                                       	Name,
                                       	(SELECT 
                                         	Id, 
                                         	Brawl_Mart_Product__c, 
                                         	Current_Quantity__c, 
                                         	Quantity_Shipped_Weekly__c, 
                                         	Retail_Price__c 
                                         FROM Stock__r)
                                       FROM Location__c 
                                       WHERE RecordType.DeveloperName = 'Store'];
        
        return storeList;
        
    }
    
    @AuraEnabled //gets the map of product to category subsets
    public static Map<String, List<Brawl_Mart_Product__c>> queryBrawlMartProduct() {
        //query for all products that Brawl-Mart offers
        
        List<Brawl_Mart_Product__c> productList = [SELECT 
                                                   		Name, 
                                                   		Category__c, 
                                                   		Suggested_Retail_Price__c, 
                                                   		Wholesale_Price__c
                                                   FROM Brawl_Mart_Product__c 
                                                   ORDER BY Category__c, Name];
        
        //create a set to hold all the possible categories
        Set<String> categorySet = new Set<String>();
        for(Brawl_Mart_Product__c bmp : productList) {
           	categorySet.add(bmp.Category__c);
        }
        
        //create the category to products map 
        Map<String, List<Brawl_Mart_Product__c>> category_productList_map = new Map<String, List<Brawl_Mart_Product__c>>();
        for(String category : categorySet){
            List<Brawl_Mart_Product__c> productListSubset = new List<Brawl_Mart_Product__c>();
            for(Brawl_Mart_Product__c bmp : productList) {
                if(category == bmp.Category__c) {
                    productListSubset.add(bmp);
                }
            }
            
            //fill the map 
            category_productList_map.put(category, productListSubset);
        }
        
        
        return category_productList_map;
        
    }
	
    /**
	 * @description queries all stocks for a given location
	 * @param selectedLocationId the id of the location
	 * @return List of stocks at the location
	 */
    @AuraEnabled //called by <c:selectBrawlMartStore/>
    public static List<Stock__c> queryStockApex(String selectedLocationId) {
        //this method is called upon selection of a store location
        //from the <c:selectBrawlMartStore/> component 
        
        List<Stock__c> childStocks = [SELECT 
                                      	Current_Quantity__c, 
                                      	Quantity_Shipped_Weekly__c, 
                                      	Retail_Price__c, 
                                      	Brawl_Mart_Product__r.Name, 
                                      	Brawl_Mart_Product__r.Category__c, 
                                      	Brawl_Mart_Product__r.Wholesale_Price__c, 
                                      	Brawl_Mart_Product__r.Suggested_Retail_Price__c
                                     FROM Stock__c
                                     WHERE Location__r.Id = :selectedLocationId
                                     ORDER BY Brawl_Mart_Product__r.Name];
        
        return childStocks;
    }
    
    @AuraEnabled //called by <c:productCatalog/> 
    public static Stock__c addBrawlMartProductApex(Brawl_Mart_Product__c bmp, Id locationId) {
        Stock__c stockToAdd = new Stock__c();
        
        
        stockToAdd.Brawl_Mart_Product__c = bmp.Id;
        stockToAdd.Location__c = locationId;
        stockToAdd.Quantity_Shipped_Weekly__c = 5;
        stockToAdd.Current_Quantity__c = 0;
        
        try{
            insert stockToAdd;
        } catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
        //insert stockToAdd;
        
        
        Stock__c newStock = [SELECT 
                                      	Current_Quantity__c, 
                                      	Quantity_Shipped_Weekly__c, 
                                      	Retail_Price__c, 
                                      	Brawl_Mart_Product__r.Name, 
                                      	Brawl_Mart_Product__r.Category__c, 
                                      	Brawl_Mart_Product__r.Wholesale_Price__c, 
                                      	Brawl_Mart_Product__r.Suggested_Retail_Price__c
                                     FROM Stock__c
                                     WHERE id = :stockToAdd.Id];
        
        return newStock;
    }
    
    @AuraEnabled
    public static List<Stock__c> saveSelectedApex(List<Stock__c> stocksToSave) {
        List<Database.SaveResult> svrList = Database.update(stocksToSave, false);
        Set<Id> successIds = new Set<Id>();
        for(Database.SaveResult svr : svrList) {
            if(svr.isSuccess()) {
                successIds.add(svr.getId());
            }
        }
        System.debug('svrList');
        System.debug(svrList);
        System.debug('successIds');
        System.debug(successIds);
        List<Stock__c> savedStocks = [SELECT 
                                      	Current_Quantity__c, 
                                      	Quantity_Shipped_Weekly__c, 
                                      	Retail_Price__c, 
                                      	Brawl_Mart_Product__r.Name, 
                                      	Brawl_Mart_Product__r.Category__c, 
                                      	Brawl_Mart_Product__r.Wholesale_Price__c, 
                                      	Brawl_Mart_Product__r.Suggested_Retail_Price__c
                                     FROM Stock__c
                                     WHERE Id IN :successIds
                                     ORDER BY Brawl_Mart_Product__r.Name];
        System.debug('what am I returning?');
        System.debug(stocksToSave);
        //return stocksToSave;
        return savedStocks;
        
        
    }
    
    @AuraEnabled
    public static List<Stock__c> deleteSelectedApex(List<Stock__c> stocksToDelete) {
        Set<Id> stocksToDeleteIds = new Set<Id>();
        for(Stock__c stock : stocksToDelete) {
            stocksToDeleteIds.add(stock.Id);
        }
        
        //you could have just returned the ids 
        //no, becuase you need the stock quantity prior to passing the ids 
        
        List<Stock__c> deletionList = [SELECT Id FROM Stock__c WHERE Id IN :stocksToDeleteIds];
        
        
        List<Database.DeleteResult> dbrList = Database.delete(deletionList, true);
        
        
        return deletionList;
        
        
        
        
    }
    
    @AuraEnabled
    public static List<Stock__c> querySearchStockApex(String searchKey, String searchFilter, Id selectedLocationId) {
        
        String queryStr = '%' + searchKey.trim() + '%';
        
        List<Stock__c> searchChildStocks = new List<Stock__c>();
        
        if(searchFilter == 'Brawl_Mart_Product__r.Name') {
            searchChildStocks = [SELECT 
                                   Current_Quantity__c, 
                                   Quantity_Shipped_Weekly__c, 
                                   Retail_Price__c, 
                                   Brawl_Mart_Product__r.Name, 
                                   Brawl_Mart_Product__r.Category__c, 
                                   Brawl_Mart_Product__r.Wholesale_Price__c, 
                                   Brawl_Mart_Product__r.Suggested_Retail_Price__c
                                 FROM Stock__c
                                 WHERE Location__r.Id = :selectedLocationId AND Brawl_Mart_Product__r.Name LIKE :queryStr 
                                 ORDER BY Brawl_Mart_Product__r.Name];
        } else if (searchFilter == 'Brawl_Mart_Product__r.Category__c') {
            searchChildStocks = [SELECT 
                                   Current_Quantity__c, 
                                   Quantity_Shipped_Weekly__c, 
                                   Retail_Price__c, 
                                   Brawl_Mart_Product__r.Name, 
                                   Brawl_Mart_Product__r.Category__c, 
                                   Brawl_Mart_Product__r.Wholesale_Price__c, 
                                   Brawl_Mart_Product__r.Suggested_Retail_Price__c
                                 FROM Stock__c
                                 WHERE Location__r.Id = :selectedLocationId AND Brawl_Mart_Product__r.Category__c LIKE :queryStr 
                                 ORDER BY Brawl_Mart_Product__r.Name];
        }
        
        
        return searchChildStocks;
    }
}