@isTest
public class TestBrawlMartProductFactory {

    public static Brawl_Mart_Product__c createProduct(String name, Decimal wholesalePrice, Decimal suggestedRetailPrice, String category) {
        
        Brawl_Mart_Product__c product = new Brawl_Mart_Product__c();
        
        product.Name = name;
        product.Wholesale_Price__c = wholesalePrice;
        product.Suggested_Retail_Price__c = suggestedRetailPrice; 
        product.Category__c = category;
        
        insert product;
        
        Brawl_Mart_Product__c product1 = [SELECT Id, Name, Wholesale_Price__c, Suggested_Retail_Price__c, Category__c
                                          FROM Brawl_Mart_Product__c
                                          WHERE Id = :product.Id];
        return product1;
    }
}