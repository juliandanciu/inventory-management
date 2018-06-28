({
	handleLocationInfo : function(component, event, helper) {
        var locationList = event.getParam("locationList");
        component.set("v.locationList" , locationList);
        
	},
    
    handleProductInfo : function(component, event, helper) {
        
        var productMap = event.getParam("productMap");
        
        var mapKeys = [];
        for(var key in productMap) {
            mapKeys.push(key);
        }
        
        component.set("v.productMap", productMap);
        component.set("v.categories", mapKeys);        
    }, 

    handleProductCategoryInfoEvent : function(component, event, helper) {
        
        var productCategory = event.getParam("productCategory");
        
        component.set("v.selectedCategory" , productCategory); 
        //use the productCategory attained from the event with the map to get the productSubset
        var productMap = component.get("v.productMap");
        var productSubset = productMap[productCategory];
        
        
		
        component.set("v.productSubset", productSubset);
        
    },
    
    handleSelectedProductInfo : function(component, event, helper) {
        
        var selectedProductName = event.getParam("selectedProduct");
        
        
        var productCategory = component.get("v.selectedCategory");
        
        
        //get the whole object from the map 
        var productMap = component.get("v.productMap");
        var productSubset = productMap[productCategory];
        
       	
        var productObject;
        for(var i of productSubset) {
            if(i.Name == selectedProductName) {
                productObject = i;
            }
        }
        
        component.set("v.selectedProduct", productObject);
        
    },
    
    handleSelectedLocationIdInfo : function(component, event, helper) {
        
        var selectedLocationId = event.getParam("selectedLocationId");
        component.set("v.selectedLocationId", selectedLocationId);
    },
    
    handleChildStocksInfo : function(component, event, helper) {
        
        var childStocks = event.getParam("childStocks");
        
        component.set("v.childStocks", childStocks);
        component.set("v.displayChildStocks", childStocks);
        //reset the selected stocks:
        var selectedStockIdArray = component.get("v.selectedStockIdArray");
        selectedStockIdArray = [];
        component.set("v.selectedStockIdArray", selectedStockIdArray);
        
    },
    
    handleSendStockIdEvent : function(component, event, helper) {
        
        
        var selectedStockIdArray = component.get("v.selectedStockIdArray");
        var stockId = event.getParam("stockId");
        
        var removalIndex = -1;
        for(var i = 0; i < selectedStockIdArray.length; i++) {
            if (selectedStockIdArray[i] == stockId) {
                //we need to remove it from the array 
                removalIndex = i;
                break;
            } 
        }
        
        if(removalIndex == -1) {
            //we need to add the selected id to the end of the array
            selectedStockIdArray.push(stockId);
        } else {
            selectedStockIdArray.splice(removalIndex, 1);
        }
       
        
        
        
        
        
        //make this change today 
        component.set("v.selectedStockIdArray", selectedStockIdArray);
    }, 
    
    handleClickSelectAllEvent : function(component, event, helper) {
        
        var checkedState = event.getParam("checkedState");
        var allStockIdsArray = event.getParam("allStockIdsArray");
        var selectedStockIdArray = component.get("v.selectedStockIdArray"); 
        
        
        if(checkedState) {
            
            //put all the ids in the data array
            selectedStockIdArray = allStockIdsArray;
            component.set("v.selectedStockIdArray", selectedStockIdArray);
            
             
        } else {
            
            //remove all the ids from the data array 
            selectedStockIdArray = [];
            component.set("v.selectedStockIdArray", selectedStockIdArray);
        }
        
        
        
    }, 
    
    handleAddStockRecordEvent : function(component, event, helper) {
        
        var stockToAdd = event.getParam("stockToAdd");
        var childStocks = component.get("v.childStocks");
        if (childStocks == undefined) {
            
            return;
        } else if (childStocks.length == undefined) {
            childStocks = [childStocks];
        }
        childStocks.unshift(stockToAdd);
        
        var displayChildStocks = component.get("v.displayChildStocks");
        if (displayChildStocks == undefined) {
            
            return;
        } else if (displayChildStocks.length == undefined) {
            displayChildStocks = [displayChildStocks];
        }
        displayChildStocks.unshift(stockToAdd);
        
        component.set("v.childStocks", childStocks);
        component.set("v.displayChildStocks", displayChildStocks);
        
        
    },
    
    handleSearchStockInfoEvent : function(component, event, helper) {
        
        var searchStockList = event.getParam("searchStockList");
        var searchKey = event.getParam("searchKey");
        
        
        component.set("v.childStocksSearchSubset", searchStockList);
        component.set("v.displayChildStocks", searchStockList);
        component.set("v.searchKey", searchKey);
    },
    
    handleResetListViewEvent : function(component, event, helper) {
        
        
        component.set("v.displayChildStocks", component.get("v.childStocks"));
    },
    
    handleDeletedStocksInfo : function(component, event, helper) {
        
        var deletedStocks = event.getParam("deletedStocks");
        
        //you need remove the deleted stocks
        var childStocks = component.get("v.childStocks");
         
        if (childStocks == undefined) {
            
            return;
        } else if (childStocks.length == undefined) {
            childStocks = [childStocks];
        }
        
       	for(var i = 0; i < deletedStocks.length; i++){
            let removeIndex; 
            
            for(var j = 0; j < childStocks.length; j++){
                if(deletedStocks[i].Id == childStocks[j].Id){
                    removeIndex = j;
                    break;
                }
            }
            
            
            var deleted = childStocks.splice(removeIndex, 1);
            
        } 
        
        component.set("v.childStocks" , childStocks);
        //component.set("v.displayChildStocks", childStocks);
        
        //you need remove the deleted stocks
        //############################################################
        var childStocksSearchSubset = component.get("v.childStocksSearchSubset");
         
        if (childStocksSearchSubset == undefined) {
            
            return;
        } else if (childStocksSearchSubset.length == undefined) {
            childStocksSearchSubset = [childStocksSearchSubset];
        }
        
       	for(var i = 0; i < deletedStocks.length; i++){
            var removeIndex; 
            
            for(var j = 0; j < childStocksSearchSubset.length; j++){
                if(deletedStocks[i].Id == childStocksSearchSubset[j].Id){
                    removeIndex = j;
                    break;
                }
            }
            
            if(removeIndex == undefined) {
                break;
            } else {
                var deleted = childStocksSearchSubset.splice(removeIndex, 1);
            	
            }
            
        } 
        
        component.set("v.childStocksSearchSubset" , childStocksSearchSubset);
        
        var searchKey = component.get("v.searchKey");
        
        if(searchKey == undefined) {
            component.set("v.displayChildStocks", childStocks);
        } else {
            component.set("v.displayChildStocks", childStocksSearchSubset);
        }
        
		
		var emptyStringIdArray = [];
        component.set("v.selectedStockIdArray", emptyStringIdArray);
    },
    
    stateCheck : function(component, event, helper) {
        console.log('##############STATE##CHECK################');
        var childStocks = component.get("v.childStocks");
        console.log('childStocks');
        console.log(childStocks);
        
    	var childStocksSearchSubset = component.get("v.childStocksSearchSubset");
        console.log('childStocksSearchSubset');
        console.log(childStocksSearchSubset);
        
    	var displayChildStocks = component.get("v.displayChildStocks");
        console.log('displayChildStocks@@@');
        console.log(displayChildStocks);
        
    	var searchKey = component.get("v.searchKey");
        console.log('searchKey@@@@@');
        console.log(searchKey);
        
    	var locationList = component.get("v.locationList");
        console.log('locationList@@@@@');
        console.log(locationList);
        
    	var selectedLocationId = component.get("v.selectedLocationId");
        console.log('selectedLocationId@@@@@@@');
        console.log(selectedLocationId);
        
    	var productMap = component.get("v.productMap");
        console.log('productMap@@@@@@');
        console.log(productMap);
        
    	var selectedCategory = component.get("v.selectedCategory");
        console.log('selectedCategory@@@@@@@');
        console.log(selectedCategory);
        
    	var selectedProduct = component.get("v.selectedProduct");
        console.log('selectedProduct@@@@@@@');
        console.log(selectedProduct);
        
    	var categories = component.get("v.categories");
        console.log('categories@@@@@');
        console.log(categories);
        
    	var productSubset = component.get("v.productSubset");
        console.log('productSubset@@@@@@');
        console.log(productSubset);
    
    	var selectedStockIdArray = component.get("v.selectedStockIdArray");
        console.log('selectedStockIdArray@@@@@@@');
        console.log(selectedStockIdArray);
        
        console.log('##############STATE##CHECK################');
    },
    
    handleSavedStockInfoEvent : function(component, event, helper) {
        
        var savedStocks = event.getParam("savedStocks");
        
        var childStocks = component.get("v.childStocks");
        var childStocksSearchSubset = component.get("v.childStocksSearchSubset");
        
        for(var i = 0; i < childStocks.length; i++) {
            for(var j = 0; j < savedStocks.length; j++) {
                if(childStocks[i].Id == savedStocks[j].Id) {
                    //we have a match and replace
                    childStocks[i] = savedStocks[j];
                }
            }
        }
        
        component.set("v.childStocks", childStocks);
        
        //get the search stocks 
        
        for(var i = 0; i < childStocksSearchSubset.length; i++) {
            for(var j = 0; j < savedStocks.length; j++) {
                if(childStocksSearchSubset[i].Id == savedStocks[j].Id) {
                    //we have a match and replace
                    childStocksSearchSubset[i] = savedStocks[j];
                }
            }
        }
        
        component.set("v.childStocksSearchSubset", childStocksSearchSubset);
        
        var searchKey = component.get("v.searchKey");
        
        if(searchKey == undefined) {
            component.set("v.displayChildStocks", childStocks);
        } else {
            component.set("v.displayChildStocks", childStocksSearchSubset);
        }
        
		//DO NOT FORGET TO REMOVE THE ID FROM THE SELECTED STUFF!!!!!
		var emptyStringIdArray = [];
        component.set("v.selectedStockIdArray", emptyStringIdArray);
        
    }
})