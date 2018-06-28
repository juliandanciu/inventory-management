({
	clickSaveSelected : function(component, event, helper) {
        console.log('clickedSaveSelected');
        
        //go and find all the current stock objects as they currently are
        var selectSingleArray = component.find("selectSingle");
        if(selectSingleArray == undefined) {
            return;
        } else if (selectSingleArray.length == undefined) {
            selectSingleArray = [selectSingleArray];
        }
        
        //collect all the ones that are checked
        var stocksToSave = []
        for(var i = 0; i < selectSingleArray.length; i++) {
            if(selectSingleArray[i].get("v.checked") == true) {
                stocksToSave.push(selectSingleArray[i].get("v.name"));
            }
        }
        console.log('stocksToSavewithLenght');
        console.log(stocksToSave);
        console.log(stocksToSave.length);
        console.log('stocksToSavewith Lenght');
        
        /* //front end filter
        var nameArray = [];
        for(var i = 0; i < stocksToSave.length; i++) {
            if(stocksToSave[i].Retail_Price__c < stocksToSave[i].Brawl_Mart_Product__r.Wholesale_Price__c) {
                nameArray.push(stocksToSave[i].Brawl_Mart_Product__r.Name);
            }
        }
        if(nameArray.length) {
            var messageList = '';
            for(var name of nameArray) {
                
                console.log(name);
                messageList = messageList + name;
            }
            var message = 'The following stock records were not saved because the retail price was cheaper than the wholesale price: ' + messageList;
            console.log(message);
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Failed!",
        		"message": message,
                "type":"error"});
        		toastEvent.fire();
            
            
        }
        if(nameArray.length == stocksToSave.length) {
            //all selected stocks are bad 
            return;
        } */
        
        //send this group of arrays to apex to update the database. 
        var action = component.get("c.saveSelectedApex");
        action.setParams({"stocksToSave" : stocksToSave});
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                console.log('the stock records were saved to the database successfully!');
                
                
                var savedStockList = response.getReturnValue();
                console.log('savedStockList update');
                console.log(savedStockList.length);
                var event0 = component.getEvent("savedStockInfo");
                event0.setParams({"savedStocks" : savedStockList });
                event0.fire();
                
                if(savedStockList.length == stocksToSave.length){
                    //make a succes toast 
                    //toast success
                	var toastEvent = $A.get("e.force:showToast");
        			toastEvent.setParams({
            			"title": "Success!",
        				"message": "All saves were successful!",
                    	"type":"success"});
        			toastEvent.fire();
                } else {
                    //still success but not all of them worked.
                    //which ones did not work?
                    var itemsToDisplayError = [];
                    var itemsToDisplaySuccess = [];
                    for(var i = 0; i < stocksToSave.length; i++) {
                        var wasSaved = false;
                        for(var j = 0; j < savedStockList.length; j++) {
                            if(stocksToSave[i].Id == savedStockList[j].Id) {
                                wasSaved = true;
                            }
                        }
                        console.log(stocksToSave[i].Brawl_Mart_Product__r.Name);
                        if(wasSaved == false){
                            itemsToDisplayError.push(stocksToSave[i].Brawl_Mart_Product__r.Name);
                        } else {
                            itemsToDisplaySuccess.push(stocksToSave[i].Brawl_Mart_Product__r.Name);
                        }
                    }
                    var errorMessageList = '';
                    var successMessageList = '';
                    for(var name of itemsToDisplayError) {
                        errorMessageList = errorMessageList + name;
                    }
                    for(var name of itemsToDisplaySuccess) {
                        successMessageList = successMessageList + name;
                    }
                    var errorMessage1 = "The following stock records were not saved because the retail price was cheaper than the wholesale price:" + errorMessageList;
                    var successMessage1 = "These records, however, were successful:" + successMessageList;
                    var toastEvent = $A.get("e.force:showToast");
                	toastEvent.setParams({
            			"title": "Failed!",
        				"message": errorMessage1 ,
                    	"type":"error"});
        			toastEvent.fire();
                    //success toast for those that made it
                    if(itemsToDisplaySuccess.length != 0) {
                        var toastEvent = $A.get("e.force:showToast");
        				toastEvent.setParams({
            				"title": "Success!",
                        	"message": successMessage1,
                    		"type":"success"});
        				toastEvent.fire();
                    }
                    
                }
                
                
            } else {
                console.log("Failed with state: " + state);
                //toast
                var pryOpen = response.getError();
                console.log('pryOpen');
                console.log(pryOpen);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
            		"title": "Failed!",
        			"message": pryOpen[0].pageErrors[0].message,
                    "type":"error"});
        		toastEvent.fire();
            }
        });
        
        $A.enqueueAction(action);
    },
    
    clickSaveAll : function(component, event, helper) {
        console.log('clickedSaveAll');
        
        //go and find all the current stock objects as they currently are
        var selectSingleArray = component.find("selectSingle");
        if(selectSingleArray == undefined) {
            return;
        } else if (selectSingleArray.length == undefined) {
            selectSingleArray = [selectSingleArray];
        }
        
        var stocksToSave = []
        for(var i = 0; i < selectSingleArray.length; i++) {
            stocksToSave.push(selectSingleArray[i].get("v.name"));
        }
        console.log('stocksToSave');
        console.log(stocksToSave);
        console.log('stocksToSave');
        
        //front end filter
        var nameArray = [];
        for(var i = 0; i < stocksToSave.length; i++) {
            if(stocksToSave[i].Retail_Price__c < stocksToSave[i].Brawl_Mart_Product__r.Wholesale_Price__c) {
                nameArray.push(stocksToSave[i].Brawl_Mart_Product__r.Name);
            }
        }
        if(nameArray.length) {
            var messageList = '';
            for(var name of nameArray) {
                messageList = messageList + name;
            }
            var message = 'The following stock records were not saved because the retail price was cheaper than the wholesale price: ' + messageList;
            console.log(message);
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Failed!",
        		"message": message,
                "type":"error"});
        		toastEvent.fire();
            
            
        } 
        
        if(nameArray.length == stocksToSave.length) {
            //all selected stocks are bad 
            return;
        }
        
        //send this group of arrays to apex to update the database. 
        var action = component.get("c.saveSelectedApex");
        action.setParams({"stocksToSave" : stocksToSave});
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                console.log('the stock records were saved to the database successfully!');
                
                var savedStockList = response.getReturnValue();
                
                var event0 = component.getEvent("savedStockInfo");
                event0.setParams({"savedStocks" : savedStockList });
                event0.fire();
                //
                //toast success
                var toastEvent = $A.get("e.force:showToast");
        		toastEvent.setParams({
            		"title": "Success!",
        			"message": "Save was successful!.",
                    "type":"success"});
        		toastEvent.fire();
            } else {
                console.log("Failed with state: " + state);
                //toast
                var pryOpen = response.getError();
                console.log('pryOpen');
                console.log(pryOpen);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
            		"title": "Failed!",
        			"message": pryOpen[0].pageErrors[0].message,
                    "type":"error"});
        		toastEvent.fire();
                
            }
        });
        
        $A.enqueueAction(action);
    },
    
    clickDeleteSelected : function(component, event, helper) {
        console.log('clickedDeleteSelected');
        
        //go and find all the current stock objects as they currently are
        var selectSingleArray = component.find("selectSingle");
        if(selectSingleArray == undefined) {
            return;
        } else if (selectSingleArray.length == undefined) {
            selectSingleArray = [selectSingleArray];
        }
        
        //collect the checked ones
        var stocksToDelete = []
        for(var i = 0; i < selectSingleArray.length; i++) {
            if(selectSingleArray[i].get("v.checked") == true) {
                stocksToDelete.push(selectSingleArray[i].get("v.name"));
            }
        }
        console.log('stocksToDelete');
        console.log(stocksToDelete);
        console.log('stocksToDelete');
        
        //front end filter
        var nameCollection = [];
        for(var i = 0 ; i < stocksToDelete.length; i++) {
            if(stocksToDelete[i].Current_Quantity__c) { 
            	nameCollection.push(stocksToDelete[i].Brawl_Mart_Product__r.Name);
            }  
        }
        
        if(nameCollection.length) {
            var messageList = '';
            for(var name of nameCollection) {
                messageList = messageList + name;
            }
            var message = 'The following elements are stocked and you cannot delete them: ' + messageList;
            console.log(message);
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Failed!",
        		"message": message,
                "type":"error"});
        		toastEvent.fire();
            return;
            
        } 
        
        //send this group of arrays to apex to update the database. 
        var action = component.get("c.deleteSelectedApex");
        action.setParams({"stocksToDelete" : stocksToDelete});
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state == "SUCCESS"){
                console.log('the stock records were deleted from the database successfully!');
                var deletedStocks = response.getReturnValue();
                console.log('deletedStocks');
                console.log(deletedStocks);
                console.log('deletedStocks');
                var event = component.getEvent("deletedStocksInfo");
                event.setParams({"deletedStocks" : deletedStocks });
                event.fire();
                
                //toast success
                var toastEvent = $A.get("e.force:showToast");
        		toastEvent.setParams({
            		"title": "Success!",
        			"message": "The record has been successfully deleted!",
                    "type":"success"});
        		toastEvent.fire();
            } else {
                console.log("Failed with state: " + state);
                console.log(response.getError()[0].pageErrors[0].message);
                
            }
        });
        
        $A.enqueueAction(action);
    }, 
    
    clickSelectSingle : function(component, event, helper) {
        console.log('clickSelectSingle');
        var selectSingleAll = component.find("selectSingle");
        if (selectSingleAll == undefined) {
            console.log('the entity is undefined: dont do anything');
            return;
        } else if (selectSingleAll.length == undefined) {
            selectSingleAll = [selectSingleAll];
        }
        var selectAllCheckbox = component.find("selectAll");
        console.log('@@@@@@@@@@@@');
        console.log(selectAllCheckbox);
        console.log('@@@@@@@@@@@@@@@@@');
        var counter = 0;
        console.log(selectSingleAll.length);
        for(var i = 0; i < selectSingleAll.length; i++) {
            if (selectSingleAll[i].get("v.checked") == true) {
                counter++;
            }
        }
        console.log('counter');
        console.log(counter);
        console.log('counter');
        if(counter == selectSingleAll.length) {
            selectAllCheckbox.set("v.checked", true);
        } else {
            selectAllCheckbox.set("v.checked", false);
        }
        
        
        //all all singles now checked as a result of this click?
        
        
        var stockId = event.getSource().get("v.name").Id;
        console.log(stockId);
        
        var event0 = component.getEvent("sendStockIdUpToHarness");
       	event0.setParams({"stockId" : stockId });
        event0.fire();
    },
    
    clickSelectAll : function(component, event, helper) {
        console.log('clickSelectAll');
        
        //send an event to inform the parent component that the select all was clicked
        var checkedState = event.getSource().get("v.checked");
        console.log('checkedState');
        console.log(checkedState);
        console.log('checkedState');
        //render this again
        var selectSingleAll = component.find("selectSingle");
        if (selectSingleAll == undefined) {
            console.log('the entity is undefined: dont do anything');
            return;
        } else if (selectSingleAll.length == undefined) {
            selectSingleAll = [selectSingleAll];
        }
        
        console.log('selectSingleAll');
        console.log(selectSingleAll);
        console.log(selectSingleAll[0]);
        //take care of the user interface 
        if(checkedState){
            //go back and check all the singles that have not been checked yet
            for(var i = 0; i < selectSingleAll.length ; i++) {
                if(selectSingleAll[i].get("v.checked") != true) {
                    selectSingleAll[i].set("v.checked", true);
                }
            }
        } else {
            //go to the user interface and uncheck everything
            for(var i = 0; i < selectSingleAll.length ; i++) {
                if(selectSingleAll[i].get("v.checked") != false) {
                    selectSingleAll[i].set("v.checked", false);
                }
            }
        }
        
        var allStockIdsArray = [];
        
        
        
        //load up the allStockIdsArray 
        
        for(var i = 0; i < selectSingleAll.length; i++) {
            allStockIdsArray.push(selectSingleAll[i].get("v.name").Id);
        }
        
        
        
        var event0 = component.getEvent("clickSelectAll");
        event0.setParams({"checkedState" : checkedState,
                          "allStockIdsArray" : allStockIdsArray});
        event0.fire();
                          
        
       
    },
    
    /*clickIconShipQuantity : function(component, event, helper) {
        console.log('you clicked one of the shipping quantity icons!');
        
        //what is this eventSource???
        //is it the buttonIcon? i think it is? I am going to assume that it is the button icon 
        var stock = event.getSource().get("v.value");
        console.log(stock);
        
    },
    
    clickIconRetailPrice : function(component, event, helper) {
        console.log('you click on of the retail price buttons');
        var eventSource = event.getSource();
    }, */
    
    resetListView : function(component, event, helper) {
        console.log('i was living in a past life//did you say it in a hushed tone?');
       	var event0 = component.getEvent("resetListView");
        event0.fire();
    }
})