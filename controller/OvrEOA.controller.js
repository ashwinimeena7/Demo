sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/BusyDialog",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",

	"sap/m/Dialog",
	"sap/m/Text",
	"ZResourceRPM/model/formatter",
	"sap/m/Button"
], function (Controller, BusyDialog, Filter, JSONModel, Dialog, Text, formatter, Button) {
	"use strict";

	return Controller.extend("ZResourceRPM.controller.OvrEOA", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZResourceRPM.view.OvrEOA
		 */
		formatter: formatter,
		navToBack: function (evt) {
			debugger;
			this.onClearPress();
			if (!(this.getView().getModel("eoaModel") == undefined)) {
				this.getView().getModel("eoaModel").setData();
				this.getView().getModel("eoaModel").refresh();
			}
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main");
		},
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

			this.errorDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.errorMsgDialog", this);
			this.getView().addDependent(this.errorDialog);
			this.errorDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.osPsnoDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.overseasPsnoDialog", this);
			this.getView().addDependent(this.osPsnoDialog);
			this.osPsnoDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.oPUDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.DeputPU", this);
			this.getView().addDependent(this.oPUDialog);
			this.oPUDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.oDUDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.DeputDU", this);
			this.getView().addDependent(this.oDUDialog);
			this.oDUDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());

		},

		onClearPress: function (evt) {
			debugger;
			//this.getView().byId("DU").setVisible(false);
			//	this.getView().byId("idInpDU").setVisible(false);
			this.getView().byId("PU").setVisible(true);
			this.getView().byId("idInpPU").setVisible(true);
			this.getView().byId("PSNO").setVisible(true);
			this.getView().byId("idInpPsno").setVisible(true);

			//	this.getView().byId("idInpDU").setValue();
			this.getView().byId("idInpPsno").setValue();
			this.getView().byId("idInpPU").setValue();
			if (!(this.getView().getModel("eoaModel") == undefined)) {
				this.getView().getModel("eoaModel").setData();
				this.getView().getModel("eoaModel").refresh();
			}
		},

		onDisplay: function () {
			debugger;
			var Du;
			var Pu;
			var pernr = this.getView().byId("idInpPsno").getValue();
			//	Pu = this.getView().byId("idInpDU").getValue();
			Pu = this.getView().byId("idInpPU").getValue();
			if (Pu === "") {
				this.errorDialog.getContent()[0].setText("Select PU to proceed.");
				this.errorDialog.open();
			} else if (pernr === "") {
				this.errorDialog.getContent()[0].setText("Select the Employee ID to proceed.");
				this.errorDialog.open();
			} else {
				var oVisaModel = this.getOwnerComponent().getModel("oVisaDataModel");
				var that = this;
				this.oBusyDialog = new BusyDialog();
				this.oBusyDialog.open();
				var oUser = sap.ushell.Container.getUser().getId();
				oVisaModel.read("/OVRSEAS_EOA_LISTSet?$filter=IvFlag eq '' and IvEmpid eq '" + pernr + "' and IvPmid eq '" + oUser + "'", null,
					null, true,
					function (oData, oResponse) {
						debugger;
						if (oData.results[0].Emplid === "00000000" || oData.results[0].Emplid === "") {
							var eoaModel = new JSONModel("");
							that.getView().setModel(eoaModel, "eoaModel");
							that.oBusyDialog.close();
							that.msgDialog.open();
						} else {
							that.getView().byId("submitBtn").setEnabled(true);
							var eoaModel = new JSONModel(oData.results[0]);
							that.getView().setModel(eoaModel, "eoaModel");
							eoaModel.updateBindings(true);
							that.oBusyDialog.close();
						}
					},
					function (oError) {
						that.oBusyDialog.close();
						that.errorDialog.getContent()[0].setText(" Data fetch failed");
						that.errorDialog.open();
					});
			}
		},

		onSubmitValid: function () {
			debugger;
			var pernr = this.getView().byId("idInpPsno").getValue();
			if (pernr === "") {
				this.errorDialog.getContent()[0].setText("Enter Employee Id");
				this.errorDialog.open();
			} else {

				var eoaValid = [];
				var assignEndDate = this.getView().byId("assignmentEndDate");
				var deptDate = this.getView().byId("deptDate");
				var returnDate = this.getView().byId("returnDate");
				var reportDate = this.getView().byId("reportingDate");
				if (deptDate.getValue() === "" || returnDate.getValue() === "" || reportDate.getValue() === "" || assignEndDate.getValue() === "") {
					if (deptDate.getValue() === "") {
						eoaValid.push(deptDate);
					}
					if (assignEndDate.getValue() === "") {
						eoaValid.push(assignEndDate);
					}
					if (returnDate.getValue() === "") {
						eoaValid.push(returnDate);
					}
					if (reportDate.getValue() === "") {
						eoaValid.push(reportDate);
					}
					for (var i = 0; i < eoaValid.length; i++) {
						eoaValid[i].setValueState("Error");
					}
					this.errorDialog.getContent()[0].setText("Fill all the mandatory fields");
					this.errorDialog.open();
				} else {
					this.openSubmitDialog();
				}
			}
		},
		validateFields: function (oEvent) {
			if (oEvent.getSource().getValue() === "") {
				oEvent.getSource().setValueState("Error");
			} else {
				oEvent.getSource().setValueState("None");
			}
		},
		openSubmitDialog: function () {
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
						that.onSubmit();
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
		onSubmit: function () {
			debugger;
			var oVisaModel = this.getOwnerComponent().getModel("oVisaDataModel");
			var that = this;
			var eoaModel = this.getView().getModel("eoaModel").getData();
			var arrivalDate = this.convertDate(this.getView().byId("arrivalDate").getValue());
			var deptDate = this.convertDate(this.getView().byId("deptDate").getValue());
			var returnDate = this.convertDate(this.getView().byId("returnDate").getValue());
			var reportDate = this.convertDate(this.getView().byId("reportingDate").getValue());
			var assignEndDate = this.convertDate(this.getView().byId("assignmentEndDate").getValue());
			this.oBusyDialog = new BusyDialog();
			this.oBusyDialog.open();
			oVisaModel.read("OVRSEAS_DEPT_EOA_SUBSet(IpAmndtNo='" + eoaModel.AmmendmentNo + "',EodEdate='" + assignEndDate + "',ArrivalDate='" +
				arrivalDate + "',DepartureDate='" + deptDate + "',ReturnDate='" + returnDate + "',ReportingDate='" + reportDate +
				"',IpDeputationNo='" + eoaModel.DeputationNo + "')", null, null, true,
				function (oData, oResponse) {
					debugger;
					that.oBusyDialog.close();
					if (oData.EvError === "") {
						var dialog = new Dialog({
							title: "Success",
							type: "Message",
							state: "Success",
							content: new Text({
								text: oData.EvMessage
							}),
							beginButton: new Button({
								text: "Close",
								press: function () {
									dialog.close();
									/*that.getView().byId("idInpPsno").getValue();
									var eoaModel = new JSONModel("");
									that.getView().setModel(eoaModel, "eoaModel");
									var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
									oRouter.navTo("Home");*/
									that.onClearPress();
								}
							}),
							afterClose: function () {
								dialog.destroy();
							}
						});
						dialog.open();
					} else {
						that.errorDialog.getContent()[0].setText(oData.EvError);
						that.errorDialog.open();
					}
				},
				function (oError) {
					that.oBusyDialog.close();
					that.errorDialog.getContent()[0].setText(" Data fetch failed");
					that.errorDialog.open();
				});
		},
		convertDate: function (sDate) {
			debugger;
			if (sDate !== "") {
				var newDate = sDate.split(".");
				newDate = newDate[2] + newDate[1] + newDate[0];
				return newDate;
			} else {
				return "";
			}

		},
		onClose: function () {
			this.errorDialog.close();
		},
		onCloseMessage: function () {
			this.msgDialog.close();
		},
		onPUF4Click: function (evt) {
			debugger;
			this.onF4Press(evt, "PU");
		},
		onDUF4Click: function (evt) {
			debugger;
			this.onF4Press(evt, "DU");
		},
		onPSNOF4Click: function (evt) {
			debugger;
			var Pu_key = this.getView().byId("idInpPU").getValue();
			if (Pu_key === "") {
				this.errorDialog.getContent()[0].setText(" Select PU First");
				this.errorDialog.open();
			} else {
				this.onF4Press(evt, "PSNO");
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
		onPSNOLiveChangeClick: function (evt) {
			debugger;

			this.onF4Search(evt, "PSNO");

		},
		onPUF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "PU");
		},
		onDUF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "DU");
		},
		onPSNOF4Close: function (evt) {
			debugger;
			this.handleF4Close(evt, "PSNO");
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
			} else if (id === "PSNO") {
				debugger;
				var Pu_key = this.getView().byId("idInpPU").getValue();
				var Du_key = '';
				//this.getView().byId("idInpDU").getValue();
				oRPMModel.read("/PERNR_RPM_F4Set?$filter=Du eq '" + Du_key + "' and Pu eq '" + Pu_key + "'", null, null, true,
					function (oData, oResponse) {
						debugger;
						var oPsNoModel = new JSONModel(oData);
						oPsNoModel.iSizeLimit = 99999;
						that.oBusyDialog.close();
						that.getView().setModel(oPsNoModel, "oPsNoModel");
						oPsNoModel.updateBindings(true);
						that.osPsnoDialog.open();
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
			var filters;
			if (id === "PU") {
				filters = [new Filter("Pu", sap.ui.model.FilterOperator.Contains, sValue),
					new Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)
				];
			} else if (id === "DU") {
				filters = [new Filter("Zzdu", sap.ui.model.FilterOperator.Contains, sValue)];
			} else if (id === "PSNO") {
				filters = [new Filter("Pernr", sap.ui.model.FilterOperator.Contains, sValue)];
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

					//this.getView().byId("idInpDU").setVisible(false);
					//this.getView().byId("DU").setVisible(false);
					this.getView().byId("PSNO").setVisible(true);
					this.getView().byId("idInpPsno").setVisible(true);
				} else if (id === "DU") {
					var DUTitle = aContexts[0].getTitle();
					//	this.getView().byId("idInpDU").setValue(DUTitle);
					this.getView().byId("idInpPU").setVisible(false);
					this.getView().byId("PU").setVisible(false);
					this.getView().byId("PSNO").setVisible(true);
					this.getView().byId("idInpPsno").setVisible(true);
				} else if (id === "PSNO") {
					var oSelData = oEvent.getParameters().selectedItem.getBindingContext("oPsNoModel").getObject();
					this.getView().byId("idInpPsno").setValue(oSelData.Pernr);
					this.getView().byId("submitBtn").setEnabled(false);
					var eoaModel = new JSONModel("");
					this.getView().setModel(eoaModel, "eoaModel");
				}
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf ZResourceRPM.view.OvrEOA
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZResourceRPM.view.OvrEOA
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZResourceRPM.view.OvrEOA
		 */
		//	onExit: function() {
		//
		//	}

	});

});