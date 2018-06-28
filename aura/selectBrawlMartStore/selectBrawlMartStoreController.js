({
	queryStoreLocations : function(component, event, helper) {
		
        
        var action = component.get("c.queryStoreLocationsApex");
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var locationList = response.getReturnValue();
                
                var event = component.getEvent("locationInfo");
                event.setParams({"locationList" : locationList });
                event.fire();
            } else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);
	},
    
    selectLocationChange : function (component, event, helper) {
        
        
        var selectedLocationId = event.getSource().get("v.value");
        
        //go and query for all the stock objects for that particular store 
        var action = component.get("c.queryStockApex");
        action.setParams({ selectedLocationId : selectedLocationId });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                var childStocks = response.getReturnValue();
                
                var event = component.getEvent("childStocksInfo");
                event.setParams({"childStocks" : childStocks });
                event.fire();
            } else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);
        
        
        var event = component.getEvent("selectedLocationIdInfo");
        event.setParams({"selectedLocationId" : selectedLocationId});
        event.fire();
    }
})