({
	doInit : function(component, event, helper) {
		
        //get all the products in an map in JavaScript
        var action = component.get("c.queryBrawlMartProduct");
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var productMap = response.getReturnValue();
                
                
                //send the information to the harness component
                var event = component.getEvent("productInfo");
                event.setParams({"productMap" : productMap });
                event.fire();
            } else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);
	}, 
        
    selectCategoryChange : function(component, event, helper) {
        
        var selectedCategory = component.find("selectCategory").get("v.value");
        
		//send the product Category to the harness component
        var event0 = component.getEvent("productCategoryInfo");
        event0.setParams({"productCategory" : selectedCategory});
        event0.fire();
        
        var selectedProduct = component.find("selectProduct").get("v.value");
        
        
		//send the selectedProduct to the harness component
        var event1 = component.getEvent("selectedProductInfo");
        event1.setParams({"selectedProduct" : selectedProduct});
        event1.fire();
        
        
    },
    
    selectProductChange : function(component, event, helper) {
        
        
        var selectedProduct = component.find("selectProduct").get("v.value");
        
        
		//send the selectedProduct to the harness component
        var event0 = component.getEvent("selectedProductInfo");
        event0.setParams({"selectedProduct" : selectedProduct});
        event0.fire();
        
    },

    clickAddToStockListing : function(component, event, helper) {
        console.log('clickAddToStockListing');
        var bmp = event.getSource().get("v.value");
        var locationId = component.get("v.selectedLocationId");
        
        //insert the stock in APEX backend
        var action = component.get("c.addBrawlMartProductApex");
        action.setParams({"bmp" : bmp,
                          "locationId" : locationId});
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var stockToAdd = response.getReturnValue();
                
                
                //send the stock item to the harness component 
                //to update front end    
                var event0 = component.getEvent("addStockRecord");
                event0.setParams({"stockToAdd" : stockToAdd });
                event0.fire();
                
                //toast for success message 
                var toastEvent = $A.get("e.force:showToast");
        		toastEvent.setParams({
            		"title": "Success!",
        			"message": "The record has been added successfully.",
                    "type":"success"});
        		toastEvent.fire();
            } else {
                console.log("Failed with state: " + state);
                
                //toast for error message
                var pryOpen = response.getError();
                console.log('pryOpen');
                var myString = pryOpen[0].message;
                var andIndex = myString.search('&');
                var percentIndex = myString.search('%');
                var res = myString.substring(andIndex + 1, percentIndex);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
            		"title": "Failed!",
        			//"message": pryOpen[0].pageErrors[0].message,
                    "message": res,
                    //"message": "Product has already been stocked!",
                    "type":"error"});
        		toastEvent.fire();
            }
        });
        
        $A.enqueueAction(action);
    }
    
})