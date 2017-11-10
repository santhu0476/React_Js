/*
 * This computer program is the confidential information and proprietary
 * trade secret of Cisco Systems, Inc.  Possessions and use of this
 * program must conform strictly to the license agreement between the user
 * and Cisco Systems, Inc., and receipt or possession does not convey
 * any rights to divulge, reproduce, or allow others to use this program
 * without specific written authorization of Cisco Systems, Inc.
 *
 *      Copyright (c) 2009 Cisco Systems, Inc.
 *      All rights reserved.
 */

/**
 *
 *
 */

dojo.provide("ifm.application.SAMNwTrafficClassification.NwHealthRules");
dojo.require("ifm.widget.PropertySheetEditWidget");
dojo.require("ifm.application.SAMNwTrafficClassification.SAMRestStore");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("ifm.application.AlarmManagement.FileMetadataAlarms");
dojo.require("ifm.application.AlarmManagement.EventMetadataMgr");
dojo.require("xwt.widget.table.Table");
dojo.require("xwt.widget.table.Toolbar");
dojo.require("xwt.widget.form.AnchoredOverlay");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ToggleButton");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Select");
dojo.require("xwt.widget.form.FilteringSelect");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.TooltipDialog");
dojo.require("ifm.application.SAMMonitorTemplate.MonitorQuickView");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dojox.layout.ContentPane");
dojo.require("xwt.widget.notification.Alert");
dojo.require("xwt.widget.form.TextButton");
dojo.require("xwt.widget.form.ComboBox");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("xwt.widget.form.ObjectSelectorSinglePicker");
dojo.require("xwt.widget.layout.Dialog");
dojo.require("dojox.data.JsonRestStore");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("xwt.widget.notification.Toaster");
dojo.require("xwt.widget.i18nMixin");
dojo.require("dojo.i18n");
dojo.require("xwt.widget.form.UnifiedIPAddress");
dojo.require("xwt.widget.layout.XwtContentPane");
dojo.require("dojox.html.ellipsis");
dojo.require("ifm.application.SAMNwTrafficClassification.TableEditLabelPicker");
dojo.require("ifm.application.SAMNwTrafficClassification.CustomThreshold");


	var flag=false;
	var addflag= false;

    dojo.declare("ifm.application.SAMNwTrafficClassification.NwHealthRules", [dojox.layout.ContentPane], {
    tabName:"",
	trafficListStore: null,
	trafficTable: null,
	trafficTargetUrl:"",
    locationName : null,
    locationHierarchy : null,
    metricName : null,
	warningCategory : null,
    addRow : true,
	siteSelectRef : null,
	deleteBtn:null,


	postCreate: function(){
	this.inherited(arguments);
	this._initializeStores();
	},

	startup : function(){
			this.inherited(arguments);
			var pageOb = wap.getPageManager().getActivePage();
			this.connect(pageOb, "resize", function(){
				var pageOb = wap.getPageManager().getActivePage();
				var mb =dojo.marginBox(pageOb.domNode);
				var pMb = dojo.marginBox(pageOb.pageHeaderDiv);
				this.resize({h:mb.h-pMb.h}); 
				dijit.byId("nwDiv").resize({h:mb.h-pMb.h});
			});
	},

	_initializeStores: function() {

       	// real store: must have idAttribute here for 'update' to work
		
		
        this.trafficListStore = new ifm.application.SAMNwTrafficClassification.SAMRestStore({
			     target: this.trafficTargetUrl,
                        //filterOnServer: true,
            			//pageOnServer: true,
						idAttribute: "id",
                        allowNoTrailingSlash:false						
		});
				


		
          this._constructTrafficList();
          
	},

		thresholdWidget: function() {  
			
		    this.widget = new ifm.application.SAMNwTrafficClassification.CustomThreshold({parent:this});
			this.widget.startup();  
			return this.widget;
		},

	_constructTrafficList: function () {
	console.log("!!!!! Now executing _constructAlarmListView() !!!!!");
        var osParams = {
		    iconClass:"quickpickicon",
		    rootId : "0",
		    rootTitle : "hierarchy",
		    //storeUrl : "rs/sam/performance/dashboardSiteAppFilter/locationgp/?selectAllLocation=true",
			storeUrl : "rs/sam/performance/dashboardSiteAppFilter/locationgp/",
		    itemIdField : "id",
	        labelField : "label",
	        descriptionField : "description",
	        hasChildrenField : "hasChildren",
		    /*
		      Option1 : specify a target field (e.g "title"). TextboxPicker will retrieve targetted-field
		      */
		      selectedField:"title",
		      showTreeView:false,
		      showToolsButton:false,
		      //onItemSelected: this.siteChanged
		      onItemSelected: dojo.hitch(this,this.siteChanged),
		      i18nPackageName:"xwt",
			  i18nBundleName:"XWTProperties"
	    };
	    
		  var metricParams = {
		     iconClass:"quickpickicon",
		    rootId : "0",
		    rootTitle : "Metric",
		    storeUrl : "rs/sam/performance/getPDS/?showAll=false",
		    itemIdField : "metric",
	        labelField : "name",
            selectedField:"metric",
		     
		  
	    };

	    var osParamsMutli = {
		    iconClass:"quickpickicon",
		    rootId : "0",
		    rootTitle : "hierarchy",
		    storeUrl : "rs/sam/performance/dashboardSiteAppFilter/locationgp",
		    itemIdField : "id",
		    showTreeView:false,
		    showToolsButton:false,
	        labelField : "label",
	        descriptionField : "description",
	        hasChildrenField : "hasChildren",
		    /*
		      Option1 : specify a target field (e.g "title"). TextboxPicker will retrieve targetted-field
		      */
		      selectedField:"title",
		      onItemSelected: dojo.hitch(this,this._multiRowSiteChange),
			  i18nPackageName:"xwt",
			  i18nBundleName:"XWTProperties"
	    };
	    
	    var pdsName = {
		    iconClass:"quickpickicon",
		    rootId : "0",
		    rootTitle : "Data Sources",
		    storeUrl : "rs/sam/performance/getPDS/?showAll=false",
		    itemIdField : "id",
	        labelField : "name",
	        descriptionField : "description",
	        hasChildrenField : "hasChildren",
		    /*
		      Option1 : specify a target field (e.g "title"). TextboxPicker will retrieve targetted-field
		      */
		      selectedField:"title",
		      onItemSelected: dojo.hitch(this,this._dataSourceChange),
			  i18nPackageName:"xwt",
			  i18nBundleName:"XWTProperties"
		      //onItemSelected: this._dataSourceChange
	    };

        // get the alarm browser table id...
        var trafficBrowserTableId =dijit.getUniqueId("sam_trafficBrowserTable",'_') ;

        // create a div element for contextual tool bar
        var contextualToolbarDiv = dojo.doc.createElement('div');

        // create contextual toolbar...
        var contextualToolbar = new xwt.widget.table.ContextualToolbar({
                                                tableId:trafficBrowserTableId
                                             }, contextualToolbarDiv);
        this.containerNode.appendChild(contextualToolbar.domNode);
		
        var contextualButtonGroupDiv = dojo.doc.createElement('div');
        
        var contextualButtonGroup = new xwt.widget.table.ContextualButtonGroup({
                                                tableId:trafficBrowserTableId,
                                                showButtons:"edit,add"
                                            }, contextualButtonGroupDiv);
		this.deleteBtn = new dijit.form.Button({ 
            iconClass:"xwtContextualIcon xwtContextualDelete", 
            showLabel:"false", 
			style:"width:28px", 
			disabled:true 
        }); 
		contextualToolbar.addChild(this.deleteBtn);
        contextualToolbar.addChild(contextualButtonGroup);



        var tab = document.createElement('table');
        //tab.setAttribute('align','center');
        //tab.setAttribute('style','padding:5px;');

        var tbody = document.createElement('tbody');
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        var dialogDivSel = dojo.doc.createElement('div');
        
         var info_validRange_1_100 = dojo.i18n.getLocalization("ifm","SAMProperties")["info_validRange_0_100"];
        this.siteSelect = new xwt.widget.form.ObjectSelectorSinglePicker({
                                        width:"120px",
										objectSelectorParams:osParamsMutli,
										editable: false
        },dialogDivSel);
        

        this.pdsSelect = new ifm.application.SAMNwTrafficClassification.TableEditLabelPicker({
                                        width:"120px",
										objectSelectorParams:pdsName,
										editable: false
        });

        this.siteSelectRef =new ifm.application.SAMNwTrafficClassification.TableEditLabelPicker({
                                        width:"120px",
										objectSelectorParams:osParams,
										showOSFilterToolbar:true,triggerOSSearchOnOpen:true,
										//required:true,
										editable: false
										
        });
		
        this.warningthresholdTxtbox = new dijit.form.NumberTextBox({type:'text',
                                        value:'',
		                                id:'warningthresholdTxtbox',
										//invalidMessage : info_validRange_1_100,
										//rangeMessage : info_validRange_1_100,
										required:true,
										style:"width:40px;"});
		if(this.tabName=="ServiceHealth"){
			console.log("constraints are assgined when changing thresholdcombobox to custom/baseline ")
		}
		else{
			this.warningthresholdTxtbox.constraints= {min:-90,max:100,places:0};
			this.warningthresholdTxtbox.maxLength = 3;
		}
    
	    this.metricruleTxtbox =  new dijit.form.NumberTextBox({type:'text',
										//'maxLength':3,
                                        value:'',
										id:'metricruleTxtbox',
										style:"width:130px;"});

        this.locHierarchy  =  new dijit.form.TextBox({type:'text',
                                        value:'',
										id:'Hierarchy',
										style:"width:290px;"});

									

		 if(this.tabName=="NetworkHealth") {
				   var arrPollingFrequency = [
								{"id": "CPU Utilization","name": "CPU Utilization"},
								{"id": "Memory Pool Utilization",  "name": "Memory Pool Utilization"},
								{"id": "Environment Temperature","name": "Environment Temperature"}, 
								{"id": "Interface Utilization","name": "Interface Utilization"}];
		 }
		 else if(this.tabName=="APHealth") {
                   var arrPollingFrequency = [
			        {"id": "Channel Utilization","name": "Channel Utilization"},
					{"id": "Client Count",  "name": "Client Count"},
					{"id": "Interface Utilization","name": "Interface Utilization"}, 
					{"id": "Interference Utilization","name": "Interference Utilization"},
					{"id": "Noise","name": "Noise"}];

		 }
		 else if(this.tabName=="ServiceHealth") {
                   var arrPollingFrequency = [
			        {"id": "Client Transaction Time","name": "Client Transaction Time"},
					{"id": "Jitter",  "name": "Jitter"},
					{"id": "MOS Score","name": "MOS Score"}, 
					{"id": "Network Time","name": "Network Time"},
					{"id": "Packet Loss","name": "Packet Loss"},
					{"id": "Server Response Time","name": "Server Response Time"},
					{"id": "Traffic Rate","name": "Traffic Rate"}];
		 }
	     this.pfreqStore = new dojo.data.ItemFileReadStore({
				data: { identifier: "id",
                    "items": arrPollingFrequency
                }
            });

        this.metricComboBox = new xwt.widget.form.FilteringSelect({ 
                              store : this.pfreqStore, 							   								  
                              labelAttr:"name",
							  id:'metricName',
							  required:true,
							  style:"width:200px"
                });

        this.siteSelect.startup();
        var labelSpan = document.createElement('span');
        labelSpan.innerHTML = 'Location Group&nbsp;&nbsp;';
		cell.appendChild(labelSpan);
        cell.appendChild(this.siteSelect.domNode);
        row.appendChild(cell);

        tbody.appendChild(row);
        tab.appendChild(tbody);

        
        //dialog div
        var dialogDiv = dojo.doc.createElement('div');
        dialogDiv.appendChild(tab);

        this.formDlg = new xwt.widget.layout.Dialog({title:"Multiple Update"},dialogDiv);
        //this.formDlg.setAttribute('style','width:210px;height:100px;');
        this.formDlg.startup();
        
        var okBtn1 = this.formDlg.buttonGroup.getItemAt(0);
        okBtn1.attr('label','Save');
        var closeBtn1 = this.formDlg.buttonGroup.getItemAt(1);
        closeBtn1.attr('label','Cancel');
        dojo.connect(okBtn1,'onClick', this, "_saveSite");

                     
        // start toolbar after adding buttons as per xmp's requirement
        // but before table startup to avoid their manage filter dialog
        contextualToolbar.startup();
        
		var expandEditable = [
		
	 /*   {
			attr: 'groupId',
            hidden:true
        },
        {
			attr: 'pdsId',
            hidden:true
        }, */       
		{
            attr: 'locationName',
            label: 'Location Group',
            editable: true,
            sortable: true,
           // sorted: 'ascending',
            width: 250,
		    editWidget: this.siteSelectRef,
            vAlignment: "middle",
            filterType: "string"
        },
        {
            attr: 'locationHierarchy',
            label: 'Hierarchy',
			editable: false,
            sortable: true,
            width: 300,
		    editWidget : this.locHierarchy,
			id:'Hierarchy',
            filterType: "string"
        },
         {
            attr: 'metricName',
            label: 'Metric',
			editable: true,
            sortable: true,
            width: 250,
			editWidget : this.metricComboBox
									 
        },
		{   
            attr: 'ruleDesc',
            label: 'Metric Rule',
			editable: false,
            sortable: true,
			hidden:true,
            width: 150,
			editWidget: this.metricruleTxtbox,
			filterType: "string"
									 
        },
        {
            attr: 'criticalCategory',
            label: 'Critical Threshold',
            editable: true,
		    editWidget: this.thresholdWidget(),
			formatter: this.conditionFormatter,
            sortable: true,
            width: 280,
            vAlignment: "middle",
            filterType: "string"
        },
        {
            attr: 'warningCategory',
            label: 'Warning Threshold',
            editable: true,
            sortable: true,
            width: 40,
            editWidget: this.warningthresholdTxtbox,
            vAlignment: "middle",
            filterType: "string"
        }
       ];



        var trafficTableProperties = {
					id:trafficBrowserTableId,
					"class": "trafficBrowserTableCont",
					//store: this.store2,
					store: this.trafficListStore,
					query: "",
                    columns: expandEditable,
					//columns: this.trafficMetadataUrl,
					rowsPerPage:5000,
					loadingIndicatorDelay:"500",
					filters : [],
					filterOnServer:false,
					queryOptions:{
						ignoreCase:true
					},
					select: {
						multiple: true,
						selectAllOption: true,
						model: 'input'
						
					},
					disablePersistState:true,
					edit: {
						immediateCommit: false
					}	
				};

        
    
        //var trafficTableDiv =dojo.create("div");
		var pageName = this.tabName;
        this.trafficTable = new xwt.widget.table.Table(trafficTableProperties);
        this.containerNode.appendChild(this.trafficTable.domNode);
		dojo.connect(dijit.byId(trafficBrowserTableId), "onAdd", function(item,parent){
			
			dijit.byId("criticalthresholdComboBox").reset();
			dijit.byId("criticalthresholdTxtbox").reset();
			dijit.byId("warningthresholdTxtbox").reset();
		
			//item.hierarchy='';
			item.locationHierarchy="<<Hierarchy of the selected Location Group>>";
			flag=true;
			addflag=true;
			
		});

		
		
		var	tempStore=this.trafficListStore;	
		var obj=this;
		dojo.connect(dijit.byId(trafficBrowserTableId), "onSaveError", function(){	
	    if(pageName=="NetworkHealth") {
				if(tempStore.responseStatus=="NetWork Health Rule Created Successfully "){
				obj.showToasterSuccessMessage("Infrastructure Health Rule created successfully.");
				}
				else if(tempStore.responseStatus=="NetWork Health Rule Updated Successfully "){
				obj.showToasterSuccessMessage("Infrastructure Health Rule updated successfully.");
				}
				else{
				obj.failureMessage(tempStore.responseStatus);
				}
		}else if(pageName=="APHealth") {
               if(tempStore.responseStatus=="AP Health Rule Created Successfully "){
		       obj.showToasterSuccessMessage("Wireless Health Rule created successfully.");
		        }
		       else if(tempStore.responseStatus=="AP Health Rule Updated Successfully "){
		       obj.showToasterSuccessMessage("Wireless Health Rule updated successfully.");
		       }
		       else{
		       obj.failureMessage(tempStore.responseStatus);
		       }

		}
		else if(pageName=="ServiceHealth") {
               if(tempStore.responseStatus=="Service Health Rule Created Successfully "){
		       obj.showToasterSuccessMessage("Service Health Rule created successfully.");
			   obj.trafficTable.clearSelections();
		        }
		       else if(tempStore.responseStatus=="Service Health Rule Updated Successfully "){
		       obj.showToasterSuccessMessage("Service Health Rule updated successfully.");
			   obj.trafficTable.clearSelections();
		       }
		       else{
		       obj.failureMessage(tempStore.responseStatus);
		       }
		}
		});

      



        var self = this;
		dojo.connect(dijit.byId(trafficBrowserTableId), "onEdit", function(item){
          if(item.locationId!=""){
		      addflag=false; 
		  }
		  if(self.tabName =='ServiceHealth'){
			self.widget.policyType = item.policyType;
			self.widget.criticalVal = item.criticalCategory.split(" ")[2];
			self.widget.setWidgetValues(item.criticalCategory.split(" ")[2]);
			var wtvalue = item.warningCategory.split(" ")[2];
			self.warningthresholdTxtbox.set("value",wtvalue);
		  }
		  else{
			self.widget.policyType = item.policyType;
			self.widget.criticalVal = item.criticalVal;
			self.widget.setWidgetValues(item.criticalVal);
			if(item.warningCategory!=""){
				var wtvalue = item.warningCategory.match(/\d/g).join("");
				self.warningthresholdTxtbox.set("value",wtvalue);
			}
		  }
		  if(item.locationName=="All Locations"){
			expandEditable[0].editWidget.attr("disabled",true);
			expandEditable[2].editWidget.attr("disabled",true);
		  }else{
			expandEditable[0].editWidget.attr("disabled",false);
			expandEditable[2].editWidget.attr("disabled",false);
		  }


        });	



		dojo.connect(dijit.byId(trafficBrowserTableId), "onEditComplete", function(item){
			var criticalthreshold = dijit.byId("criticalthresholdComboBox");
            var siteObj = item.locationName;
			if(addflag==true){
            item.locationHierarchy = siteObj.fullData.hierarchy;
			addflag=false;
			}
			if(pageName=="NetworkHealth"){
				item.category = 1;
			}else if(pageName=="APHealth"){
			    item.category = 3;
			}else if(pageName=="ServiceHealth"){
			    item.category = 2;
			}
			if((item.metricName=="Noise") || (item.metricName=="MOS Score")){
			item.ruleDesc = "LesserThan";
			}else{
			item.ruleDesc = "GreaterThan";
			}
			item.locationName = "";
			item.policyType = criticalthreshold.value;
		});	


	

  	  	var dataError = "reset";
		var self = this;
		var trafficTableObj = this.trafficTable;	
  	  	this.trafficTable.validateRow = {
			
			     
					isValid:function(oldvalues, newitem)
					{
						console.log("siterule - validation - -edit ",newitem);
						console.log("siterule - validation - -edit ",dataError );
	
						if(newitem != null && newitem.locationName != null && newitem.locationName.label && newitem.locationName.label.length > 0)
						{
        				
                           var locHierachy = dojo.byId('Hierarchy').value;
							var tablength = trafficTableObj._indexToItem.length-1;
							for(k=0;k<tablength;k++)
							{							
                              if(newitem.locationName.label == trafficTableObj._indexToItem[k].locationName && locHierachy==trafficTableObj._indexToItem[k].locationHierarchy && newitem.metricName==trafficTableObj._indexToItem[k].metricName && oldvalues.id!=trafficTableObj._indexToItem[k].id)
								{
								this.errorMessage = "This Rule already exists!!!";
								 return false;
								}
							}
							if( self.tabName =='ServiceHealth' ){
								if((parseInt(newitem.criticalCategory.split('/')[0]) == 1 || parseInt(newitem.criticalCategory.split('/')[0]) == 4) && newitem.metricName == 'MOS Score'){
									if(parseFloat(newitem.criticalCategory.split('/')[1]) < 0 || parseFloat(newitem.criticalCategory.split('/')[1]) > 5){
										this.errorMessage = "Threshold value of CRITICAL cannot be outside the range 0 to 5 on the selected rule." ;
										return false;
									}else if(newitem.warningCategory < 0 || newitem.warningCategory > 5){
										this.errorMessage = "Threshold value of WARNING cannot be outside the range 0 to 5 on the selected rule." ;
										return false;
									}
								}
								else if(parseFloat(newitem.criticalCategory.split('/')[0]) == 1){
									if(parseFloat(newitem.criticalCategory.split('/')[1]) < 0 || parseFloat(newitem.criticalCategory.split('/')[1]) > 10){
										this.errorMessage = "Threshold value of CRITICAL cannot be outside the range 0 to 10 on the selected rule." ;
										return false;
									}else if(newitem.warningCategory < 0 || newitem.warningCategory > 10){
										this.errorMessage = "Threshold value of WARNING cannot be outside the range 0 to 10 on the selected rule." ;
										return false;
									}
								}
								else if(parseFloat(newitem.criticalCategory.split('/')[0]) == 4){
									if(parseFloat(newitem.criticalCategory.split('/')[1]) < 0){
										this.errorMessage = "Threshold value of CRITICAL (CUSTOM value) cannot be less than 0 on the selected rule." ;
										return false;
									}else if(newitem.warningCategory < 0){
										this.errorMessage = "Threshold value of CRITICAL (CUSTOM value) cannot be less than 0 on the selected rule." ;
										return false;
									}
								}
								else if(parseFloat(newitem.criticalCategory.split('/')[1]) <= newitem.warningCategory && (parseFloat(newitem.criticalCategory.split('/')[1]) != 0 || newitem.warningCategory!=0)){
									this.errorMessage = "Threshold value of WARNING cannot be more than or equal to CRITICAL on the selected rule." ;
									return false;
								}
							}
							return true;
						}
						else
						{						
						this.errorMessage = "Location Group cannot be empty. Please select a Location Group." 
	      				return false;
						}
					}
					
					
				};
        //dojo.byId('nwDiv').appendChild(this.trafficTable.domNode);
      
        this.trafficTable.startup();
        this.trafficTable.resize();

		dojo.connect(this.trafficTable, "onCancelEdit", this,function(){		
			this.trafficTable.clearSelections();
		});

		/*dojo.connect(this.trafficTable, "onDelete", this,function(){		
			 obj.showToasterSuccessMessage("Selected Health rule deleted successfully.");
		});*/

  
        dojo.connect(this.trafficTable, 'onDeselect', this, function() {

			//if(tempStore.responseStatus=="Rule Deleted Successfully "){
		  //  obj.showToasterSuccessMessage("Network Rule deleted successfully.");
		  //  }
          

        });

		dojo.connect(this.deleteBtn,'onClick', this, "ackWithConfirm_"); 
		ackWithConfirm_:function(){ 
			var msg2= "Are you sure you would like to delete the selected item(s)?"; 
			this.alertForAck = new xwt.widget.notification.Alert({ 
				messageType: "warning", 
				buttons:[{ 
					label: "OK", 
					baseClass: "defaultButton", 
					onClick: dojo.hitch(this,function() { 
					this._deleteRule();})
					}, 
					{ 
				   label: "Cancel", 
				   onClick: dojo.hitch(this,function() {return;}) 
					}], 
				dontShowAgainOption: true 
			}); 
			this.alertForAck.setDialogContent(msg2); 
			this.alertForAck.show(); 
		},
		
		_deleteRule:function(){
			var selRule = this.trafficTable.selected();
			var selRuleArr = [];
			var i,link;

			if(selRule.length > 1){
				for(i=0;i<selRule.length;i++){
					selRuleArr.push(selRule[i].ruleId);
			}
			link = "rs/sam/performance/deleteMultipleRules/"+selRuleArr.join(",");
			}else{
				link = this.trafficTargetUrl+selRule[0].ruleId;
			}
		dojo.xhrDelete({
					  url: link,
					  headers: { "Content-Type": "application/json"},
					  preventCache: true,
					  load: dojo.hitch(this,function(data, args) {
							this.trafficTable.refresh();
							this.trafficTable.clearSelections();
							this.showToasterSuccessMessage("Selected site rule deleted successfully.");
					  }),
					  error: dojo.hitch(this,function(data) {
					  console.log(data);
					  }),
				});
		},
		/*dojo.connect(this.deleteBtn, '_setDisabledAttr', this, function() {			
			var seletedTemplates = this.trafficTable.selected();   
			if(seletedTemplates.length >0 ) {
		     for(i=0;i<=seletedTemplates.length;i++){
					 if (seletedTemplates[i] && seletedTemplates[i].locationName=="All Locations"){	
					
						this.deleteBtn.attr("disabled", true);
					 }
					else{	

						//contextualButtonGroup.deleteButton.attr("disabled", false);
					}
		       }

			   
		}
		});
			
			dojo.connect(contextualButtonGroup.deleteButton, 'onDelete', this, function() {			
					var x = confirm("Are you sure you want to delete the selected rule?");
				  if (x){
					  obj.showToasterSuccessMessage("Selected Health rule deleted successfully.");
					 return true;
				  
				  }
				  else {
					 return false;
				  }
				});*/

		dojo.connect(contextualButtonGroup.editButton, '_setDisabledAttr', this, function() {			
			var seletedTemplates = this.trafficTable.selected();  	
			if (seletedTemplates.length > 1 && !contextualButtonGroup.editButton.attr("disabled")) {	
				contextualButtonGroup.editButton.attr("disabled", true);
			}
		});
		 
  	},
	conditionFormatter: function(values, rowIndex, cell){
               		  
		   return values ;

    },
    _saveSite: function(){
        var link = "rs/samRest/siteRule-rest/updateSiteRules/"
        var lbl = this.siteSelect.getValue().label;
     //   var jsonData = '{"locationName":"' + lbl + '","ruleId":"';
        if(lbl == "" || lbl == null || lbl == "null"){
		groupNullCheck=new xwt.widget.notification.Alert({
				"aria-describedby":"sampleDialog3",
					messageType:"warning",
					buttons: [
							{
								label: "OK",
								baseClass: "defaultButton"
							}
						]
				});
		groupNullCheck.setDialogContent("Please select Location Group.");
		console.log("Entered if");
		return;
		}
       
        dojo.xhrPut({
              url: link,
              putData:jsonData,
              headers: { "Content-Type": "application/xml"},
              preventCache: true,
              load: dojo.hitch(this,function(data, args) {
				   this.showToasterSuccessMessage('Site upated for Endpoint classification rule(s)');
                   this.formDlg.hide();
                   this.trafficTable.refresh();
              }),
              error: dojo.hitch(this,function(data ,args) {
                   this.failureMessage('Error in Multi Update');
				   this.formDlg.hide();
	          }),
	          timeout: 1000
	    });

    },
    showToasterSuccessMessage : function(message){
			var namConfigToaster = new xwt.widget.notification.Toaster({duration: "5000",messageTopic: "message"});
			namConfigToaster.newMessage(message,"success","Success");
	},
	showToasterWarningMessage : function(message){
			var namConfigToaster = new xwt.widget.notification.Toaster({duration: "5000",messageTopic: "message"});
			namConfigToaster.newMessage(message,"warning","Warning");
	},
	_multiUpdate : function(){
	       this.rules = this.trafficTable.selected();
           if(this.rules.length < 1){
                 this.failureMessage("Please select one or more rows for Multiple Update");
                 return;
           };
           this.formDlg.show();
    },
    successMessage : function(msg){
          formDlg3 = new xwt.widget.notification.Alert({
				"aria-describedby":"sampleDialog3",
					messageType:"information",
					buttons: [
							{
								label: "OK",
								baseClass: "defaultButton"
							}
						]
				});  
				formDlg3.setDialogContent(msg);
   },
    failureMessage : function(msg){
          formDlg3 = new xwt.widget.notification.Alert({
				"aria-describedby":"sampleDialog3",
					messageType:"critical",
					buttons: [
							{
								label: "OK",
								baseClass: "defaultButton"
							}
						]
				});
				formDlg3.setDialogContent(msg);
   },
   _multiRowSiteChange : function(dataItem, item) {
		var id = dataItem.id;		
		this.multiRowGroupId = id;
  
	},
	_dataSourceChange : function(dataItem, item) {
		
		var id = dataItem.id;
		
			if(this.trafficTable._item == undefined){
				this.trafficTable.selected()[0].locationId = id;
			}else{
				  this.trafficTable._item.locationId = id;
			}
		return;
	},
	      
	siteChanged : function(dataItem, item) {
		
		var id = dataItem.id;
		if(this.trafficTable._item == undefined){
        this.trafficTable.selected()[0].locationId = id;
		}else{
		 this.trafficTable._item.locationId = id;
		}

		var textField1 = this.trafficTable.getColumns().getByAttribute("locationHierarchy");
    	textField1.editWidget.setValue(dataItem.hierarchy);

		return;
	}

});