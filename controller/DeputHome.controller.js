sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/DatePicker",
	"sap/m/BusyDialog",
	"sap/ui/model/json/JSONModel",

], function (Controller, Filter, MessageToast, MessageBox, Dialog, Button, Text, DatePicker, BusyDialog, JSONModel) {
	"use strict";

	return Controller.extend("ZResourceRPM.controller.DeputHome", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZResourceRPM.view.DeputHome
		 */
		onAfterRendering: function () {
			debugger;
			var homePage = this.getOwnerComponent()._oViews._oViews["ZResourceRPM.view.Main"];
			if (homePage === undefined) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Main");
			}
		},
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.oModel = this.getOwnerComponent().getModel("oModel");
			this.oMainModel = this.getOwnerComponent().getModel("oMainModel");
			var that = this;

			this.remarksDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.remarksDialog", this);
			this.getView().addDependent(this.remarksDialog);
			this.remarksDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			//	this.remarksDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.errorDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.errorMsgDialog", this);
			this.getView().addDependent(this.errorDialog);
			this.errorDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.PjctIdDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.PjctIdDialog", this);
			this.getView().addDependent(this.PjctIdDialog);
			this.PjctIdDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.oPUDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.DeputPU", this);
			this.getView().addDependent(this.oPUDialog);
			this.oPUDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.oDUDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.DeputDU", this);
			this.getView().addDependent(this.oDUDialog);
			this.oDUDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		goToBack: function (evt) {
			this.onClearPress();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main");
		},

		onClearPress: function (evt) {
			debugger;
			//this.getView().byId("DU").setVisible(true);
		//	this.getView().byId("idInpDU").setVisible(true);
			this.getView().byId("PU").setVisible(true);
			this.getView().byId("idInpPU").setVisible(true);
			this.getView().byId("PjctID").setVisible(true);
			this.getView().byId("idInpPjct").setVisible(true);
			//this.getView().byId("idInpDU").setValue();
			this.getView().byId("idInpPU").setValue();
			this.getView().byId("idInpPjct").setValue();
			this.getView().byId("deputaionPanelOverseas").setVisible(false);
		},
		onClose: function () {
			this.errorDialog.close();
		},
		onSearchValid: function (evt) {
			debugger;
			var Du;
			var Pu;
			var Pjctid = this.getView().byId("idInpPjct").getValue();
		//	Pu = this.getView().byId("idInpDU").getValue();
			Pu = this.getView().byId("idInpPU").getValue();
			if (Pu === "") {
				this.errorDialog.getContent()[0].setText("Select PU to proceed.");
				this.errorDialog.open();
			} else if (Pjctid === "") {
				this.errorDialog.getContent()[0].setText("Select the Project ID to proceed.");
				this.errorDialog.open();
			} else {
				this.onOvrPjctDisplay(evt, Pjctid);
			}

		},

		onOvrPjctDisplay: function (evt, sPjctId) {
			debugger;
			//PjctId=sPjctId;
			this.getView().byId("deputaionPanelOverseas").setVisible(true);
			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			var that = this;
			if (!(this.getView().getModel("oAllocOvrModel") === undefined)) {
				/*	this.getView().getModel("oAllocOvrModel").setData();
					this.getView().getModel("oAllocOvrModel").refresh();*/
				if (oAllocOvrModel.oData.results === 0) {
					if (!(oAllocOvrModel.oData.results[0].Zzl1Wbs === sPjctId)) {
						that.getView().setModel(null, "oAllocOvrModel");
					}
				}

			}
			var oDataJson2 = {
				results: []
			};
			var TempDataModel = new sap.ui.model.json.JSONModel();
			TempDataModel.iSizeLimit = 99999;
			var oDataJson = {
				results: []
			};
			var oDataJsontemp = {
				results: []
			};
			var oRPMModel = that.getOwnerComponent().getModel("oRPMModel");
			//var oTravelModel = this.getOwnerComponent().getModel("oTravelModel");
			oRPMModel.read("ALLOC_DISP_RPMSet?$filter=IvPosid eq '" + sPjctId + "'", null, null, true,
				function (oData, oResponse) {
					debugger;
					var obj = oData.results;

					for (var i = 0; i < obj.length; i++) {
						if (obj[i].DeputSd === "00000000") {
							obj[i].DeputSd = null;
						}
						if (obj[i].DeputEd === "00000000") {
							obj[i].DeputEd = null;
						}
						oDataJson2.results[i] = obj[i];
					}

					//var oAllocModel = new JSONModel(oDataJson2);
					oAllocOvrModel.setData(oDataJson2);

					//oAllocOvrModel.push(oDataJson);

					//that.getView().setModel(oAllocOvrModel, "oAllocOvrModel");
					that.oBusyDialog.close();

				},
				function (oError) {
					debugger;
					that.oBusyDialog.close();
					that.errorDialog.getContent()[0].setText("Data Fetch Failed");
					that.errorDialog.open();

				});
		},

		onOVRCancel: function (oEvent) {
			debugger;
			sap.ui.getCore().PassedData = new Object();
			sPernr = oAllocOvrModel.oData.results[((oEvent.oSource.oPropagatedProperties.oBindingContexts.oAllocOvrModel.sPath).split("/")[
				2])].Pernr;

			//			sap.ui.getCore().PassedData.selectedItem = oEvent.getSource().getParent().getParent().oBindingContexts.oAllocModel.getObject();
			//sap.ui.getCore().PassedData.selectedItem = oEvent.getSource().getParent().getParent().oBindingContexts.oAllocOvrModel.getObject();
			this.remarksDialog.open();
		},
		onCancel: function (oEvent) {
			debugger;
			sap.ui.getCore().PassedData = new Object();
			sap.ui.getCore().PassedData.selectedItem = oEvent.getSource().getParent().getParent().oBindingContexts.oAllocModel.getObject();
			this.remarksDialog.open();
		},
		onExit: function () {
			sap.ui.getCore().byId("idRemarks").setValue();
			this.remarksDialog.close();
		},
		onSubmit: function (oEvent) {
			debugger;
			var remarks = sap.ui.getCore().byId("idRemarks").getValue();
			if (remarks === "") {
				this.errorDialog.getContent()[0].setText("Kindly enter rejection remarks");
				this.errorDialog.open();
			} else {
				this.remarksDialog.close();
				var oModel = this.getOwnerComponent().getModel("oModel");
				var that = this;

				//	var sPernr = this.getView().byId("psNo").getName();
				var sMoveType = "OD";
				this.oBusyDialog = new BusyDialog();
				this.oBusyDialog.open();
				if (sMoveType === "OD") {
					var oAllocoDataModel = this.getOwnerComponent().getModel("oAllocoDataModel");
					var oOvrDataModel = this.getOwnerComponent().getModel("oOvrDataModel");
					oOvrDataModel.read("/OVR_DEP_EXIST_RECSet?$filter=IpPernr eq '" + sPernr + "'", null, null, true,
						//	oAllocoDataModel.read("/OVR_DEP_EXISTING_RECSet?$filter=IpPernr eq '" + sPernr + "'", null, null, true,
						function (oData, oResponse) {
							// /http://ltigwappldev.lntinfotech.com:8000/sap/opu/odata/SAP/ZOVERSEAS_DEPUTATION_V2_SRV/OVR_DEP_CANCELSet(IpAmmendmentNo='',IpDeputation='',IpRemark='')
							debugger;

							oAllocoDataModel.read("/OVR_DEP_CANCELSet(IpAmmendmentNo='" + oData.results[0].AmmendmentNo + "',IpDeputation='" + oData.results[
									0].DeputationNo +
								"',IpRemark='" + remarks + "')", null, null, true,
								function (oData, oResponse) {
									debugger;
									that.remarksDialog.getContent()[0].setValue();
									that.oBusyDialog.close();
									var dialog = new Dialog({
										title: "Success",
										type: "Message",
										state: "Success",
										content: new Text({
											text: oData.LvMessage
										}),
										beginButton: new Button({
											text: "Close",
											press: function () {
												dialog.close();
												that.onSearchValid();
											}
										}),
										afterClose: function () {
											dialog.destroy();
										}
									});
									dialog.open();
								},
								function (oError) {
									that.oBusyDialog.close();
									that.errorDialog.getContent()[0].setText(" Data fetch failed");
									that.errorDialog.open();
								});
						},
						function (oError) {
							that.oBusyDialog.close();
							that.errorDialog.getContent()[0].setText(" Data fetch failed");
							that.errorDialog.open();
						});
				}
			}
		},
		onRemarks: function (oEvent) {
			debugger;
			var remarks = oEvent.getSource().getValue();
			var re = /[`~!@#$%^&*()_|+\=?;'",<>\{\}\[\]\\\/]/gi;
			var isSplChar = re.test(remarks);
			if (isSplChar) {
				var noSplChar = remarks.replace(/[`~!@#$%^&*()_|+\=?;'",<>\{\}\[\]\\\/]/gi, "");
				oEvent.getSource().setValue(noSplChar);
			}
		},
		OnOvrCreate: function (oEvent) {
			debugger;
			var oModel = this.getOwnerComponent().getModel("oModel");
			var sMoveType = this.getView().byId("moveType").getSelectedKey();
			var PjctId = this.getView().byId("PjctId").getValue();
			//	var index = oEvent.oSource.oPropagatedProperties.oBindingContexts.oAllocOvrModel.sPath.split("/")[2];
			var TempModel = oAllocOvrModel.oData.results[((oEvent.oSource.oPropagatedProperties.oBindingContexts.oAllocOvrModel.sPath).split(
				"/")[
				2])];
			var perner = TempModel.Pernr;
			var Operation = TempModel.Operation;
			var Ename = TempModel.Ename;
			var BaseLoc = TempModel.BaseLocDesc;
			var BaseLocCode = TempModel.BaseLoc;
			var BaseCountry = TempModel.ZzcountryDes;
			var Zzpercent = TempModel.Zzpercent;
			var BaseStartDate = TempModel.Begda;
			var PoNumber = TempModel.PoNumber;
			var ApproverId = TempModel.ApproverId;
			var ApproverName = TempModel.ApproverName;
			var AllocStatus = TempModel.Zzalsta;
			var ProjType = TempModel.ProjType;
			var AEndDate = TempModel.Endda;
			var that = this;
			var sType;
			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			if (sMoveType === "ID") {
				sType = "I";
			} else if (sMoveType === "OD") {
				sType = "O";
			} else if (sMoveType === "TR") {
				sType = "T";
			}
			var oDataJson2 = {

			};
			var oDataJson = {

			};
			var PjctEndDate;
			//	if (AllocStatus === "RIW") {
			var oViewModel = that.getOwnerComponent().getModel("oViewModel");
			oViewModel.read("ProjInfoSet('" + PjctId + "') ", null, null,
				true,
				function (oData, oResponse) {
					debugger;
					PjctEndDate = that.stdDateFormat(oData.EndDate);
					if (Operation === 'C') {
						var oTravelModel = that.getOwnerComponent().getModel("oTravelModel");
						oTravelModel.read("/OVR_DEPT_VALIDATIONSet(IvDeputype='',IvPernr='" + perner + "',IvStart='" + BaseStartDate +
							"',IvType='O')",
							null, null, true,
							function (oData, oResponse) {
								debugger;
								if (oData.EvError !== "") {
									var dialog = new Dialog({
										title: "Error",
										type: "Message",
										state: "Error",
										content: new Text({
											text: oData.EvError
										}),
										beginButton: new Button({
											text: "Close",
											press: function () {
												dialog.close();
												that.oBusyDialog.close();

											}
										}),
										afterClose: function () {
											dialog.destroy();
										}
									});
									dialog.open();
								} else {
									var modelobj = oAllocOvrModel.oData.results;
									var modelobjlen = oAllocOvrModel.oData.results.length;
									//	if()

									for (var i = 0; i < modelobjlen; i++) {
										if ((perner == modelobj[i].Pernr) && (Operation == modelobj[i].Operation)) {
											debugger;
											modelobj[i].startDate = that.stdDateFormat(modelobj[i].Begda);
											if (modelobj[i].Zzalsta === "RIW") {

												modelobj[i].EndDate = PjctEndDate;
											} else {
												modelobj[i].EndDate = that.stdDateFormat(modelobj[i].Endda);
											}

											oDataJson2 = modelobj[i];
											break;
										}
									}
									oOvrSelectedModel.setData(oDataJson2);
									var ExtendModel = new sap.ui.model.json.JSONModel();
									ExtendModel.iSizeLimit = 99999;
									var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
									oRouter.navTo("OverseasDeputation");
									that.getView().getParent().getParent().getParent().byId("overseasDeputationView").setModel(oOvrSelectedModel,
										"oOvrSelectedModel");
									that.getView().getParent().getParent().getParent().byId("overseasDeputationView").setModel(ExtendModel, "ExtendModel");

									that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("submitBtn").setEnabled(false);
									if (ProjType === "X") {
										that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("RateLbl").setRequired(true);
									} else {
										that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("RateLbl").setRequired(false);
									}

									that.oBusyDialog.close();
								}

							},
							function (oError) {
								that.oBusyDialog.close();
								that.errorDialog.getContent()[0].setText(" Data fetch failed");
								that.errorDialog.open();
							});
					} else {

						if (Operation === 'M') {
							var oOvrDataModel = that.getOwnerComponent().getModel("oOvrDataModel");
							oOvrDataModel.read("OVR_DEP_EXIST_RECSet?$filter=IpPernr eq '" + perner + "'", null, null, false,
								function (oData, oResponse) {
									debugger;

									var obj = oData.results[0];
									//	obj.DeputSd = that.stdDateFormat(obj.DeputSd);
									//	obj.DeputEd = that.stdDateFormat(obj.DeputEd);

									obj.startDate = that.stdDateFormat(obj.AllocSd);
									var modelobj = oAllocOvrModel.oData.results;
									var modelobjlen = oAllocOvrModel.oData.results.length;
									for (var i = 0; i < modelobjlen; i++) {
										if ((perner == modelobj[i].Pernr) && (Operation == modelobj[i].Operation)) {
											debugger;
											//	modelobj[i].startDate = that.stdDateFormat(modelobj[i].Begda);
											if (modelobj[i].Zzalsta === "RIW") {
												obj.EndDate = PjctEndDate;
												obj.Zzalsta = "R";
											} else {
												if (AEndDate === obj.AllocEd) {
													obj.EndDate = that.stdDateFormat(obj.AllocEd);
												} else {
													obj.EndDate = that.stdDateFormat(AEndDate);
												}

												obj.Zzalsta = "A";
											}
										}
									}
									oDataJson = obj;
									oDataJson.Ename = Ename;
									oDataJson.Operation = Operation;
									oDataJson.BaseLoc = BaseLoc;
									oDataJson.BaseCountry = BaseCountry;
									oDataJson.BaseLocCode = BaseLocCode;
									oDataJson.Zzpercent = Zzpercent;
									oDataJson.PoNumber = PoNumber;
									oDataJson.ApproverId = ApproverId;
									oDataJson.ApproverName = ApproverName;
									oDataJson.ProjType = ProjType;
									oDataJson.AEndDateupdated = AEndDate;

								},
								function (oError) {
									that.oBusyDialog.close();
									that.errorDialog.getContent()[0].setText(" Data fetch failed");
									that.errorDialog.open();
									//	that.getView().byId("submitBtn").setEnabled(true);
								});
							oOvrSelectedModel.setData(oDataJson);
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("OverseasDeputation");
							that.getView().getParent().getParent().getParent().byId("overseasDeputationView").setModel(oOvrSelectedModel,
								"oOvrSelectedModel");
							//	that.getView().getParent().getParent().getParent().byId("overseasDeputationView").setModel(ExtendModel, "ExtendModel");

							that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("submitBtn").setEnabled(false);
							that.oBusyDialog.close();
							if (ProjType === "X") {
								that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("RateModLbl").setRequired(true);
							} else {
								that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("RateModLbl").setRequired(false);
							}
						}
						if (Operation === 'E') {

							var modelobj = oAllocOvrModel.oData.results;
							var modelobjlen = oAllocOvrModel.oData.results.length;
							//	if()

							for (var i = 0; i < modelobjlen; i++) {
								if ((perner == modelobj[i].Pernr) && (Operation == modelobj[i].Operation)) {
									debugger;
									var oTravelModel = that.getOwnerComponent().getModel("oTravelModel");
									oTravelModel.read("OVR_DEP_EXIST_REC_EXTSet?$filter=IpPernr eq '" + perner + "'", null, null, false,
										function (oData, oResponse) {
											debugger;

											var obj = oData.results[0];
											//	obj.DeputSd = that.stdDateFormat(obj.DeputSd);
											//	obj.DeputEd = that.stdDateFormat(obj.DeputEd);

											/*obj.startDate = that.stdDateFormat(obj.AllocSd);
											obj.EndDate = that.stdDateFormat(obj.AllocEd);

											oDataJson = obj;
											oDataJson.Ename = Ename;
											oDataJson.Operation = Operation;
											oDataJson.BaseLoc = BaseLoc;
											oDataJson.BaseCountry = BaseCountry;
											oDataJson.BaseLocCode = BaseLocCode;
											oDataJson.Zzpercent = Zzpercent;
											oDataJson.PoNumber = PoNumber;
											oDataJson.ApproverId = ApproverId;
											oDataJson.ApproverName = ApproverName;*/

											modelobj[i].startDate = that.stdDateFormat(modelobj[i].Begda);
											modelobj[i].EndDate = that.stdDateFormat(modelobj[i].Endda);
											modelobj[i].DeputEnddate = that.stdDateFormat(obj.DeputEd);

											oDataJson2 = modelobj[i];
											oDataJson2.AmmendmentNo = obj.AmmendmentNo;
											oDataJson2.CountryFrom = obj.CountryFrom;
											oDataJson2.CountryfromDecr = obj.CountryfromDecr;
											oDataJson2.DeputationNo = obj.DeputationNo;
											oDataJson2.DeputSd = obj.DeputSd;
											oDataJson2.DeputStrtDate = that.stdDateFormat(obj.DeputSd);
											oDataJson2.ProjType = ProjType;
										},
										function (oError) {
											that.oBusyDialog.close();
											that.errorDialog.getContent()[0].setText(" Data fetch failed");
											that.errorDialog.open();
											//	that.getView().byId("submitBtn").setEnabled(true);
										});

									break;
								}
							}
							oOvrSelectedModel.setData(oDataJson2);
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("OverseasDeputation");
							that.getView().getParent().getParent().getParent().byId("overseasDeputationView").setModel(oOvrSelectedModel,
								"oOvrSelectedModel");
							//	that.getView().getParent().getParent().getParent().byId("overseasDeputationView").setModel(ExtendModel, "ExtendModel");

							that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("submitBtn").setEnabled(false);
							that.oBusyDialog.close();
							if (ProjType === "X") {
								that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("RateExtLbl").setRequired(true);
							} else {
								that.getView().getParent().getParent().getParent().byId("overseasDeputationView").byId("RateExtLbl").setRequired(false);
							}
						}

					}
				},
				function (oError) {

					that.errorDialog.getContent()[0].setText(" Data fetch failed");
					that.errorDialog.open();
				});
			//	}

		},
		validateFields: function (oEvent) {
			if (oEvent.getSource().getValue() === "") {
				oEvent.getSource().setValueState("Error");
			} else {
				oEvent.getSource().setValueState("None");
			}
		},
		validateSelectField: function (oEvent) {
			if (oEvent.getSource().getSelectedKey() === "Select") {
				oEvent.getSource().setValueState("Error");
			} else {
				oEvent.getSource().setValueState("None");
			}
		},
		onPUF4Click: function (evt) {
			debugger;
			this.onF4Press(evt, "PU");
		},
		onDUF4Click: function (evt) {
			debugger;
			this.onF4Press(evt, "DU");
		},
		onPJCTF4Click: function (evt) {
			debugger;
				var PUIpt = this.getView().byId("idInpPU").getValue();
			if (PUIpt === "") {
				this.errorDialog.getContent()[0].setText(" Select PU First");
				this.errorDialog.open();
			} else {
					this.onF4Press(evt, "PJCT");
			}
		
		},
		onPULiveChangeClick: function (evt) {
			debugger;
			this.onF4Search(evt, "PU");
		},
		onDULiveChangeClick: function (evt) {
			debugger;
			this.onF4Search(evt, "DU");
		},
		onPJCTLiveChangeClick: function (evt) {
			debugger;
			this.onF4Search(evt, "PJCT");
		},
		onPUF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "PU");
		},
		onDUF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "DU");
		},
		onPJCTF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "PJCT");
		},
		onF4Press: function (evt, id) {
			debugger;
			var oModel = this.getOwnerComponent().getModel("oModel");
			var oRPMModel = this.getOwnerComponent().getModel("oRPMModel");
			var that = this;
			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			if (id === "PU") {
				oRPMModel.read("EOA_PU_DU_F4Set?$filter=IvKey eq '" + id + "'&$expand=IT_PU", null, null, true,
					function (oData, oResponse2) {
						debugger;
						var oMainModelPU = new JSONModel(oData.results[0].IT_PU);
						oMainModelPU.iSizeLimit = 99999;
						that.oBusyDialog.close();
						that.getView().setModel(oMainModelPU, "oMainModelPU");
						oMainModelPU.updateBindings(true);
						that.oPUDialog.open();

					},
					function (oError) {
						debugger;
						that.errorDialog.getContent()[0].setText("Data Fetch Failed");
						that.errorDialog.open();
					});
			} else if (id === "DU") {
				oRPMModel.read("EOA_PU_DU_F4Set?$filter=IvKey eq '" + id + "'&$expand=IT_DU", null, null, true,
					function (oData, oResponse2) {
						debugger;
						var oMainModelDU = new JSONModel(oData.results[0].IT_DU);
						oMainModelDU.iSizeLimit = 99999;
						that.oBusyDialog.close();
						that.getView().setModel(oMainModelDU, "oMainModelDU");
						oMainModelDU.updateBindings(true);
						that.oDUDialog.open();

					},
					function (oError) {
						debugger;
						that.errorDialog.getContent()[0].setText("Data Fetch Failed");
						that.errorDialog.open();
					});
			} else if (id === "PJCT") {
				debugger;
				var oRPMModel = this.getOwnerComponent().getModel("oRPMModel");
				var that = this;
				var DUIpt ='';
				//this.getView().byId("idInpDU").getValue();
				var PUIpt = this.getView().byId("idInpPU").getValue();
				//	this.oBusyDialog = new BusyDialog();

				oRPMModel.read("/RPM_PROJ_F4Set?$filter=Pu eq '" + PUIpt + "' and Du eq '" + DUIpt + "'", null, null, false,
					function (oData, oResponse) {
						debugger;
						var oPjctIDModel = new JSONModel(oData);
						oPjctIDModel.iSizeLimit = 99999;
						//that.oBusyDialog.close();
						that.getView().setModel(oPjctIDModel, "oPjctIDModel");
						oPjctIDModel.updateBindings(true);
						that.PjctIdDialog.open();
						that.oBusyDialog.close();
					},

					function (error) {
						debugger;
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
			var filters;
			if (id === "PU") {
				filters = [new Filter("Pu", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)
				];
			} else if (id === "DU") {
				filters = [new Filter("Zzdu", sap.ui.model.FilterOperator.Contains, sValue)];
			} else if (id === "PJCT") {
				filters = [new Filter("ProjectId", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("ProjDescrp", sap.ui.model.FilterOperator.Contains, sValue)
				];
			}

			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleF4Close: function (oEvent, id) {
				debugger;
				var aContexts = oEvent.getParameter("selectedItems");
				if (id === "PU") {
					//var PUDesc = aContexts[0].getInfo();
					var PUTitle = aContexts[0].getTitle();
					this.getView().byId("idInpPU").setValue(PUTitle);

				//	this.getView().byId("idInpDU").setVisible(false);
				//	this.getView().byId("DU").setVisible(false);
					this.getView().byId("PjctID").setVisible(true);
					this.getView().byId("idInpPjct").setVisible(true);
				} else if (id === "DU") {
					var DUTitle = aContexts[0].getTitle();
				//	this.getView().byId("idInpDU").setValue(DUTitle);
					this.getView().byId("idInpPU").setVisible(false);
					this.getView().byId("PU").setVisible(false);
					this.getView().byId("PjctID").setVisible(true);
					this.getView().byId("idInpPjct").setVisible(true);
				} else if (id === "PJCT") {
					var oSelData = oEvent.getParameters().selectedItem.getBindingContext("oPjctIDModel").getObject();
					this.getView().byId("idInpPjct").setValue(oSelData.ProjectId);
					this.getView().byId("idInpPjct").setName(oSelData.ProjDescrp);
				}
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf ZResourceRPM.view.DeputHome
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZResourceRPM.view.DeputHome
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZResourceRPM.view.DeputHome
		 */
		//	onExit: function() {
		//
		//	}

	});

});
var PUDUFlag;

var oAllocOvrModel = new sap.ui.model.json.JSONModel();
oAllocOvrModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
oAllocOvrModel.iSizeLimit = 99999;

var oOvrSelectedModel = new sap.ui.model.json.JSONModel();
oOvrSelectedModel.iSizeLimit = 99999;