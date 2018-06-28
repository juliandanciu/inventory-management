({
	clickSearch : function(component, event, helper) {
		console.log('clickSearch');
        var searchKey = component.find("searchBar").get("v.value");
        var searchFilter = component.get("v.filterValue");
        var selectedLocationId = component.get("v.selectedLocationId");
        
        
        
        //call the apex controller and he should know what to do next
        var action = component.get("c.querySearchStockApex");
        action.setParams({"searchKey" : searchKey,
                          "searchFilter" :searchFilter[0],
                          "selectedLocationId" : selectedLocationId});
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                console.log('callBackResponse.getReturnValue()');
                console.log(response.getReturnValue());
                console.log('callBackResponse.getReturnValue()');
                var searchStockList = response.getReturnValue();
                
                var event = component.getEvent("searchStockInfo");
                event.setParams({"searchStockList" : searchStockList,
                                 "searchKey" : searchKey});
                event.fire();
            } else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
        
	},
    
    handleChange : function(component, event, helper) {
        
        var filterValue = event.getSource().get("v.value");
        
        component.set("v.filterValue", filterValue);
    }
})