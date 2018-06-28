({
	clickCancel : function(component, event, helper) {
		console.log('clickCancel');
        
        //close the modal
        var event = component.getEvent("renderEditStockModal");
        event.setParams({"render" : false});
        event.fire();
        
	},
    
    clickSave : function(component, event, helper) {
        console.log('clickSave');
        
        //get a controller action that will take the parameters and save the stock 
        
        //then close the modal
    }
})