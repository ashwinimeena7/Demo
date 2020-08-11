var OverseasController;
sap.ui.define([
"sap/ui/core/mvc/Controller",
	"sap/m/BusyDialog",
	"sap/ui/model/Filter",
	"ZDeputation/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button"
], function (Controller, BusyDialog, Filter, formatter, JSONModel, Dialog, Text, Button) {

	return Controller.extend("ZResourceRPM.controller.DeputExt", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZResourceRPM.view.DeputExt
		 */
		onInit: function () {
			OverseasController=this.getView();
			//	this.remarksDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.errorDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.errorMsgDialog", this);
			this.getView().addDependent(this.errorDialog);
			this.errorDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.errorDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.errorMsgDialog", this);
			this.getView().addDependent(this.errorDialog);
			this.errorDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.oToModel = new JSONModel();
			this.getView().setModel(this.oToModel, "toModel");
			sap.m.DatePicker.prototype.onAfterRendering = function (oEvent) {
				$("#" + oEvent.srcControl.getId() + "-inner").prop('readonly', true);
			};
			this.OvrClientNamef4 = sap.ui.xmlfragment("ZResourceRPM.fragments.OvrClientNamef4", this);
			this.getView().addDependent(this.OvrClientNamef4);

			this.OvrTravelToCountryf4 = sap.ui.xmlfragment("ZResourceRPM.fragments.OvrTravelToCountryf4", this);
			this.getView().addDependent(this.OvrTravelToCountryf4);

			this.OvrTravelToLocf4 = sap.ui.xmlfragment("ZResourceRPM.fragments.OvrTravelToLocf4", this);
			this.getView().addDependent(this.OvrTravelToLocf4);

			this.OvrBillRateF4 = sap.ui.xmlfragment("ZResourceRPM.fragments.OvrBillRateF4", this);
			this.getView().addDependent(this.OvrBillRateF4);

			this.OvrPOF4 = sap.ui.xmlfragment("ZResourceRPM.fragments.OvrPOF4", this);
			this.getView().addDependent(this.OvrPOF4);

			this.OvrRoleF4 = sap.ui.xmlfragment("ZResourceRPM.fragments.OvrRoleF4", this);
			this.getView().addDependent(this.OvrRoleF4);
		},
		goToBack: function () {
			debugger;
			var createValid = [];

			if (oOvrSelectedModel.oData.Operation === 'E') {
				var fromCity = this.getView().byId("fromCityExt");
				var StartDate = this.getView().byId("frmStrtDateExt");
				var EndDate = this.getView().byId("toEndDateExt");
				var Country = this.getView().byId("toCountryExt");
				var Location = this.getView().byId("toLocationExt");
				var City = this.getView().byId("toCityExt");
				var toVisaCaseNo = this.getView().byId("toVisaCaseNoExt");
				var toVisaPermitType = this.getView().byId("toVisaPermitTypeExt");
				var sClientLocation = this.getView().byId("clientLocationExt");
				var sClientCountry = this.getView().byId("clientCountryExt");
				var sClientCity = this.getView().byId("clientCityExt");
				var sClientAdd1 = this.getView().byId("clientAdd1Ext");
				var sClientAdd2 = this.getView().byId("clientAdd2Ext");
				var sClientPin = this.getView().byId("clientPincodeExt");
				var clientName = this.getView().byId("clientNameExt");
				var Rate = this.getView().byId("RateExt");
				var PO = this.getView().byId("POExt");
				var IRM = this.getView().byId("IRMExt");
				var Role = this.getView().byId("RoleExt");
				var sRemarks = this.getView().byId("toRemarksExt");
			}

			/*var sClientAdd1 = this.getView().byId("clientAdd1");
			var sClientAdd2 = this.getView().byId("clientAdd2");
			var sClientPin = this.getView().byId("clientPincode");
			var sRemarks = this.getView().byId("toRemarks");*/
			if (fromCity.getValue() === "" || StartDate.getValue() === "" || EndDate.getValue() === "" || Country.getValue() === "" || Location
				.getValue() ===
				"" || City.getValue() === "" || toVisaCaseNo.getValue() === "" || toVisaPermitType.getValue() === "" || sClientLocation.getValue() ===
				"" || sClientCountry.getValue() === "" || sClientCity.getValue() === "" || sClientAdd1.getValue() === "" || sClientAdd2.getValue() ===
				"" || sClientPin.getValue() === "" || clientName.getValue() === "" || Role.getValue() === "" || Rate.getValue() === "" || PO.getValue() ===
				"" || IRM.getValue() === "" || sRemarks.getValue() === "") {
				if (Role.getValue() === "" || Role.getValueState() === "Error") {
					createValid.push(Role);
				}
				if (IRM.getValue() === "" || IRM.getValueState() === "Error") {
					createValid.push(IRM);
				}
				if (Rate.getValue() === "" || Rate.getValueState() === "Error") {
					createValid.push(Rate);
				}
				if (PO.getValue() === "" || PO.getValueState() === "Error") {
					createValid.push(PO);
				}

				if (fromCity.getValue() === "" || fromCity.getValueState() === "Error") {
					createValid.push(fromCity);
				}
				if (StartDate.getValue() === "" || StartDate.getValueState() === "Error") {
					createValid.push(StartDate);
				}
				if (EndDate.getValue() === "" || EndDate.getValueState() === "Error") {
					createValid.push(EndDate);
				}
				if (Country.getValue() === "" || Country.getValueState() === "Error") {
					createValid.push(Country);
				}
				if (Location.getValue() === "" || Location.getValueState() === "Error") {
					createValid.push(Location);
				}
				if (City.getValue() === "" || City.getValueState() === "Error") {
					createValid.push(City);
				}

				if (toVisaCaseNo.getValue() === "" || toVisaCaseNo.getValueState() === "Error") {
					createValid.push(toVisaCaseNo);
				}
				if (toVisaPermitType.getValue() === "" || toVisaPermitType.getValueState() === "Error") {
					createValid.push(toVisaPermitType);
				}
				if (sClientLocation.getValue() === "" || sClientLocation.getValueState() === "Error") {
					createValid.push(sClientLocation);
				}
				if (sClientCountry.getValue() === "" || sClientCountry.getValueState() === "Error") {
					createValid.push(sClientCountry);
				}
				if (sClientCity.getValue() === "" || sClientCity.getValueState() === "Error") {
					createValid.push(sClientCity);
				}

				if (sClientAdd1.getValue() === "" || sClientAdd1.getValueState() === "Error") {
					createValid.push(sClientAdd1);
				}
				if (sClientAdd2.getValue() === "" || sClientAdd2.getValueState() === "Error") {
					createValid.push(sClientAdd2);
				}
				if (sClientPin.getValue() === "" || sClientPin.getValueState() === "Error") {
					createValid.push(sClientPin);
				}
				if (clientName.getValue() === "" || clientName.getValueState() === "Error") {
					createValid.push(clientName);
				}
				if (sRemarks.getValue() === "" || sRemarks.getValueState() === "Error") {
					createValid.push(sRemarks);
				}

				for (var i = 0; i < createValid.length; i++) {

					createValid[i].setValueState("None");
					//createValid[i].setValue();
				}
			}
			if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
				this.getView().getModel("OvisaClientModel").setData();
				this.getView().getModel("OvisaClientModel").refresh();
			}

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("DeputationSearch");
			this.resetCreate();
		},
		convertDate: function (sDate) {
			debugger;
			var sYear = sDate.getFullYear().toString();
			var sMonth = (sDate.getMonth() + 1).toString();
			if (sMonth.length === 1) {
				sMonth = "0" + sMonth;
			}
			var sDay = (sDate.getDate()).toString();
			if (sDay.length === 1) {
				sDay = "0" + sDay;
			}
			return sYear + sMonth + sDay;
		},

		convertEndDate: function (sDate) {
			debugger;
			var sYear = sDate.getFullYear().toString();
			var sMonth = (sDate.getMonth() + 1).toString();
			if (sMonth.length === 1) {
				sMonth = "0" + sMonth;
			}
			var sDay = (sDate.getDate()).toString();
			if (sDay.length === 1) {
				sDay = "0" + sDay;
			}
			return sYear + "-" + sMonth + "-" + sDay + "T00:00:00";
		},
		stdDateFormat: function (sDate) {
			debugger;
			var sYear = sDate.substr(0, 4);
			var sMonth = sDate.substr(4, 2);
			var sDay = sDate.substr(6, 2);
			var sNewDate = new Date(sYear + "-" + sMonth + "-" + sDay);
			return sNewDate;
		},

		validateCreate: function () {
			debugger;
			var oFromData = this.getView().getModel("oOvrSelectedModel").getData();
			var createValid = [];
			if (oFromData.Operation === "E") {
				// var sStdate = this.getView().byId("toStrtDateExt").getValue();
				// var sEndate = this.getView().byId("toEndDateExt").getValue();
				// var sCountry = this.getView().byId("toCountryExt").getValue();
				// var sLoc = this.getView().byId("toLocationExt").getValue();
				var toVisaPermitType = this.getView().byId("toVisaPermitTypeExt");
				var sFrmCity = this.getView().byId("fromCityExt");
				var sToCity = this.getView().byId("toCityExt");
				var sClientLocation = this.getView().byId("clientLocationExt");
				var sClientCountry = this.getView().byId("clientCountryExt");
				var sClientCity = this.getView().byId("clientCityExt");
				// var sClientName = this.getView().byId("clientNameExt").getValue();
				var sClientAdd1 = this.getView().byId("clientAdd1Ext");
				var sClientAdd2 = this.getView().byId("clientAdd2Ext");
				var sClientPin = this.getView().byId("clientPincodeExt");

				var Rate = this.getView().byId("RateExt");
				var PO = this.getView().byId("POExt");
				var IRM = this.getView().byId("IRMExt");
				var Role = this.getView().byId("RoleExt");
				//	var sRemarks = this.getView().byId("toRemarksExt");
				//sRemarks.getValue() === "" ||

				if (oFromData.ProjType === 'X' && Rate.getValue() === "") {

					if (Rate.getValue() === "") {
						createValid.push(Rate);
					}
					for (var i = 0; i < createValid.length; i++) {
						createValid[i].setValueState("Error");
					}
					this.errorDialog.getContent()[0].setText("Fill all the mandatory fields");
					this.errorDialog.open();

				} else { //|| Rate.getValue() === ""  || PO.getValue() === ""
					if (toVisaPermitType.getValue() === "" || sFrmCity.getValue() === "" || sToCity.getValue() === "" || sClientLocation.getValue() ===
						"" ||
						sClientCountry.getValue() === "" || sClientCity.getValue() === "" || Role.getValue() === "" || IRM.getValue() === "" ||
						sClientAdd1.getValue() === "" || sClientPin.getValue() === "" || sClientAdd2.getValue() === "") {
						if (sFrmCity.getValue() === "") {
							createValid.push(sFrmCity);
						}
						/*	if (Rate.getValue() === "") {
								createValid.push(Rate);
							}*/
						if (Role.getValue() === "") {
							createValid.push(Role);
						}
						/*	if (PO.getValue() === "") {
								createValid.push(PO);
							}*/
						if (IRM.getValue() === "") {
							createValid.push(IRM);
						}
						if (sToCity.getValue() === "") {
							createValid.push(sToCity);
						}
						if (sClientLocation.getValue() === "") {
							createValid.push(sClientLocation);
						}
						if (sClientCountry.getValue() === "") {
							createValid.push(sClientCountry);
						}
						if (sClientCity.getValue() === "") {
							createValid.push(sClientCity);
						}
						if (sClientAdd1.getValue() === "") {
							createValid.push(sClientAdd1);
						}
						if (sClientAdd2.getValue() === "") {
							createValid.push(sClientAdd2);
						}
						if (sClientPin.getValue() === "") {
							createValid.push(sClientPin);
						}
						if (toVisaPermitType.getValue() === "") {
							createValid.push(toVisaPermitType);
						}
						/*if (sRemarks.getValue() === "") {
							createValid.push(sRemarks);
						}*/
						for (var i = 0; i < createValid.length; i++) {
							createValid[i].setValueState("Error");
						}
						this.errorDialog.getContent()[0].setText("Fill all the mandatory fields");
						this.errorDialog.open();
					} else {
						this.openSubmitDialog(oFromData.Operation);
					}
				}

			}
		},
		openSubmitDialog: function (Operation) {
			var that = this;
			var submitDialog = new Dialog({
				title: "Warning",
				type: "Message",
				state: "Warning",
				content: new Text({
					text: "Do you really want to continue?"
				}),
				beginButton: new Button({
					text: "OK",
					press: function () {
						submitDialog.close();
						if (Operation == 'C') {
							that.onCreate();
						} else {
							that.onCreate();
						}

					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function () {
						submitDialog.close();
					}
				}),
				afterClose: function () {
					submitDialog.destroy();
				}
			});
			submitDialog.open();
		},
		validateField: function (oEvent) {
			if (oEvent.getSource().getValue() === "") {
				oEvent.getSource().setValueState("Error");
			} else {
				oEvent.getSource().setValueState("None");
			}
		},
		onCreate: function () {
			debugger;
			var oAllocoDataModel = this.getOwnerComponent().getModel("oAllocoDataModel");
			var oTravelModel = this.getOwnerComponent().getModel("oTravelModel");
			var that = this;
			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			//var oFromData = this.getView().getModel("oAllocSelectedModel").getData();
			var oFromData = this.getView().getModel("oOvrSelectedModel").getData();
			var iPercentage = oFromData.Zzpercent;
			if (oFromData.Operation === "C") {
				var oToData = this.getView().getModel("ExtendModel").getData();
				var oVisaData = this.getView().getModel("OvisaClientModel").getData();
				var sToStartDate = this.getView().byId("frmStrtDate").getValue();
				var sToEndDate = this.getView().byId("toEndDate").getValue();
				var sRemarks = oToData.remarks;
				var clientAddr2 = this.getView().byId("clientAdd2").getValue();
				if (oFromData.Zzalsta === "RIW") {
					var AllocFlag = "R";
				} else {
					var AllocFlag = "A";
				}
				var createData = {
					"IvRemarks": sRemarks,
					"EvError": "",
					"EvSuccess": "",
					"IvOperation": oFromData.Operation,
					"CRT_DEPUSet": [],
					"CRT_DEPU_TOSet": [],
					"CLIENT_DETAILSSet": [],
					"ALLOCATION_DETAILSSet": []
				};
				createData.CRT_DEPUSet.push({
					"PsNumber": oFromData.Pernr,
					"L1Wbs": oFromData.Zzl1Wbs,
					"DeputationType": "",
					"StartDate": oFromData.Begda,
					"EndDate": oFromData.Endda,
					"Country": oFromData.ZzcountryDes,
					"Location": oFromData.ZzstateDesc,
					"L1Description": oFromData.L3WbsDesc,
					"CountryCode": oFromData.Zzcountry,
					"LocationCode": oFromData.State,
					"City": oToData.fromCity
				});
				createData.CRT_DEPU_TOSet.push({
					"StartDateTo": sToStartDate,
					"EndDateTo": sToEndDate,
					"Percentage": iPercentage,
					"CountryTo": oToData.CountryCode,
					"LocationTo": oToData.Stort,
					"CityTo": oToData.toCity
				});
				createData.CLIENT_DETAILSSet.push({
					"EmpPernr": oFromData.Pernr,
					"CaseNumber": oVisaData.Casenumber,
					"ClientName": oVisaData.ClientName,
					"ClientCountry": oVisaData.clientCountryCode,
					"ClientState": oVisaData.State,
					"ClientCity": oVisaData.City,
					"ClientAdd1": oVisaData.AddressLine1,
					"ClientAdd2": oVisaData.AddressLine2,
					"ClientPincode": oVisaData.Zipcode
				});
				createData.ALLOCATION_DETAILSSet.push({
					"Emplid": oFromData.Pernr,
					"L1Wbs": oFromData.Zzl1Wbs,
					"L3Wbs": oFromData.Zzl3Wbs,
					"AllocSd": oFromData.Begda,
					"AllocEnd": oFromData.Endda,
					"Rate": oToData.RateId,
					"Po": oToData.Tnmpo,
					"PoNumber": oToData.Value,
					"Role": oToData.RoleCode,
					"Irm": oToData.PsNumber,
					"AllocStatus": AllocFlag
				});
				// (PsNumber='" + oFromData.Pernr + "',ClientName='" + oFromData.ClientName + "',ClientCountry='" +
				// 	oToData.clientCountry + "',L1Wbs='" + oFromData.Zzl1Wbs +
				// 	"',ClientState='" + oToData.clientLocation + "',DeputationType='',StartDate='" +
				// 	oFromData.Begda + "',ClientCity='" + oToData.clientCity + "',ClientAdd1='" + oToData.clientAdd1 + "',ClientAdd2='" + clientAddr2 +
				// 	"',ClientPincode='" + oToData.clientPincode + "',City='" + oToData.fromCity + "',EndDate='" + oFromData.Endda +
				// 	"',CityTo='" + oToData.toCity + "',Country='" + oFromData.fromCountryD +
				// 	"',Location='" + oFromData.fromLocationD + "',L1Description='" + oFromData.L1Desc + "',CountryCode='" + oFromData.fromCountry +
				// 	"',LocationCode='" + oFromData.fromLocation + "',StartDateTo='" + sToStartDate + "',EndDateTo='" + sToEndDate + "',Percentage=" +
				// 	iPercentage + "m,CountryTo='" + oFromData.Country + "',LocationTo='" + oFromData.PlantStort + "',IvRemarks='" + sRemarks + "')
				oAllocoDataModel.create("/OVR_CREATE_DEPTSet", createData, null,
					function (oData, oResponse) {
						debugger;
						if (oData.EvSuccess !== "") {
							var dialog = new Dialog({
								title: "Success",
								type: "Message",
								state: "Success",
								content: new Text({
									text: oData.EvSuccess
								}),
								beginButton: new Button({
									text: "Close",
									press: function () {
										dialog.close();
										that.resetCreate();
										that.refershDept();
									}
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});

							dialog.open();

						} else {
							that.oBusyDialog.close();
							that.errorDialog.getContent()[0].setText(oData.EvError);
							that.errorDialog.open();
						}

					},
					function (oError) {
						that.oBusyDialog.close();
						that.errorDialog.getContent()[0].setText(" Data fetch failed");
						that.errorDialog.open();
					});

			} else if (oFromData.Operation === "E") {
				/*
								var oExtendData = this.getView().getModel("oExistingDeptModel").getData();
								var remarks = this.getView().byId("toRemarksExt").getValue();
								var extData = {
									"IvRemarks": remarks,
									"IAmndtNo": oExtendData.AmmendmentNo,
									"IDeputationNo": oExtendData.DeputationNo,
									"EvMessage": "",
									"OVR_DEP_EXTEND_CRTSet": [],
									"OVR_DEP_EXTEND_CRT_TOSet": [],
									"OVR_DEP_EXTEND_CLIENTSet": []
								};
								extData.OVR_DEP_EXTEND_CRTSet.push({
									"PsNumber": oFromData.Pernr,
									"L1Wbs": oFromData.Zzl1Wbs,
									"DeputationType": "",
									"StartDate": oFromData.Begda,
									"EndDate": oFromData.Endda,
									"Country": oExtendData.CountryDecr,
									"Location": oExtendData.LocationDecr,
									"L1Description": oFromData.L1Desc,
									"CountryCode": oExtendData.Country,
									"LocationCode": oExtendData.Location,
									"City": oExtendData.cityPrev
								});
								extData.OVR_DEP_EXTEND_CRT_TOSet.push({
									"StartDateTo": oFromData.Begda,
									"EndDateTo": oFromData.Endda,
									"Percentage": iPercentage,
									"CountryTo": oFromData.Country,
									"LocationTo": oFromData.PlantStort,
									"CityTo": oExtendData.City
								});
								extData.OVR_DEP_EXTEND_CLIENTSet.push({
									"ClientName": oFromData.ClientName,
									"ClientCountry": oExtendData.ClientCountry,
									"ClientState": oExtendData.ClientState,
									"ClientCity": oExtendData.ClientCity,
									"ClientAdd1": oExtendData.ClientAdd1,
									"ClientAdd2": oExtendData.ClientAdd2,
									"ClientPincode": oExtendData.ClientPincode
								});
								// (ClientName='" + oFromData.ClientName + "',ClientCountry='" + oExtendData.ClientCountry +
								// 	"',ClientState='" + oExtendData.ClientState +
								// 	"',ClientCity='" + oExtendData.ClientCity + "',ClientAdd1='" + oExtendData.ClientAdd1 + "',ClientAdd2='" + oExtendData.ClientAdd2 +
								// 	"',ClientPincode='" + oExtendData.ClientPincode + "',PsNumber='" + oFromData.Pernr + "',L1Wbs='" + oFromData.Zzl1Wbs +
								// 	"',DeputationType='',StartDate='" + oFromData.Begda + "',EndDate='" + oFromData.Endda + "',Country='" + oExtendData.CountryDecr +
								// 	"',Location='" + oExtendData.LocationDecr + "',L1Description='" + oFromData.L1Desc + "',CountryCode='" + oExtendData.Country +
								// 	"',LocationCode='" + oExtendData.Location + "',City='" + oExtendData.cityPrev + "',StartDateTo='" + oFromData.Begda +
								// 	"',EndDateTo='" + oFromData.Endda + "',Percentage=" + iPercentage + "m,CountryTo='" + oFromData.Country + "',LocationTo='" +
								// 	oFromData.PlantStort + "',CityTo='" + oExtendData.City + "',IvRemarks='" + remarks + "',IAmndtNo='" + oExtendData.AmmendmentNo +
								// 	"',IDeputationNo='" + oExtendData.DeputationNo + "')
								oModel.create("/OVR_DEP_EXTENDSet", extData, null,
									function(oData, oResponse) {
										debugger;
										if (oData.EvMessage.search("successfully") > 0) {
											var dialog = new Dialog({
												title: "Success",
												type: "Message",
												state: "Success",
												content: new Text({
													text: oData.EvMessage
												}),
												beginButton: new Button({
													text: "Close",
													press: function() {
														dialog.close();
														that.resetCreate();
														that.refershDept();
													}
												}),
												afterClose: function() {
													dialog.destroy();
												}
											});
											dialog.open();
										} else {
											that.oBusyDialog.close();
											that.errorDialog.getContent()[0].setText(oData.EvMessage);
											that.errorDialog.open();
										}
									},
									function(oError) {
										that.oBusyDialog.close();
										that.errorDialog.getContent()[0].setText(" Data fetch failed");
										that.errorDialog.open();
									});
							*/
				//	var oToData = this.getView().getModel("oOvrSelectedModel").getData();
				var oVisaData = this.getView().getModel("OvisaClientModel").getData();
				//var sToStartDate = this.getView().byId("frmStrtDateExt").getValue();
				var InputStartDate = this.getView().byId("frmStrtDateExt").getValue();
				InputStartDate = InputStartDate.split('.');
				var sToStartDate = InputStartDate[2] + InputStartDate[1] + InputStartDate[0];

				//	var sToStartDate = this.convertDate(new Date(this.getView().byId("frmStrtDateExt").getValue()));
				var sToEndDate = this.getView().byId("toEndDateExt").getValue();
				var sRemarks = this.getView().byId("toRemarksExt").getValue();
				var clientAddr2 = this.getView().byId("clientAdd2Ext").getValue();
				if (oFromData.Zzalsta === "RIW") {
					var AllocFlag = "R";
				} else {
					var AllocFlag = "A";
				}

				var createData = {
					"IvRemarks": sRemarks,
					"IAmndtNo": oFromData.AmmendmentNo,
					"EvMessage": "",
					"IDeputationNo": oFromData.DeputationNo,
					"ET_CREATE_DEPUTATION": [],
					"ET_CREATE_DEPUTATION_TO": [],
					"ET_CLIENT_DETAILS": [],
					"ET_ALLOCATION_DETAILS": []
				};
				createData.ET_CREATE_DEPUTATION.push({
					"PsNumber": oFromData.Pernr,
					"L1Wbs": oFromData.Zzl1Wbs,
					"DeputationType": "",
					"StartDate": oFromData.Begda,
					"EndDate": oFromData.Endda,
					"Country": oFromData.ZzcountryDes,
					"Location": oFromData.ZzlocDesc,
					"L1Description": oFromData.L3WbsDesc,
					"CountryCode": oFromData.Zzcountry,
					"LocationCode": oFromData.Location,
					"City": oFromData.CityFrom
				});
				createData.ET_CREATE_DEPUTATION_TO.push({
					"StartDateTo": sToStartDate,
					"EndDateTo": sToEndDate,
					"Percentage": iPercentage,
					"CountryTo": oFromData.Zzcountry,
					"LocationTo": oFromData.Location,
					"CityTo": oFromData.City
				});
				createData.ET_CLIENT_DETAILS.push({
					"EmpPernr": oFromData.Pernr,
					"CaseNumber": oVisaData.Casenumber,
					"ClientName": oVisaData.ClientName,
					"ClientCountry": oVisaData.clientCountryCode,
					"ClientState": oVisaData.State,
					"ClientCity": oVisaData.City,
					"ClientAdd1": oVisaData.AddressLine1,
					"ClientAdd2": oVisaData.AddressLine2,
					"ClientPincode": oVisaData.Zipcode
				});
				createData.ET_ALLOCATION_DETAILS.push({
					"Emplid": oFromData.Pernr,
					"L1Wbs": oFromData.Zzl1Wbs,
					"L3Wbs": oFromData.Zzl3Wbs,
					"AllocSd": oFromData.Begda,
					"AllocEnd": oFromData.Endda,
					"Rate": oFromData.ZzrateId,
					"Po": oFromData.Po,
					"PoNumber": oFromData.PoNumber,
					"Role": oFromData.Zzrole,
					"Irm": oFromData.ZzimRepMgr,
					"AllocStatus": AllocFlag
				});
				// (PsNumber='" + oFromData.Pernr + "',ClientName='" + oFromData.ClientName + "',ClientCountry='" +
				// 	oToData.clientCountry + "',L1Wbs='" + oFromData.Zzl1Wbs +
				// 	"',ClientState='" + oToData.clientLocation + "',DeputationType='',StartDate='" +
				// 	oFromData.Begda + "',ClientCity='" + oToData.clientCity + "',ClientAdd1='" + oToData.clientAdd1 + "',ClientAdd2='" + clientAddr2 +
				// 	"',ClientPincode='" + oToData.clientPincode + "',City='" + oToData.fromCity + "',EndDate='" + oFromData.Endda +
				// 	"',CityTo='" + oToData.toCity + "',Country='" + oFromData.fromCountryD +
				// 	"',Location='" + oFromData.fromLocationD + "',L1Description='" + oFromData.L1Desc + "',CountryCode='" + oFromData.fromCountry +
				// 	"',LocationCode='" + oFromData.fromLocation + "',StartDateTo='" + sToStartDate + "',EndDateTo='" + sToEndDate + "',Percentage=" +
				// 	iPercentage + "m,CountryTo='" + oFromData.Country + "',LocationTo='" + oFromData.PlantStort + "',IvRemarks='" + sRemarks + "')
				oTravelModel.create("/OVR_EXTEND_DEPTSet", createData, null,
					function (oData, oResponse) {
						debugger;
						if (oData.EvMessage[0] == "S") {
							oData.EvMessage = oData.EvMessage.split("S");

							//if (oData.EvMessage !== "") {
							var dialog = new Dialog({
								title: "Success",
								type: "Message",
								state: "Success",
								content: new Text({
									text: oData.EvMessage[1]
								}),
								beginButton: new Button({
									text: "Close",
									press: function () {
										dialog.close();
										that.resetCreate();
										that.refershDept();
									}
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});

							dialog.open();

						} else {
							that.oBusyDialog.close();
							oData.EvMessage = oData.EvMessage.split("E");
							that.errorDialog.getContent()[0].setText(oData.EvMessage[1]);
							that.errorDialog.open();
						}

					},
					function (oError) {

						that.oBusyDialog.close();
						that.errorDialog.getContent()[0].setText(" Data fetch failed");
						that.errorDialog.open();
					});
			} else if (oFromData.Operation === "M") {
				//	var oToData = this.getView().getModel("oOvrSelectedModel").getData();
				var oVisaData = this.getView().getModel("OvisaClientModel").getData();
				var sToStartDate = this.getView().byId("frmStrtDateMod").getValue();
				var sToEndDate = this.getView().byId("toEndDateMod").getValue();
				var sRemarks = oFromData.Remarks;
				var clientAddr2 = this.getView().byId("clientAdd2Mod").getValue();
				/*	if (oFromData.Zzalsta === "RIW") {
						var AllocFlag = "R";
					} else {
						var AllocFlag = "A";
					}*/

				if (oFromData.AEndDateupdated === oFromData.AllocEd) {
					oFromData.AllocEd = oFromData.AllocEd;
				} else {
					//	obj.EndDate = that.stdDateFormat(AEndDate);
					oFromData.AllocEd = oFromData.AEndDateupdated;
				}
				var createData = {
					"IvRemarks": sRemarks,
					"EvError": "",
					"EvSuccess": "",
					"IvOperation": oFromData.Operation,
					"CRT_DEPUSet": [],
					"CRT_DEPU_TOSet": [],
					"CLIENT_DETAILSSet": [],
					"ALLOCATION_DETAILSSet": []
				};
				createData.CRT_DEPUSet.push({
					"PsNumber": oFromData.Emplid,
					"L1Wbs": oFromData.ProjectId,
					"DeputationType": "",
					"StartDate": oFromData.AllocSd,
					"EndDate": oFromData.AllocEd,
					"Country": oFromData.BaseCountry,
					"Location": oFromData.BaseLoc,
					"L1Description": oFromData.DetailDescr,
					"CountryCode": oFromData.CountryFrom,
					"LocationCode": oFromData.BaseLocCode,
					"City": oFromData.CityFrom
				});
				createData.CRT_DEPU_TOSet.push({
					"StartDateTo": sToStartDate,
					"EndDateTo": sToEndDate,
					"Percentage": iPercentage,
					"CountryTo": oFromData.Country,
					"LocationTo": oFromData.Location,
					"CityTo": oFromData.City
				});
				createData.CLIENT_DETAILSSet.push({
					"EmpPernr": oFromData.Emplid,
					"CaseNumber": oVisaData.Casenumber,
					"ClientName": oVisaData.ClientName,
					"ClientCountry": oVisaData.clientCountryCode,
					"ClientState": oVisaData.State,
					"ClientCity": oVisaData.City,
					"ClientAdd1": oVisaData.AddressLine1,
					"ClientAdd2": oVisaData.AddressLine2,
					"ClientPincode": oVisaData.Zipcode
				});
				createData.ALLOCATION_DETAILSSet.push({
					"Emplid": oFromData.Emplid,
					"L1Wbs": oFromData.ProjectId,
					"L3Wbs": oFromData.L3WbsConv,
					"AllocSd": oFromData.AllocSd,
					"AllocEnd": oFromData.AllocEd,
					"Rate": oFromData.Rate,
					"Po": oFromData.Po,
					"PoNumber": oFromData.PoNumber,
					"Role": oFromData.Role,
					"Irm": oFromData.Irm,
					"AllocStatus": oFromData.Zzalsta
				});
				// (PsNumber='" + oFromData.Pernr + "',ClientName='" + oFromData.ClientName + "',ClientCountry='" +
				// 	oToData.clientCountry + "',L1Wbs='" + oFromData.Zzl1Wbs +
				// 	"',ClientState='" + oToData.clientLocation + "',DeputationType='',StartDate='" +
				// 	oFromData.Begda + "',ClientCity='" + oToData.clientCity + "',ClientAdd1='" + oToData.clientAdd1 + "',ClientAdd2='" + clientAddr2 +
				// 	"',ClientPincode='" + oToData.clientPincode + "',City='" + oToData.fromCity + "',EndDate='" + oFromData.Endda +
				// 	"',CityTo='" + oToData.toCity + "',Country='" + oFromData.fromCountryD +
				// 	"',Location='" + oFromData.fromLocationD + "',L1Description='" + oFromData.L1Desc + "',CountryCode='" + oFromData.fromCountry +
				// 	"',LocationCode='" + oFromData.fromLocation + "',StartDateTo='" + sToStartDate + "',EndDateTo='" + sToEndDate + "',Percentage=" +
				// 	iPercentage + "m,CountryTo='" + oFromData.Country + "',LocationTo='" + oFromData.PlantStort + "',IvRemarks='" + sRemarks + "')
				oAllocoDataModel.create("/OVR_CREATE_DEPTSet", createData, null,
					function (oData, oResponse) {
						debugger;
						if (oData.EvSuccess !== "") {
							var dialog = new Dialog({
								title: "Success",
								type: "Message",
								state: "Success",
								content: new Text({
									text: oData.EvSuccess
								}),
								beginButton: new Button({
									text: "Close",
									press: function () {
										dialog.close();
										that.resetCreate();
										that.refershDept();
									}
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});

							dialog.open();

						} else {
							that.oBusyDialog.close();
							that.errorDialog.getContent()[0].setText(oData.EvError);
							that.errorDialog.open();
						}

					},
					function (oError) {
						that.oBusyDialog.close();
						that.errorDialog.getContent()[0].setText(" Data fetch failed");
						that.errorDialog.open();
					});
			}
		},
		onClose: function () {
			this.errorDialog.close();
		},
		onCountryf4Press: function (evt) {
			debugger;
			var oAllocoDataModel = this.getOwnerComponent().getModel("oAllocoDataModel");
			var oOvrDataModel = this.getOwnerComponent().getModel("oOvrDataModel");
			var that = this;
			if (oOvrSelectedModel.oData.Operation === 'C') {
				var pjctId = oOvrSelectedModel.oData.Zzl1Wbs;
				var sPernr = oOvrSelectedModel.oData.Pernr;
			} else if (oOvrSelectedModel.oData.Operation === 'M') {
				var pjctId = oOvrSelectedModel.oData.ProjectId;
				var sPernr = oOvrSelectedModel.oData.Emplid;
			} else if (oOvrSelectedModel.oData.Operation === 'E') {
				var pjctId = oOvrSelectedModel.oData.Zzl1Wbs;
				var sPernr = oOvrSelectedModel.oData.Pernr;
			}

			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			//oAllocoDataModel.read("/F4_COUNT_WBSSet?$filter=IvPsphi eq '" + pjctId + "'", null, null, true,
			oOvrDataModel.read("/WBS_DEPT_COUNTRYSet?$filter=IvPsphi eq '" + pjctId + "' and  IvPernr eq '" + sPernr + "'", null, null, true,
				function (oData, oResponse) {
					debugger;
					var oCountryModel = new JSONModel(oData);
					oCountryModel.iSizeLimit = 99999;
					that.oBusyDialog.close();
					that.getView().setModel(oCountryModel, "oCountryModel");
					oCountryModel.updateBindings(true);
					that.OvrTravelToCountryf4.open();
				},
				function (oError) {
					that.oBusyDialog.close();
					that.errorDialog.getContent()[0].setText(" Data fetch failed");
					that.errorDialog.open();
				});

		},
		handleOCountrySearch: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var sFilter = [new Filter("CountryName", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("CountryCode", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(sFilter, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleOCountryClose: function (oEvent) {
			debugger;

			var oSelData = oEvent.getParameters().selectedItem.getBindingContext("oCountryModel").getObject();
			/*	this.getView().byId("toCountry").setName(oSelData.CountryCode);
			 */
			var traveltoCountryModel = new JSONModel();
			this.getView().setModel(traveltoCountryModel, "traveltoCountryModel");
			traveltoCountryModel.setData(oSelData);
			if (oOvrSelectedModel.oData.Operation === 'C') {

				this.getView().byId("toCountry").setValueState("None");
				if (this.getView().byId("toCountry").getValue() !== "") {
					this.getView().byId("submitBtn").setEnabled(false);
					this.getView().byId("toVisaCaseNo").setValue();
					this.getView().byId("toVisaPermitType").setValue();
					this.getView().byId("toLocation").setValue();
					this.getView().byId("toCity").setValue();
					if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
						this.getView().getModel("OvisaClientModel").setData();
						this.getView().getModel("OvisaClientModel").refresh();
					}

				}
				this.getView().byId("toCountry").setName(oSelData.CountryCode);
				this.getView().byId("toCountry").setValue(oSelData.CountryName);
			} else if (oOvrSelectedModel.oData.Operation === 'M') {
				this.getView().byId("toCountryMod").setValueState("None");
				if (this.getView().byId("toCountryMod").getValue() !== "") {
					this.getView().byId("submitBtn").setEnabled(false);
					this.getView().byId("toVisaCaseNoMod").setValue();
					this.getView().byId("toVisaPermitTypeMod").setValue();
					this.getView().byId("toLocationMod").setValue();
					this.getView().byId("toCityMod").setValue();

					if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
						this.getView().getModel("OvisaClientModel").setData();
						this.getView().getModel("OvisaClientModel").refresh();
					}
				}
				this.getView().byId("toCountryMod").setName(oSelData.CountryCode);
				this.getView().byId("toCountryMod").setValue(oSelData.CountryName);
			} else if (oOvrSelectedModel.oData.Operation === 'E') {
				this.getView().byId("toCountryExt").setValueState("None");
				if (this.getView().byId("toCountryExt").getValue() !== "") {
					this.getView().byId("submitBtn").setEnabled(false);
					this.getView().byId("toVisaCaseNoExt").setValue();
					this.getView().byId("toVisaPermitTypeExt").setValue();
					this.getView().byId("toLocationExt").setValue();
					this.getView().byId("toCityExt").setValue();

					if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
						this.getView().getModel("OvisaClientModel").setData();
						this.getView().getModel("OvisaClientModel").refresh();
					}
				}
				this.getView().byId("toCountryExt").setName(oSelData.CountryCode);
				this.getView().byId("toCountryExt").setValue(oSelData.CountryName);
			}

			//	traveltoCountryModel.updateBindings(true);
		},
		onLocationf4Press: function (evt) {
			debugger;
			var oAllocoDataModel = this.getOwnerComponent().getModel("oAllocoDataModel");
			var that = this;

			if (oOvrSelectedModel.oData.Operation === 'C') {
				var ContryCode = this.getView().byId("toCountry").getName();
				var pjctId = oOvrSelectedModel.oData.Zzl1Wbs;
			} else if (oOvrSelectedModel.oData.Operation === 'M') {
				var ContryCode = this.getView().byId("toCountryMod").getName();
				var pjctId = oOvrSelectedModel.oData.ProjectId;

			} else if (oOvrSelectedModel.oData.Operation === 'E') {
				var ContryCode = this.getView().byId("toCountryExt").getName();
				var pjctId = oOvrSelectedModel.oData.Zzl1Wbs;
			}

			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			oAllocoDataModel.read("/PLANT_CODE_F4Set?$filter=IvCountry eq '" + ContryCode + "' and IvPsphi eq '" + pjctId + "'", null, null,
				true,
				function (oData, oResponse) {
					debugger;
					var oLocationModel = new JSONModel(oData);
					oLocationModel.iSizeLimit = 99999;
					that.oBusyDialog.close();
					that.getView().setModel(oLocationModel, "oLocationModel");
					oLocationModel.updateBindings(true);
					that.OvrTravelToLocf4.open();
				},
				function (oError) {
					that.oBusyDialog.close();
					that.errorDialog.getContent()[0].setText(" Data fetch failed");
					that.errorDialog.open();
				});
		},
		handleOLocationSearch: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var sFilter = [new Filter("Werks", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Post1", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(sFilter, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleOLocationClose: function (oEvent) {
			debugger;

			var oSelData = oEvent.getParameters().selectedItem.getBindingContext("oLocationModel").getObject();
			/**/
			/*	var OvisaClientModel = new sap.ui.model.json.JSONModel();
						OvisaClientModel.iSizeLimit = 99999;*/
			var traveltoLocModel = new JSONModel();
			this.getView().setModel(traveltoLocModel, "traveltoLocModel");
			traveltoLocModel.setData(oSelData);
			if (oOvrSelectedModel.oData.Operation === 'C') {
				this.getView().byId("toLocation").setValueState("None");
				if (this.getView().byId("toLocation").getValue() !== "") {
					this.getView().byId("submitBtn").setEnabled(false);
					this.getView().byId("toVisaCaseNo").setValue();
					this.getView().byId("toVisaPermitType").setValue();

					if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
						this.getView().getModel("OvisaClientModel").setData();
						this.getView().getModel("OvisaClientModel").refresh();
					}
				}
				this.getView().byId("toLocation").setValue(oSelData.Post1);
				this.getView().byId("toLocation").setName(oSelData.Stort);
			} else if (oOvrSelectedModel.oData.Operation === 'M') {
				this.getView().byId("toLocationMod").setValueState("None");

				if (this.getView().byId("toLocationMod").getValue() !== "") {
					this.getView().byId("submitBtn").setEnabled(false);
					this.getView().byId("toVisaCaseNoMod").setValue();
					this.getView().byId("toVisaPermitTypeMod").setValue();
					if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
						this.getView().getModel("OvisaClientModel").setData();
						this.getView().getModel("OvisaClientModel").refresh();
					}
				}
				this.getView().byId("toLocationMod").setValue(oSelData.Post1);
				this.getView().byId("toLocationMod").setName(oSelData.Stort);

			} else if (oOvrSelectedModel.oData.Operation === 'E') {
				this.getView().byId("toLocationExt").setValueState("None");
				if (this.getView().byId("toLocationExt").getValue() !== "") {
					this.getView().byId("submitBtn").setEnabled(false);
					this.getView().byId("toVisaCaseNoExt").setValue();
					this.getView().byId("toVisaPermitTypeExt").setValue();
					if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
						this.getView().getModel("OvisaClientModel").setData();
						this.getView().getModel("OvisaClientModel").refresh();
					}
				}
				this.getView().byId("toLocationExt").setValue(oSelData.Post1);
				this.getView().byId("toLocationExt").setName(oSelData.Stort);
			}

			//	traveltoLocModel.updateBindings(true);
		},
		onClientNamef4Press: function (evt) {
			debugger;

		},

		OnValidateVisaPress: function (evt) {
			debugger;
			var createValid = [];
			if (oOvrSelectedModel.oData.Operation === "M") {
				var StartDate = this.getView().byId("frmStrtDateMod");
				var EndDate = this.getView().byId("toEndDateMod");
				var Country = this.getView().byId("toCountryMod");
				var Location = this.getView().byId("toLocationMod");
				var City = this.getView().byId("toCityMod");
			} else if (oOvrSelectedModel.oData.Operation === "E") {
				var StartDate = this.getView().byId("frmStrtDateExt");
				var EndDate = this.getView().byId("toEndDateExt");
				var Country = this.getView().byId("toCountryExt");
				var Location = this.getView().byId("toLocationExt");
				var City = this.getView().byId("toCityExt");
			} else {
				var StartDate = this.getView().byId("frmStrtDate");
				var EndDate = this.getView().byId("toEndDate");
				var Country = this.getView().byId("toCountry");
				var Location = this.getView().byId("toLocation");
				var City = this.getView().byId("toCity");
			}

			/*var sClientAdd1 = this.getView().byId("clientAdd1");
			var sClientAdd2 = this.getView().byId("clientAdd2");
			var sClientPin = this.getView().byId("clientPincode");
			var sRemarks = this.getView().byId("toRemarks");*/
			if (StartDate.getValue() === "" || EndDate.getValue() === "" || Country.getValue() === "" || Location.getValue() ===
				"" || City.getValue() === "") {
				if (StartDate.getValue() === "") {
					createValid.push(StartDate);
				}
				if (EndDate.getValue() === "") {
					createValid.push(EndDate);
				}
				if (Country.getValue() === "") {
					createValid.push(Country);
				}
				if (Location.getValue() === "") {
					createValid.push(Location);
				}
				if (City.getValue() === "") {
					createValid.push(City);
				}

				for (var i = 0; i < createValid.length; i++) {
					createValid[i].setValueState("Error");
				}
				this.errorDialog.getContent()[0].setText("Fill all the mandatory fields");
				this.errorDialog.open();
			} else {
				if (oOvrSelectedModel.oData.Operation === "E") {
					var InputStartDate = StartDate.getValue();
					InputStartDate = InputStartDate.split('.');
					var BegDa = InputStartDate[2] + InputStartDate[1] + InputStartDate[0];
				} else {
					var BegDa = StartDate.getValue();
				}

				if (BegDa < EndDate.getValue()) {
					this.VisaPress();
				} else {
					this.errorDialog.getContent()[0].setText("Start Date should not be greater than End Date!");
					this.errorDialog.open();
				}

			}

		},
		VisaPress: function (evt) {
			debugger;
			var oAllocoDataModel = this.getOwnerComponent().getModel("oAllocoDataModel");
			var oVisaDataModel = this.getOwnerComponent().getModel("oVisaDataModel");
			if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
				this.getView().getModel("OvisaClientModel").setData();
				this.getView().getModel("OvisaClientModel").refresh();
			}
			var that = this;
			if (oOvrSelectedModel.oData.Operation === "M") {
				var CountryCode = this.getView().byId("toCountryMod").getName();
				var LocCode = this.getView().byId("toLocationMod").getName();
				var EndDa = this.getView().byId("toEndDateMod").getValue();
				var Pernr = oOvrSelectedModel.oData.Emplid;
				var BegDa = this.getView().byId("frmStrtDateMod").getValue();
				var pjctId = oOvrSelectedModel.oData.ProjectId;
			} else if (oOvrSelectedModel.oData.Operation === "E") {
				var CountryCode = this.getView().byId("toCountryExt").getName();
				var LocCode = this.getView().byId("toLocationExt").getName();
				var EndDa = this.getView().byId("toEndDateExt").getValue();
				var Pernr = oOvrSelectedModel.oData.Pernr;
				var InputStartDate = this.getView().byId("frmStrtDateExt").getValue();
				InputStartDate = InputStartDate.split('.');
				var BegDa = InputStartDate[2] + InputStartDate[1] + InputStartDate[0];
				var pjctId = oOvrSelectedModel.oData.Zzl1Wbs;
				//	var BegDa = this.convertDate(new Date(this.getView().byId("frmStrtDateExt").getValue()));

			} else {
				var CountryCode = this.getView().byId("toCountry").getName();
				var LocCode = this.getView().byId("toLocation").getName();
				var EndDa = this.getView().byId("toEndDate").getValue();
				var Pernr = oOvrSelectedModel.oData.Pernr;
				var BegDa = this.getView().byId("frmStrtDate").getValue();
				var pjctId = oOvrSelectedModel.oData.Zzl1Wbs;
			}
			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			oVisaDataModel.read("OVR_DEP_VISASet(ICountryCode='" + CountryCode + "',IEndDate='" + EndDa + "',IPlantCode='" + LocCode +
				"',IPsNumber='" +
				Pernr + "',IStartDate='" + BegDa + "',IProjId='" + pjctId + "')", null, null, false,
				function (oData, oResponse) {
					debugger;
					var tryflag = "";
					if (oData.Casenumber !== "") {

						if (oData.EvError !== "") {

							var dialog = new Dialog({
								title: "Warning",
								type: "Message",
								state: "Warning",
								content: new Text({
									//text: "No Valid Visa Record found for this Country."
									text: oData.EvError
								}),
								beginButton: new Button({
									text: "Yes",
									press: function () {

										dialog.close();
										tryflag = true;

										if (oOvrSelectedModel.oData.Operation === 'C') {
											/*that.getView().byId("toVisaCaseNo").setValue(oData.Casenumber);
											that.getView().byId("toVisaPermitType").setValue(oData.VisaPermitSubtype);*/
											var Casenumber = oData.Casenumber;
											var VisaPermitSubtype = oData.VisaPermitSubtype;
										} else { //if (oOvrSelectedModel.oData.Operation === 'M') {
											//that.getView().byId("toVisaCaseNoMod").setValue(oData.Casenumber);
											//that.getView().byId("toVisaPermitTypeMod").setValue(oData.VisaPermitSubtype);
											var Casenumber = oData.Casenumber;
											var VisaPermitSubtype = oData.VisaPermitSubtype;
										}
										//	that.checkExistingRecord(oData, oAllocDept, sPernr, sType);

										that.getView().byId("submitBtn").setEnabled(true);
										var oDataJson2 = {

										};
										var OvisaClientModel = new sap.ui.model.json.JSONModel();
										OvisaClientModel.iSizeLimit = 99999;

										var oAllocoDataModel = that.getOwnerComponent().getModel("oAllocoDataModel");
										///OVR_DEP_CLI_F4Set?$filter=ICaseNo eq 'US00286400SEP16WV16IS00045633'
										oAllocoDataModel.read("OVR_DEP_CLI_F4Set?$filter=ICaseNo eq '" + oData.Casenumber + "'", null, null, false,
											function (oData, oResponse) {
												if (oOvrSelectedModel.oData.Operation === 'C') {
													oData.results[0].clientCountry = that.getView().byId("toCountry").getValue();
													oData.results[0].clientCountryCode = that.getView().byId("toCountry").getName();
													oData.results[0].Casenumber = Casenumber;
													oData.results[0].VisaPermitSubtype = VisaPermitSubtype;
													if (((EndDa - BegDa) + 1) < 31) {
														that.getView().byId("toDepttype").setValue("Per-Diem");
													} else {
														that.getView().byId("toDepttype").setValue("Monthly");
													}
												} else {
													if (oOvrSelectedModel.oData.Operation === 'M') {
														oData.results[0].clientCountry = that.getView().byId("toCountryMod").getValue();
														oData.results[0].clientCountryCode = that.getView().byId("toCountryMod").getName();
														oData.results[0].Casenumber = Casenumber;
														oData.results[0].VisaPermitSubtype = VisaPermitSubtype;
														if (((EndDa - BegDa) + 1) < 31) {
															that.getView().byId("toDepttypeMod").setValue("Per-Diem");
														} else {
															that.getView().byId("toDepttypeMod").setValue("Monthly");
														}
													}
													if (oOvrSelectedModel.oData.Operation === 'E') {
														oData.results[0].clientCountry = that.getView().byId("toCountryExt").getValue();
														oData.results[0].clientCountryCode = that.getView().byId("toCountryExt").getName();
														oData.results[0].Casenumber = Casenumber;
														oData.results[0].VisaPermitSubtype = VisaPermitSubtype;
													}

												}

												OvisaClientModel.setData(oData.results[0]);
												that.getView().setModel(OvisaClientModel, "OvisaClientModel");
												that.oBusyDialog.close();
											},
											function (oError) {
												that.oBusyDialog.close();
												that.errorDialog.getContent()[0].setText(" Data fetch failed");
												that.errorDialog.open();
												//	that.getView().byId("submitBtn").setEnabled(true);
											});

										//	that.checkExistingRecord(oData, oAllocDept, sPernr, sType);
									}
								}),
								endButton: new Button({
									text: "No",
									press: function () {

										dialog.close();
										tryflag = false;

										if (!(that.getView().getModel("OvisaClientModel") === undefined)) {
											that.getView().getModel("OvisaClientModel").setData();
											that.getView().getModel("OvisaClientModel").refresh();
										}
										that.oBusyDialog.close();
										//	that.checkExistingRecord(oData, oAllocDept, sPernr, sType);
									}
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});
							dialog.open();

						} else {
							tryflag = true;
						}
						if (tryflag === true) {
							if (oOvrSelectedModel.oData.Operation === 'C') {
								/*that.getView().byId("toVisaCaseNo").setValue(oData.Casenumber);
								that.getView().byId("toVisaPermitType").setValue(oData.VisaPermitSubtype);*/
								var Casenumber = oData.Casenumber;
								var VisaPermitSubtype = oData.VisaPermitSubtype;
							} else { //if (oOvrSelectedModel.oData.Operation === 'M') {
								//that.getView().byId("toVisaCaseNoMod").setValue(oData.Casenumber);
								//that.getView().byId("toVisaPermitTypeMod").setValue(oData.VisaPermitSubtype);
								var Casenumber = oData.Casenumber;
								var VisaPermitSubtype = oData.VisaPermitSubtype;
							}
							//	that.checkExistingRecord(oData, oAllocDept, sPernr, sType);

							that.getView().byId("submitBtn").setEnabled(true);
							var oDataJson2 = {

							};
							var OvisaClientModel = new sap.ui.model.json.JSONModel();
							OvisaClientModel.iSizeLimit = 99999;

							var oAllocoDataModel = that.getOwnerComponent().getModel("oAllocoDataModel");
							///OVR_DEP_CLI_F4Set?$filter=ICaseNo eq 'US00286400SEP16WV16IS00045633'
							oAllocoDataModel.read("OVR_DEP_CLI_F4Set?$filter=ICaseNo eq '" + oData.Casenumber + "'", null, null, false,
								function (oData, oResponse) {
									if (oOvrSelectedModel.oData.Operation === 'C') {
										oData.results[0].clientCountry = that.getView().byId("toCountry").getValue();
										oData.results[0].clientCountryCode = that.getView().byId("toCountry").getName();
										oData.results[0].Casenumber = Casenumber;
										oData.results[0].VisaPermitSubtype = VisaPermitSubtype;
										if (((EndDa - BegDa) + 1) < 31) {
											that.getView().byId("toDepttype").setValue("Per-Diem");
										} else {
											that.getView().byId("toDepttype").setValue("Monthly");
										}
									} else {
										if (oOvrSelectedModel.oData.Operation === 'M') {
											oData.results[0].clientCountry = that.getView().byId("toCountryMod").getValue();
											oData.results[0].clientCountryCode = that.getView().byId("toCountryMod").getName();
											oData.results[0].Casenumber = Casenumber;
											oData.results[0].VisaPermitSubtype = VisaPermitSubtype;
											if (((EndDa - BegDa) + 1) < 31) {
												that.getView().byId("toDepttypeMod").setValue("Per-Diem");
											} else {
												that.getView().byId("toDepttypeMod").setValue("Monthly");
											}
										}
										if (oOvrSelectedModel.oData.Operation === 'E') {
											oData.results[0].clientCountry = that.getView().byId("toCountryExt").getValue();
											oData.results[0].clientCountryCode = that.getView().byId("toCountryExt").getName();
											oData.results[0].Casenumber = Casenumber;
											oData.results[0].VisaPermitSubtype = VisaPermitSubtype;
										}

									}

									OvisaClientModel.setData(oData.results[0]);
									that.getView().setModel(OvisaClientModel, "OvisaClientModel");
									that.oBusyDialog.close();
								},
								function (oError) {
									that.oBusyDialog.close();
									that.errorDialog.getContent()[0].setText(" Data fetch failed");
									that.errorDialog.open();
									//	that.getView().byId("submitBtn").setEnabled(true);
								});
						}

					} else {
						var a = oData.EvError.split("IVizon");
						if (a.length !== 1) {
							a[0] = a[0] + " \t";
							var dialog = new Dialog({
								title: "Error",
								type: "Message",
								state: "Error",
								/*	content: new Text({
										//text: "No Valid Visa Record found for this Country."
										text: 
									}),*/
								content: [new sap.m.Text({
										text: a[0]
									}),

									new sap.m.Link("linkcss", {
										text: "IVizon.",
										href: "https://ivizon.lntinfotech.com ",
										target: "_blank"

									})
								],
								beginButton: new Button({
									text: "OK",
									press: function () {

										dialog.close();
										that.getView().byId("submitBtn").setEnabled(false);
										//	that.checkExistingRecord(oData, oAllocDept, sPernr, sType);
									}
								}),
								afterClose: function () {
									dialog.destroy();
								}
							});
						} else {
							var dialog = new Dialog({
								title: "Error",
								type: "Message",
								state: "Error",
								content: new Text({
									//text: "No Valid Visa Record found for this Country."
									text: oData.EvError
								}),
								beginButton: new Button({
									text: "OK",
									press: function () {
										dialog.close();
										//	that.checkExistingRecord(oData, oAllocDept, sPernr, sType);
									}
								}),
								/*endButton: new Button({
									text: "No",
									press: function() {
										dialog.close();
										//	that.checkExistingRecord(oData, oAllocDept, sPernr, sType);
									}
								}),*/
								afterClose: function () {
									dialog.destroy();
								}
							});

						}

						dialog.open();
						that.oBusyDialog.close();
					}
				},
				function (oError) {
					that.oBusyDialog.close();
					that.errorDialog.getContent()[0].setText(" Data fetch failed");
					that.errorDialog.open();
					that.getView().byId("submitBtn").setEnabled(false);
				});
		},
		validateFields: function (oEvent) {
			if (oEvent.getSource().getValue() === "") {
				oEvent.getSource().setValueState("Error");
			} else {
				oEvent.getSource().setValueState("None");
				if (!(this.getView().getModel("OvisaClientModel") == undefined)) {
					this.getView().getModel("OvisaClientModel").setData();
					this.getView().getModel("OvisaClientModel").refresh();
				}
			}
			this.getView().byId("submitBtn").setEnabled(false);
		},
		validateSelectField: function (oEvent) {
			if (oEvent.getSource().getSelectedKey() === "Select") {
				oEvent.getSource().setValueState("Error");
			} else {
				oEvent.getSource().setValueState("None");

			}
			this.getView().byId("submitBtn").setEnabled(false);
		},

		/*26-11-2018 :  Role,Rate,PO,IRM F4 inclusion*/
		onRoleF4Press: function (evt) {
			debugger;
			this.onF4Press(evt, "Role");
		},
		handleRoleF4Search: function (evt) {
			debugger;
			this.onF4Search(evt, "Role");
		},
		handleRoleF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "Role");
		},

		onRateF4Press: function (evt) {
			debugger;
			this.onF4Press(evt, "Rate");
		},
		handleRateF4Search: function (evt) {
			debugger;
			this.onF4Search(evt, "Rate");
		},
		handleRateF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "Rate");
		},

		onPOF4Press: function (evt) {
			debugger;
			this.onF4Press(evt, "PO");
		},
		handlePOF4Search: function (evt) {
			debugger;
			this.onF4Search(evt, "PO");
		},
		handlePOF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "PO");
		},

		onIRMF4Press: function (evt) {
			debugger;
			this.onF4Press(evt, "IRM");
		},
		handleIRMF4Search: function (evt) {
			debugger;
			this.onF4Search(evt, "IRM");
		},
		handleIRMF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "IRM");
		},

		onF4Press: function (evt, id) {
			debugger;

			var oViewModel = this.getOwnerComponent().getModel("oViewModel");
			var that = this;

			if (oOvrSelectedModel.oData.Operation === 'C') {
				var pjctId = oOvrSelectedModel.oData.Zzl1Wbs;
				var Pernr = oOvrSelectedModel.oData.Pernr;
			} else if (oOvrSelectedModel.oData.Operation === 'M') {
				var pjctId = oOvrSelectedModel.oData.ProjectId;
				var Pernr = oOvrSelectedModel.oData.Pernr;
			} else if (oOvrSelectedModel.oData.Operation === 'E') {
				var pjctId = oOvrSelectedModel.oData.Zzl1Wbs;
				var Pernr = oOvrSelectedModel.oData.Pernr;
			}

			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			if (id === "Rate") {
				oViewModel.read("/BillRateIDSet?$filter=IvL3Wbs eq '' and  IvPernr eq '" + Pernr + "' and IvPsphi eq '" + pjctId + "'", null, null,
					true,
					function (oData, oResponse) {
						debugger;
						var oBillRatenModel = new JSONModel(oData);
						oBillRatenModel.iSizeLimit = 99999;
						that.oBusyDialog.close();
						that.getView().setModel(oBillRatenModel, "oBillRatenModel");
						oBillRatenModel.updateBindings(true);
						that.OvrBillRateF4.open();
					},
					function (oError) {
						that.oBusyDialog.close();
						that.errorDialog.getContent()[0].setText(" Data fetch failed");
						that.errorDialog.open();
					});
			} else if (id === "PO") {
				oViewModel.read("/POF4Set?$filter=IvL1Wbs eq '" + pjctId + "' ", null, null,
					true,
					function (oData, oResponse) {
						debugger;
						var oPOModel = new JSONModel(oData);
						oPOModel.iSizeLimit = 99999;
						that.oBusyDialog.close();
						that.getView().setModel(oPOModel, "oPOModel");
						oPOModel.updateBindings(true);
						that.OvrPOF4.open();
					},
					function (oError) {
						that.oBusyDialog.close();
						that.errorDialog.getContent()[0].setText(" Data fetch failed");
						that.errorDialog.open();
					});
			} else if (id === "IRM") {
				oViewModel.read("ReportSet?$filter=IvPosid eq '" + pjctId + "' ", null, null,
					true,
					function (oData, oResponse) {
						debugger;
						var oIRMModel = new JSONModel(oData);
						oIRMModel.iSizeLimit = 99999;
						that.oBusyDialog.close();
						that.getView().setModel(oIRMModel, "oIRMModel");
						oIRMModel.updateBindings(true);
						that.OvrIRMF4.open();

					},
					function (oError) {
						that.oBusyDialog.close();
						that.errorDialog.getContent()[0].setText(" Data fetch failed");
						that.errorDialog.open();
					});
			} else if (id === "Role") {
				oViewModel.read("ZRoleSet", null, null,
					true,
					function (oData, oResponse) {
						debugger;
						var oRoleModel = new JSONModel(oData);
						oRoleModel.iSizeLimit = 99999;
						that.oBusyDialog.close();
						that.getView().setModel(oRoleModel, "oRoleModel");
						oRoleModel.updateBindings(true);
						that.OvrRoleF4.open();

					},
					function (oError) {
						that.oBusyDialog.close();
						that.errorDialog.getContent()[0].setText(" Data fetch failed");
						that.errorDialog.open();
					});
			}

		},
		onF4Search: function (oEvent, id) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			if (id === "Rate") {
				var sFilter = [new Filter("RateId", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Defn", sap.ui.model.FilterOperator.Contains, sValue)
				];
			} else if (id === "PO") {
				var sFilter = [new Filter("Value", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Tnmpo", sap.ui.model.FilterOperator.Contains, sValue)
				];
			} else if (id === "IRM") {
				var sFilter = [new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("PsNumber", sap.ui.model.FilterOperator.Contains, sValue)
				];
			} else if (id === "Role") {
				var sFilter = [new Filter("RoleCode", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("RoleDesc", sap.ui.model.FilterOperator.Contains, sValue)
				];
			}

			oFilter = new sap.ui.model.Filter(sFilter, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleF4Close: function (oEvent, id) {
			debugger;
			var oSelData;
			//{
			if (oOvrSelectedModel.oData.Operation === 'C') {
				if (id === "Rate") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oBillRatenModel").getObject();
					this.getView().byId("Rate").setValueState("None");
					this.getView().byId("Rate").setValue(oSelData.RateId);
					//this.getView().byId("Rate").setName(oSelData.Defn);
				} else if (id === "PO") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oPOModel").getObject();
					this.getView().byId("PO").setValueState("None");
					this.getView().byId("PO").setValue(oSelData.Tnmpo);
					this.getView().byId("PO").setName(oSelData.Value);
				} else if (id === "IRM") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oIRMModel").getObject();
					this.getView().byId("IRM").setValueState("None");
					this.getView().byId("IRM").setValue(oSelData.PsNumber);
					//	this.getView().byId("IRM").setName(oSelData.Name);
				} else if (id === "Role") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oRoleModel").getObject();
					this.getView().byId("Role").setValueState("None");
					this.getView().byId("Role").setValue(oSelData.RoleCode);
					//	this.getView().byId("IRM").setName(oSelData.Name);
				}
			} else if (oOvrSelectedModel.oData.Operation === 'M') {
				if (id === "Rate") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oBillRatenModel").getObject();
					this.getView().byId("RateMod").setValueState("None");
					this.getView().byId("RateMod").setValue(oSelData.RateId);
					//this.getView().byId("RateMod").setName(oSelData.Defn);
				} else if (id === "PO") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oPOModel").getObject();
					this.getView().byId("POMod").setValueState("None");
					this.getView().byId("POMod").setValue(oSelData.Tnmpo);
					this.getView().byId("POMod").setName(oSelData.Value);
				} else if (id === "IRM") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oIRMModel").getObject();
					this.getView().byId("IRMMod").setValueState("None");
					this.getView().byId("IRMMod").setValue(oSelData.PsNumber);
					//	this.getView().byId("IRMMod").setName(oSelData.Name);
				} else if (id === "Role") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oRoleModel").getObject();
					this.getView().byId("RoleMod").setValueState("None");
					this.getView().byId("RoleMod").setValue(oSelData.RoleCode);
					//	this.getView().byId("IRM").setName(oSelData.Name);
				}
			} else if (oOvrSelectedModel.oData.Operation === 'E') {
				if (id === "Rate") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oBillRatenModel").getObject();
					this.getView().byId("RateExt").setValueState("None");
					this.getView().byId("RateExt").setValue(oSelData.RateId);
					//this.getView().byId("RateExt").setName(oSelData.Defn);
				} else if (id === "PO") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oPOModel").getObject();
					this.getView().byId("POExt").setValueState("None");
					this.getView().byId("POExt").setValue(oSelData.Tnmpo);
					this.getView().byId("POExt").setName(oSelData.Value);
				} else if (id === "IRM") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oIRMModel").getObject();
					this.getView().byId("IRMExt").setValueState("None");
					this.getView().byId("IRMExt").setValue(oSelData.PsNumber);
					//this.getView().byId("IRMExt").setName(oSelData.Name);
				} else if (id === "Role") {
					oSelData = oEvent.getParameters().selectedItem.getBindingContext("oRoleModel").getObject();
					this.getView().byId("RoleExt").setValueState("None");
					this.getView().byId("RoleExt").setValue(oSelData.RoleCode);
					//	this.getView().byId("IRM").setName(oSelData.Name);
				}
			}
			//	}

			//	traveltoLocModel.updateBindings(true);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZDeputation.view.OverseasDeputation
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZDeputation.view.OverseasDeputation
		 */
		onAfterRendering: function () {
			debugger;
			var homePage = this.getOwnerComponent()._oViews._oViews["ZResourceRPM.view.Main"];
			if (homePage === undefined) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Main");
			}
		}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf ZResourceRPM.view.DeputExt
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZResourceRPM.view.DeputExt
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZResourceRPM.view.DeputExt
		 */
		//	onExit: function() {
		//
		//	}

	});

});