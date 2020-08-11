sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/DatePicker"
], function(Controller, Filter, MessageToast, Dialog, Button, Text, DatePicker) {
	"use strict";

	return Controller.extend("ZResourceRPM.controller.DUPoolEditAllocation", {

		onInit: function(oEvent) {
			debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.oUser = sap.ushell.Container.getUser().getId();

			var MsgStripText = "Backdated Allocations before " + this.getOwnerComponent().Bdate + " will no longer be allowed.";
			this.getView().byId("idMsgStrip").setText(MsgStripText);

			DatePicker.prototype.onAfterRendering = function(evt) {
				$("#" + evt.srcControl.getId() + "-inner").prop("readonly", true);
			};

			// jQuery.sap.PseudoEvents.sapescape = function(oEvt) {};

			//ODataModel for ZGW_LTIL_RPM_SRV
			this.oModel = this.getOwnerComponent().getModel("oModel");
			//ODataModel for ZGW_RESOURCEFINAL_SRV
			this.oViewModel = this.getOwnerComponent().getModel("oViewModel");
			this.oMainModel = this.getOwnerComponent().getModel("oMainModel");

			this.oDUPoolEditAllModel = this.getOwnerComponent().getModel("oDUPoolEditAllModel");

			this.oOutputDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.PUOutput", this);
			this.getView().addDependent(this.oOutputDialog);
			this.oMessageDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.MessageDialog", this);
			this.getView().addDependent(this.oMessageDialog);
			this.oDepTrnsDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.DeputationTransfer", this);
			this.getView().addDependent(this.oDepTrnsDialog);

			var CurrentDate1 = new Date().setHours(0, 0, 0, 0);
			this.CurrentDate = new Date(CurrentDate1);

			var Data = {
				"ProjectID": {},
				"Role": {},
				"Country": {},
				"Location": {},
				"BillRate": {},
				"ReportMgr": {},
				"PODetails": {},
				"PrjInfo": {}
			};
			this.oDUModel = new sap.ui.model.json.JSONModel();
			this.oDUModel.setData(Data);
			this.oDUModel.iSizeLimit = 1000;
			this.getView().setModel(this.oDUModel, "oDUModel");

			this.idPrjIDDUPoolDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.PUOutput", this);
			this.getView().addDependent(this.idPrjIDDUPoolDialog);

			// if(this.oDUPoolEditAllModel.getData().DUDUPoolDisplay.length === 0){
			// 	this.goToBack();
			// } 

		},

		onAfterRendering: function() {
			debugger;
			var homePage = this.getOwnerComponent()._oViews._oViews["ZResourceRPM.view.Main"];
			if (homePage === undefined) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Main");
			}
		},

		handleChangeStartDate: function(oEvent) {
			debugger;

			var startDate = oEvent.getParameters().newValue;
			var sdd = startDate.slice(0, 2);
			var smm = startDate.slice(3, 5);
			var syy = startDate.slice(6, 10);
			startDate = syy + "-" + smm + "-" + sdd;
			startDate = new Date(startDate).setHours(0, 0, 0, 0);

			var endDate = oEvent.getSource().getParent().getCells()[8].getValue();

			if (endDate !== "") {
				var edd = endDate.slice(0, 2);
				var emm = endDate.slice(3, 5);
				var eyy = endDate.slice(6, 10);
				endDate = eyy + "-" + emm + "-" + edd;
				endDate = new Date(endDate).setHours(0, 0, 0, 0);
			}

			if (endDate !== "") {
				if (startDate > endDate) {
					oEvent.getSource().getParent().getCells()[7].setValue("");
					oEvent.getSource().getParent().getCells()[8].setValue("");
					this.oMessageDialog.getContent()[0].setText("Start Date should not be greater than End Date");
					this.oMessageDialog.open();
				}
			}
		},

		handleChangeEndDate: function(oEvent) {
			debugger;

			var startDate = oEvent.getSource().getParent().getCells()[7].getValue();
			if (startDate !== "") {
				var sdd = startDate.slice(0, 2);
				var smm = startDate.slice(3, 5);
				var syy = startDate.slice(6, 10);
				startDate = syy + "-" + smm + "-" + sdd;
				startDate = new Date(startDate).setHours(0, 0, 0, 0);
			}

			var endDate = oEvent.getParameters().newValue;
			var edd = endDate.slice(0, 2);
			var emm = endDate.slice(3, 5);
			var eyy = endDate.slice(6, 10);
			endDate = eyy + "-" + emm + "-" + edd;
			endDate = new Date(endDate).setHours(0, 0, 0, 0);

			if (startDate !== "") {
				if (endDate < startDate) {
					oEvent.getSource().getParent().getCells()[7].setValue("");
					oEvent.getSource().getParent().getCells()[8].setValue("");
					this.oMessageDialog.getContent()[0].setText("Start Date should not be greater than End Date");
					this.oMessageDialog.open();
				}
			}
		},

		onDeleteRow: function(oEvent) {
			debugger;
			//To be done
			var index = oEvent.getSource().getParent().getIndex();
			// var index = oEvent.getSource().getParent().oBindingContexts.oDUPoolEditAllModel.sPath.substring(17);
			this.oDUPoolEditAllModel.getData().DUDUPoolDisplay.splice(index, 1);
			this.oDUPoolEditAllModel.refresh();

			if (this.oDUPoolEditAllModel.getData().DUDUPoolDisplay.length === 0) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Main");
			}
		},

		goToBack: function() {
			debugger;

			// if (this.oDUPoolEditAllModel.getData().DUDUPoolDisplay.length !== 0) {
			this.getView().getParent().getParent().getParent().byId("MainView").oController.count3 = 0;

			// this.getView().getParent().getParent().getParent().byId("MainView")
			for (var i = 0; i < this.oDUPoolEditAllModel.getData().DUDUPoolDisplay.length; i++) {
				this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[i].BuffFlag = false;
			}

			this.oDUPoolEditAllModel.getData().DUDUPoolDisplay = [];

			this.oDUPoolEditAllModel.refresh();
			this.getView().getParent().getParent().getParent().byId("MainView").getModel("oMainModel").refresh();
			// this.getView().getParent().getParent().getParent().byId("MainView").oPropagatedProperties.oModels.oMainModel.refresh();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main");
			// } else {
			// 	oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// 	oRouter.navTo("Main");
			// }

		},

		onAddRes: function() {
			debugger;
			if (this.oUser === "98765432") {
				var minDateTemp = "2018-01-01";
				var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
				minDate = new Date(minDate);
			} else if (this.oUser === "10642988") {
				var minDateTemp = "2018-01-01";
				var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
				minDate = new Date(minDate);
			} else {
				// var newDate = new Date();
				// var modDate5Days = new Date(newDate - 5 * 86400000).setHours(0, 0, 0, 0);
				// minDate = new Date(modDate5Days);

				// var minDateTemp = "2018-07-01";
				// var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
				// minDate = new Date(minDate);

				var minDateTemp = this.getOwnerComponent().BackDateDash;
				// if (this.getOwnerComponent().minDateTemp !== undefined) {
				// 	minDateTemp = this.getOwnerComponent().minDateTemp;
				// }
				var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
				minDate = new Date(minDate);
			}

			if (this.getView().getModel("oDUPoolEditAllModel").getData().DUDUPoolDisplay.length > 0) {
				var Pernr = this.getView().getModel("oDUPoolEditAllModel").getData().DUDUPoolDisplay[0].Pernr;
				var Name = this.getView().getModel("oDUPoolEditAllModel").getData().DUDUPoolDisplay[0].Name;
				var Skill = this.getView().getModel("oDUPoolEditAllModel").getData().DUDUPoolDisplay[0].Skill;
				var AllocStat = this.getView().getModel("oDUPoolEditAllModel").getData().DUDUPoolDisplay[0].AllocStat;
				var BaseLoc = this.getView().getModel("oDUPoolEditAllModel").getData().DUDUPoolDisplay[0].L3WbsDesc;
				this.getView().getModel("oDUPoolEditAllModel").getData().DUDUPoolDisplay.push({
					AllocStat: AllocStat,
					BaseLoc: BaseLoc,
					BillRateId: "",
					BufferFlag: "",
					Country: "",
					countryDesc: "",
					E: "",
					ExL1: "",
					L3Wbs: "",
					L3WbsDesc: "",
					PercentAl: "",
					BillRateEnabled: false,
					BuffFlagEnabled: true,
					Pernr: Pernr,
					Name: Name,
					Role: "",
					RoleDesc: "",
					Skill: Skill,
					State: "",
					StateDesc: "",
					b: "",
					flag: "X",
					StandardStartDate: minDate
				});
				this.getView().getModel("oDUPoolEditAllModel").updateBindings(true);
			} else {
				this.goToBack();
			}
		},

		onClose: function(oEvent) {
			debugger;
			if (this.getView().getModel("oDUPoolEditAllModel").getData().DUDUPoolDisplay.length === 0) {
				this.goToBack();
			} else {
				this.oOutputDialog.close();
			}
		},

		onMsgDialogClose: function(oEvent) {
			debugger;
			this.oMessageDialog.close();
		},

		onPressClose: function(oEvent) {
			debugger;
			this.oDepTrnsDialog.getContent()[0].getItems()[0].setSelected(false);
			this.oDepTrnsDialog.getContent()[0].getItems()[1].setSelected(false);
			this.oDepTrnsDialog.close();
		},

		onCBBufFlag: function(oEvent) {
			debugger;

			if (oEvent.getParameters().selected) {
				//To be Done
				var path = oEvent.getSource().getParent().getIndex();
				// var path = oEvent.getSource().getParent().oBindingContexts.oDUPoolEditAllModel.sPath.slice(17);
				var data = this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path];
				this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BuffFlag = "X";
				if (data.Type === "TM" && data.BufferCheck === "X") {
					this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = true;
				} else if (data.Type === "TM" && data.BufferCheck === "") {
					if (this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRt !== "" || this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[
							path].BillRt !== undefined) {
						this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = false;
						this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRt = "";
					} else if (this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRt === "" || this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[
							path].BillRt === undefined) {
						this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = false;
						this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRt = "";
					}
				} else {
					this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = false;
				}

				this.oDUPoolEditAllModel.refresh();
			} else {
				//To be Done
				path = oEvent.getSource().getParent().getIndex();
				// path = oEvent.getSource().getParent().oBindingContexts.oDUPoolEditAllModel.sPath.slice(17);
				data = this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path];
				if (data.Type === "TM" && data.BufferCheck === "X") {
					this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = true;
				} else if (data.Type === "TM" && data.BufferCheck === "") {
					this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = true;
				} else {
					this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = false;
				}
				this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BuffFlag = "";
				this.oDUPoolEditAllModel.refresh();
			}
		},

		onValueChangePrjID: function(oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			// this.inputselected.getParent().getCells()[3].setValue("");
			// this.inputselected.getParent().getCells()[3].setName("");
			// var DUTitle = this.getView().getParent().getPages()[0].byId("idInpDUDUPool").getName();
			var PsNumber = oEvent.getSource().getParent().getCells()[0].getText();
			// if (window.DUTitle === "" && window.DUTitle === "") {
			// 	this.oMessageDialog.getContent()[0].setText("Select Practice Unit/Delivery Unit");
			// 	this.oMessageDialog.open();
			// } else {
			var that = this;
			// PROJ_IDSet
			this.oModel.read("RPM_MULTI_ACC_PROJ_F4Set?$filter=IvDu eq '" + window.DUTitle + "' and IvPernr eq '" + PsNumber + "'", null,
				null,
				true,
				function(data, oResponse) {
					debugger;
					that.oDUModel.getData().ProjectID = data.results;
					that.oDUModel.setData(that.oDUModel.getData());
				},
				function(oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});

			var oView = this.getView();
			this.PrjIDDUPoolDialog = oView.byId("idPrjIDDUPoolDialog");
			if (!this.PrjIDDUPoolDialog) {
				debugger;
				this.PrjIDDUPoolDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DUPoolPrjID", this);
				oView.addDependent(this.PrjIDDUPoolDialog);
			}
			this.getView().byId("idPrjIDDUPoolDialog").getBinding("items").filter([]);
			this.PrjIDDUPoolDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			this.PrjIDDUPoolDialog._sSearchFieldValue = "";
			this.PrjIDDUPoolDialog.open();
			// }
		},

		handleSearchPrjID: function(oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("ProjectId", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("ProjectIdDis", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("CustName", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClosePrjID: function(oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var prjIDDesc = aContexts[0].getInfo();
			var prjIDTitle = aContexts[0].getTitle();
			var path = oEvent.getParameters().selectedContexts[0].sPath.slice(11);
			var CustomerName = this.oDUModel.getData().ProjectID[path].CustName;
			this.inputselected.getParent().getCells()[3].setValue(CustomerName);
			this.inputselected.getParent().getCells()[3].setName(CustomerName);
			this.inputselected.getParent().getCells()[5].setName("");
			this.inputselected.getParent().getCells()[5].setValue("");
			this.inputselected.getParent().getCells()[6].setName("");
			this.inputselected.getParent().getCells()[6].setValue("");
			this.inputselected.getParent().getCells()[10].setName("");
			this.inputselected.getParent().getCells()[10].setValue("");
			this.inputselected.getParent().getCells()[15].setName("");
			this.inputselected.getParent().getCells()[15].setValue("");
			var path1 = oEvent.getParameters().selectedContexts["0"].sPath.slice(11);
			this.data1 = this.oDUModel.getData().ProjectID[path1];
			if (aContexts.length) {
				this.inputselected.setValue(prjIDDesc);
				this.inputselected.setName(prjIDTitle);
			}
			var L1 = prjIDTitle;
			var that = this;
			this.oViewModel.read("ProjInfoSet('" + L1 + "')", null, null, true,
				function(data, oResponse) {
					debugger;
					if (data.Type === "TM" && that.data1.BufferCheck === "X") {
						//To be done
						path = that.inputselected.getParent().getIndex();
						// var path = that.inputselected.mBindingInfos.name.binding.oContext.sPath.slice(17);
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BufferCheck = that.data1.BufferCheck;
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = true;
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].Type = data.Type;
						that.oDUPoolEditAllModel.refresh();
						// that.getView().oPropagatedProperties.oModels.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BuffFlagEnabled = false;
					} else if (data.Type === "TM" && that.data1.BufferCheck === "") {
						//To be done
						path = that.inputselected.getParent().getIndex();
						// path = that.inputselected.mBindingInfos.name.binding.oContext.sPath.slice(17);
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BufferCheck = that.data1.BufferCheck;
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = true;
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].Type = data.Type;
						that.oDUPoolEditAllModel.refresh();
						// that.getView().oPropagatedProperties.oModels.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BuffFlagEnabled = false;
					} else {
						//To be done
						path = that.inputselected.getParent().getIndex();
						// path = that.inputselected.mBindingInfos.name.binding.oContext.sPath.slice(17);
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BufferCheck = "";
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BillRateEnabled = false;
						that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].Type = data.Type;
						that.oDUPoolEditAllModel.refresh();
						// that.getView().oPropagatedProperties.oModels.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].BuffFlagEnabled = true;
					}

					that.oDUModel.getData().PrjInfo = data.results;
					that.oDUModel.setData(that.oDUModel.getData());

					var yy = data.StartDate.slice(0, 4);
					var mm = data.StartDate.slice(4, 6);
					var dd = data.StartDate.slice(6, 8);
					var StandardStartDate1 = yy + "-" + mm + "-" + dd;
					var StandardStartDate = new Date(StandardStartDate1);
					//Start Commented on 18.04.2018
					//Future Date
					// if (StandardStartDate > that.CurrentDate) {
					// 	StandardStartDate = StandardStartDate;
					// } else {
					// 	StandardStartDate = that.CurrentDate;
					// }
					//End Commented on 18.04.2018

					if (that.oUser === "98765432") {
						var dateTemp = "2018-01-01";
						var dateVal = new Date(dateTemp).setHours(0, 0, 0, 0);
						dateVal = new Date(dateVal);
					} else if (that.oUser === "10642988") {
						var dateTemp = "2018-01-01";
						var dateVal = new Date(dateTemp).setHours(0, 0, 0, 0);
						dateVal = new Date(dateVal);
					} else {
						// var newDate = new Date();
						// var modDate5Days = new Date(newDate - 5 * 86400000).setHours(0, 0, 0, 0);
						// minDate = new Date(modDate5Days);

						// var dateTemp = "2018-07-01";
						// var dateVal = new Date(dateTemp).setHours(0, 0, 0, 0);
						// dateVal = new Date(dateVal);
						
						//minDate => Backdated RFC Date
						var minDateTemp = that.getOwnerComponent().BackDateDash;
						var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
						minDate = new Date(minDate);
						dateVal = new Date(minDate);
					}

					//Future Dates
					// if (StandardStartDate > that.CurrentDate) {
					if (StandardStartDate > dateVal) {
						StandardStartDate = StandardStartDate.setHours(0, 0, 0, 0);
						StandardStartDate = new Date(StandardStartDate);
					} else {
						// StandardStartDate = that.CurrentDate;
						if (that.oUser === "98765432") {
							var minDateTemp = "2018-01-01";
							var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
							minDate = new Date(minDate);
						} else if (that.oUser === "10642988") {
							var minDateTemp = "2018-01-01";
							var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
							minDate = new Date(minDate);
						} else {
							// var newDate = new Date();
							// var modDate5Days = new Date(newDate - 5 * 86400000).setHours(0, 0, 0, 0);
							// minDate = new Date(modDate5Days);

							// var minDateTemp = "2018-07-01";
							// var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
							// minDate = new Date(minDate);

							var minDateTemp = that.getOwnerComponent().BackDateDash;
							var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
							minDate = new Date(minDate);
						}
						StandardStartDate = minDate;
					}

					//To be done
					// path = that.inputselected.mBindingInfos.name.binding.oContext.sPath.slice(17);
					that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].StandardStartDate =
						StandardStartDate;

					yy = data.EndDate.slice(0, 4);
					mm = data.EndDate.slice(4, 6);
					dd = data.EndDate.slice(6, 8);
					var StandardEndDate1 = yy + "-" + mm + "-" + dd;
					var StandardEndDate = new Date(StandardEndDate1);
					that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].StandardEndDate =
						StandardEndDate;
					that.oDUPoolEditAllModel.refresh();

					if (that.oUser === "98765432") {
						var minDate = "20180101";
					} else {
						// var newDate = new Date();
						// var modDate5Days = new Date(newDate - 5 * 86400000).setHours(0, 0, 0, 0);
						// var date = new Date(modDate5Days);
						// var year = date.getFullYear().toString();
						// var month = (date.getMonth() + 1).toString();
						// if (month.length === 1) {
						// 	month = "0" + month;
						// }
						// var day = (date.getDate()).toString();
						// if (day.length === 1) {
						// 	day = "0" + day;
						// }
						// var minDate = year + month + day;
						// var minDate = "20180701";
						var minDate = that.getOwnerComponent().BackDated;
					}
					var a = minDate.substr(0, 4);
					var b = minDate.substr(4, 2);
					var c = minDate.substr(6, 2);
					var minD = a + "-" + b + "-" + c;
					var minDATE = new Date(minD).setHours(0, 0, 0, 0);
					minDATE = new Date(minDATE);

					if (StandardEndDate < minDATE) {
						that.inputselected.getParent().getCells()[2].setName("");
						that.inputselected.getParent().getCells()[2].setValue("");
						that.inputselected.getParent().getCells()[3].setValue("");
						that.inputselected.getParent().getCells()[3].setName("");
						that.inputselected.getParent().getCells()[5].setName("");
						that.inputselected.getParent().getCells()[5].setValue("");
						that.inputselected.getParent().getCells()[6].setName("");
						that.inputselected.getParent().getCells()[6].setValue("");
						that.inputselected.getParent().getCells()[7].setValue("");
						that.inputselected.getParent().getCells()[8].setValue("");
						that.inputselected.getParent().getCells()[10].setName("");
						that.inputselected.getParent().getCells()[10].setValue("");
						that.inputselected.getParent().getCells()[15].setName("");
						that.inputselected.getParent().getCells()[15].setValue("");
						var MsgStripText = "Backdated Allocations before " + that.getOwnerComponent().Bdate +
							" will no longer be allowed. Please Extend the project to proceed with allocation.";
						var dialog = new sap.m.Dialog({
							title: 'Error',
							type: 'Message',
							state: 'Error',
							content: new sap.m.Text({
								text: MsgStripText
									// text: "Backdated Allocations before 5 days from today's date will no longer be allowed. Please Extend the project"
							}),
							beginButton: new sap.m.Button({
								text: 'OK',
								press: function() {
									dialog.close();
								}
							}),
							afterClose: function() {
								dialog.destroy();
							}
						});

						dialog.open();
					}

				},
				function(oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});
			// this.oViewModel.read("POF4Set?$filter=IvL1Wbs eq '" + L1 + "'", null, null, true,
			// 	function(data, oResponse) {
			// 		debugger;
			// 		if (data.results.length > 0) {
			// 			that.oDUModel.getData().PODetails = data.results;
			// 			that.oDUModel.setData(that.oDUModel.getData());
			// 			that.inputselected.getParent().getCells()[11].setText(that.oDUModel.getData().PODetails[0].Bstkd);
			// 			that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[0].PoNumber = that.oDUModel.getData()
			// 				.PODetails[0].Tnmpo;
			// 			that.oDUPoolEditAllModel.refresh();
			// 		}
			// 	},
			// 	function(oError) {
			// 		debugger;
			// 		that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
			// 		that.oMessageDialog.open();
			// 	});
		},

		onValueChangeCountry: function(oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			var L1 = oEvent.getSource().getParent().getCells()[2].getName();
			if (L1 === "") {
				this.oMessageDialog.getContent()[0].setText("Select Project ID");
				this.oMessageDialog.open();
			} else {
				var that = this;
				// PROJ_IDSet

				this.oViewModel.read("/ZCountrySet?$filter=IvPsphi eq '" + L1 + "'", null, null, true,
					function(data, oResponse) {
						debugger;
						that.oDUModel.getData().Country = data.results;
						that.oDUModel.setData(that.oDUModel.getData());
					},
					function(oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});
				var oView = this.getView();
				this.CtryDUPoolDialog = oView.byId("idCtryDUPoolDialog");
				if (!this.CtryDUPoolDialog) {
					debugger;
					this.CtryDUPoolDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DUPoolCountry", this);
					oView.addDependent(this.CtryDUPoolDialog);
				}
				this.getView().byId("idCtryDUPoolDialog").getBinding("items").filter([]);
				this.CtryDUPoolDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.CtryDUPoolDialog._sSearchFieldValue = "";
				this.CtryDUPoolDialog.open();
			}
			this.busyDialog.close();
		},

		handleSearchCountry: function(oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("CountryCode", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("CountryName", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseCountry: function(oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var CountryName = aContexts[0].getInfo();
			var CountryCode = aContexts[0].getTitle();
			this.inputselected.getParent().getCells()[6].setValue("");
			this.inputselected.getParent().getCells()[6].setName("");
			if (aContexts.length) {
				this.inputselected.setValue(CountryName);
				this.inputselected.setName(CountryCode);
				// this.getView().byId("idInpProjectID").setValue(CountryName);
				// this.getView().byId("idInpProjectID").setName(CountryCode);
			}
		},

		onValueChangeRole: function(oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			// if (this.getView().byId("idInpPU").getName() === "" && this.getView().byId("idInpDU").getName() === "") {
			// 	this.oMessageDialog.getContent()[0].setText("Select Practice Unit/Delivery Unit");
			// 	this.oMessageDialog.open();
			// } else {
			var that = this;
			// PROJ_IDSet
			this.oViewModel.read("/ZRoleSet", null, null, true,
				function(data, oResponse) {
					debugger;
					that.oDUModel.getData().Role = data.results;
					that.oDUModel.setData(that.oDUModel.getData());
				},
				function(oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});
			var oView = this.getView();
			this.RoleDUPoolDialog = oView.byId("idRoleDUPoolDialog");
			if (!this.RoleDUPoolDialog) {
				debugger;
				this.RoleDUPoolDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DUPoolRole", this);
				oView.addDependent(this.RoleDUPoolDialog);
			}
			this.getView().byId("idRoleDUPoolDialog").getBinding("items").filter([]);
			this.RoleDUPoolDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			this.RoleDUPoolDialog._sSearchFieldValue = "";
			this.RoleDUPoolDialog.open();
			// }
		},

		handleSearchRole: function(oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("RoleCode", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("RoleDesc", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseRole: function(oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var RoleDesc = aContexts[0].getInfo();
			var RoleTitle = aContexts[0].getTitle();
			if (aContexts.length) {
				this.inputselected.setValue(RoleDesc);
				this.inputselected.setName(RoleTitle);
			}
		},

		onValueChangeLocation: function(oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			var L1 = oEvent.getSource().getParent().getCells()[2].getName();
			if (L1 === "") {
				this.oMessageDialog.getContent()[0].setText("Select Project ID");
				this.oMessageDialog.open();
			} else {
				var that = this;
				// PROJ_IDSet
				var Country = oEvent.getSource().getParent().getCells()[5].getName();
				this.oViewModel.read("/ZWbsIDSet?$filter=IvPsphi eq '" + L1 + "' and IvCountry eq '" + Country + "'", null, null, true,
					function(data, oResponse) {
						debugger;
						that.oDUModel.getData().Location = data.results;
						that.oDUModel.setData(that.oDUModel.getData());
					},
					function(oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});
				var oView = this.getView();
				this.LocDUPoolDialog = oView.byId("idLocDUPoolDialog");
				if (!this.LocDUPoolDialog) {
					debugger;
					this.LocDUPoolDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DUPoolLocation", this);
					oView.addDependent(this.LocDUPoolDialog);
				}
				this.getView().byId("idLocDUPoolDialog").getBinding("items").filter([]);
				this.LocDUPoolDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.LocDUPoolDialog._sSearchFieldValue = "";
				this.LocDUPoolDialog.open();
			}
			this.busyDialog.close();
		},

		handleSearchLoc: function(oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("Posid", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Post1", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseLoc: function(oEvent) {
			debugger;
			this.inputselected.getParent().getCells()[10].setValue("");
			this.inputselected.getParent().getCells()[10].setName("");
			var aContexts = oEvent.getParameter("selectedItems");
			var LocDesc = aContexts[0].getInfo();
			var LocTitle = aContexts[0].getTitle();
			if (aContexts.length) {
				this.inputselected.setValue(LocDesc);
				this.inputselected.setName(LocTitle);
			}
			if (this.inputselected.getParent().getCells()[16].getText() !== LocDesc) {
				this.oDepTrnsDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.oDepTrnsDialog.open();
			}
		},

		TranferSelect: function(oEvent) {
			debugger;
			if (oEvent.getSource().getText() === "Transfer" && oEvent.getParameters().selected) {
				//To be done
				var index = this.inputselected.getParent().getIndex();
				// var index = this.inputselected.mBindingInfos.name.binding.oContext.sPath.slice(17);
				this.oDUPoolEditAllModel.getData().DUDUPoolDisplay.splice(index, 1);
				this.oDUPoolEditAllModel.refresh();
			}
			this.onPressClose();
		},

		onValueChangeBillRate: function(oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			var L1 = oEvent.getSource().getParent().getCells()[2].getName();
			var L3WBSID = oEvent.getSource().getParent().getCells()[6].getName();
			var empPsno = oEvent.getSource().getParent().getCells()[0].getText();
			if (L1 === "") {
				this.oMessageDialog.getContent()[0].setText("Select Project ID");
				this.oMessageDialog.open();
			} else if (L3WBSID === "") {
				this.oMessageDialog.getContent()[0].setText("Select Location");
				this.oMessageDialog.open();
			} else if (empPsno === "") {
				this.oMessageDialog.getContent()[0].setText("Select PS Number");
				this.oMessageDialog.open();
			} else {
				var that = this;
				// PROJ_IDSet
				// this.oViewModel.read("/BillRateIDSet?$filter=IvPsphi eq '" + L1 + "'", null, null, true,
				this.oViewModel.read("/BillRateIDSet?$filter=IvL3Wbs eq '" + L3WBSID + "' and  IvPernr eq '" + empPsno + "' and IvPsphi eq '" + L1 +
					"'", null, null, true,
					function(data, oResponse) {
						debugger;
						that.oDUModel.getData().BillRate = data.results;
						that.oDUModel.setData(that.oDUModel.getData());
					},
					function(oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});
				var oView = this.getView();
				this.BillRateDUPoolDialog = oView.byId("idBillRateDUPoolDialog");
				if (!this.BillRateDUPoolDialog) {
					debugger;
					this.BillRateDUPoolDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DUPoolBillRate", this);
					oView.addDependent(this.BillRateDUPoolDialog);
				}
				// this.getView().byId("idBillRateDUPoolDialog").getBinding("items").filter([]);
				this.BillRateDUPoolDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.BillRateDUPoolDialog.open();
			}
			this.busyDialog.close();
		},

		SelectRateID: function(oEvent) {
			debugger;
			var BillRt = oEvent.getParameters().listItem.getCells()[0].getText();
			this.inputselected.getParent().getCells()[10].setValue(BillRt);

			this.oDUPoolEditAllModel.refresh();
			// if (BillRt !== "") {
			// 	this.inputselected.getParent().getCells()[11].setEnabled(false);
			// } else {
			// 	this.inputselected.getParent().getCells()[11].setEnabled(true);
			// }
		},

		SelectPODetails: function(oEvent) {
			debugger;
			// var PODesc = oEvent.getParameters().listItem.getCells()[11].getText();

			// To be done
			var path = this.inputselected.getParent().getIndex();
			// var path = this.inputselected.getParent().oBindingContexts.oDUPoolEditAllModel.sPath.slice(17);

			//To be done
			var path2 = oEvent.getParameters().listItem.getBindingContextPath().slice(11);
			// var path2 = oEvent.getParameters().listItem.oBindingContexts.oDUModel.sPath.slice(11);

			this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].PoNumber = this.oDUModel.getData().PODetails[path2].Tnmpo;
			this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].PoValue = this.oDUModel.getData().PODetails[path2].Value;
			this.oDUPoolEditAllModel.getData().DUDUPoolDisplay[path].PoCurrency = this.oDUModel.getData().PODetails[path2].Currency;

			var PODesc = oEvent.getParameters().listItem.getCells()[0].getText();

			this.inputselected.getParent().getCells()[12].setValue(PODesc);
			this.oDUPoolEditAllModel.refresh();
		},

		closeBillrateTable: function(oEvent) {
			debugger;
			this.BillRateDUPoolDialog.close();
		},

		clearBillrate: function(oEvent) {
			debugger;
			oEvent.oSource.oParent.mAggregations.content["0"].removeSelections();
			this.inputselected.getParent().getCells()[10].setValue("");
			this.BillRateDUPoolDialog.close();
		},

		closePODetailsTable: function(oEvent) {
			debugger;
			this.PODUPoolDialog.close();
		},

		clearPODetails: function(oEvent) {
			debugger;
			oEvent.oSource.oParent.mAggregations.content["0"].removeSelections();
			this.inputselected.getParent().getCells()[12].setValue("");
			this.PODUPoolDialog.close();
		},

		handleSearchBillRate: function(oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("Posid", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Post1", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseBillRate: function(oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var LocDesc = aContexts[0].getInfo();
			var LocTitle = aContexts[0].getTitle();
			if (aContexts.length) {
				this.inputselected.setValue(LocDesc);
				this.inputselected.setName(LocTitle);
			}
		},

		onValueChangeReprtMgr: function(oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();
			this.inputselected = oEvent.getSource();
			var L1 = oEvent.getSource().getParent().getCells()[2].getName();
			if (L1 === "") {
				this.oMessageDialog.getContent()[0].setText("Select Project ID");
				this.oMessageDialog.open();
			} else {
				var that = this;
				// PROJ_IDSet
				this.oViewModel.read("/ReportSet?$filter=IvPosid eq '" + L1 + "'", null, null, true,
					function(data, oResponse) {
						debugger;
						that.oDUModel.getData().ReportMgr = data.results;
						that.oDUModel.setData(that.oDUModel.getData());
						// that.oMainModel.getData().DUDUPoolDisplay[i].StandardStartDate = that.CurrentDate ;
						// that.oMainModel.getData().DUDUPoolDisplay[i].StandardEndDate = that.CurrentDate ;
					},
					function(oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});
				var oView = this.getView();
				this.RMDUPoolDialog = oView.byId("idRMDUPoolDialog");
				if (!this.RMDUPoolDialog) {
					debugger;
					this.RMDUPoolDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DUPoolReportingMgr", this);
					oView.addDependent(this.RMDUPoolDialog);
				}
				// this.getView().byId("idRMDUPoolDialog").getBinding("items").filter([]);
				this.RMDUPoolDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				// this.RMDUPoolDialog._sSearchFieldValue = "";
				this.RMDUPoolDialog.open();
			}
			this.busyDialog.close();
		},

		handleSearchReprtMgr: function(oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("PsNumber", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseReprtMgr: function(oEvent) {
			debugger;
			this.inputselected.setValue(oEvent.oSource.mProperties.value);
			this.inputselected.setName(oEvent.oSource.mProperties.label);
			this.RMDUPoolDialog.close();
			// var aContexts = oEvent.getParameter("selectedItems");
			// var Name = aContexts[0].getInfo();
			// var PsNumber = aContexts[0].getTitle();
			// if (aContexts.length) {
			// 	this.inputselected.setValue(Name);
			// 	this.inputselected.setName(PsNumber);
			// }
		},

		cancelReprtMgrr: function(oEvent) {
			debugger;
			this.inputselected.getParent().getCells()[15].setValue("");
			this.inputselected.getParent().getCells()[15].setName("");
			this.RMDUPoolDialog.close();
		},

		onValueChangePODetails: function(oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			// if (this.getView().byId("idInpPU").getName() === "" && this.getView().byId("idInpDU").getName() === "") {
			// 	this.oMessageDialog.getContent()[0].setText("Select Practice Unit/Delivery Unit");
			// 	this.oMessageDialog.open();
			// } else {
			var that = this;
			// PROJ_IDSet
			var L1 = oEvent.getSource().getParent().getCells()[2].getName();
			this.oViewModel.read("POF4Set?$filter=IvL1Wbs eq '" + L1 + "'", null, null, true,
				function(data, oResponse) {
					debugger;
					that.oDUModel.getData().PODetails = data.results;
					that.oDUModel.setData(that.oDUModel.getData());

				},
				function(oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});
			var oView = this.getView();
			this.PODUPoolDialog = oView.byId("idPODUPoolDialog");
			if (!this.PODUPoolDialog) {
				debugger;
				this.PODUPoolDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DUPoolPODetails", this);
				oView.addDependent(this.PODUPoolDialog);
			}
			// this.getView().byId("idPODUPoolDialog").getBinding("items").filter([]);
			this.PODUPoolDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			this.PODUPoolDialog._sSearchFieldValue = "";
			this.PODUPoolDialog.open();
			// }
		},

		handleSearchPODetails: function(oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("PsNumber", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClosePODetails: function(oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var Name = aContexts[0].getInfo();
			var PsNumber = aContexts[0].getTitle();
			if (aContexts.length) {
				this.inputselected.setValue(Name);
				this.inputselected.setName(PsNumber);
			}
		},

		onPODetLink: function(oEvent) {
			debugger;
			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("ZResourceRPM.fragments.PopoverPO", this);
				this.getView().addDependent(this._oPopover);

			}
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oControl = oEvent.getSource();

			// var oTablePopOver = {
			// 	searchSet: []
			// };

			// for (var i = 0; i < this.oDUModel.getData().PODetails.length; i++) {
			// 	var PoStartDate = this.oDUModel.getData().PODetails[0].ValidFrom;
			// 	var PoEndDate = this.oDUModel.getData().PODetails[0].ValidTo;
			// 	var PoValue = this.oDUModel.getData().PODetails[0].Value;
			// 	var PoCurrency = this.oDUModel.getData().PODetails[0].Currency;
			// }

			// var tablerows = this.getView().byId("tblRIW1").getRows();

			// var PoStartDate = oEvent.oSource.oParent.oBindingContexts.oTableAllocDisplay.getObject().PoStartDate;
			// var PoEndDate = oEvent.oSource.oParent.oBindingContexts.oTableAllocDisplay.getObject().PoEndDate;
			// var PoValue = oEvent.oSource.oParent.oBindingContexts.oTableAllocDisplay.getObject().PoValue;
			// var PoCurrency = oEvent.oSource.oParent.oBindingContexts.oTableAllocDisplay.getObject().PoCurrency;

			// oTablePopOver.searchSet.push({
			// 		PoStartDate: PoStartDate,
			// 		PoEndDate: PoEndDate,
			// 		PoValue: PoValue,
			// 		PoCurrency: PoCurrency

			// 	}

			// );

			this._oPopover.setModel(this.oDUModel, "oDUModel");
			this._oPopover.openBy(oControl);
		},

		editAllocation: function(oEvent) {
			debugger;

			var that = this;

			that.editCount = 0;
			if (!that.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				that.busyDialog = busyDialog;
			}
			that.busyDialog.open();
			that.countData = 0;
			that.ResAll = {
				listitems: []
			};
			var BRBFFlag = false;
			var MandtFlag = false;
			var iLength = that.oDUPoolEditAllModel.getData().DUDUPoolDisplay;

			for (var i = 0; i < iLength.length; i++) {
				if (iLength[i].PoNumber === undefined) {
					iLength[i].PoNumber = "";
				}
				if (iLength[i].Value === undefined) {
					iLength[i].Value = "";
				}
				if (iLength[i].Currency === undefined) {
					iLength[i].Currency = "";
				}
				if (iLength[i].BillRt === undefined) {
					iLength[i].BillRt = "";
				}
				if (iLength[i].RptMgrName === undefined) {
					iLength[i].RptMgrName = "";
				}
			}

			for (var j = 0; j < iLength.length; j++) {
				if (that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[j].Type === "TM" && that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[
						j].BufferCheck === "X") {
					if (iLength[j].BillRt === "" && iLength[j].BuffFlag === "") {
						BRBFFlag = true;
						break;
					}
				} else if (that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[j].Type === "TM" && that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[
						j].BufferCheck === "") {
					if (iLength[j].BillRt === "" && iLength[j].BuffFlag === "") {
						BRBFFlag = true;
						break;
					}
				}
			}
			for (j = 0; j < iLength.length; j++) {
				if (iLength[j].ProjectIdDis === "" || iLength[j].RoleDesc === "" || iLength[j].LocValue === "" || iLength[j].NewStartDate ===
					"" ||
					iLength[j].NewEndDate === "" || iLength[j].Alloc === "") {
					MandtFlag = true;
					break;
				}
			}
			if (MandtFlag) {
				that.busyDialog.close();
				that.oMessageDialog.getContent()[0].setText("Fill in all the fields");
				that.oMessageDialog.open();
			} else if (BRBFFlag) {
				that.busyDialog.close();
				that.oMessageDialog.getContent()[0].setText("Bill Rate or Buffer Flag cannot be Blank in case of TNM Projects");
				that.oMessageDialog.open();
			} else {
				// var that = this;
				if (iLength.length > 0 && (MandtFlag === false)) {
					that.oOutputDialog.getModel("oSDialogModel").getData().listitems = [];
					for (i = 0; i < iLength.length; i++) {
						var oItems = [];
						// if (iLength[i].PoNumber === undefined) {
						// 	iLength[i].PoNumber = "";
						// }
						// if (iLength[i].BillRt === undefined) {
						// 	iLength[i].BillRt = "";
						// }
						// if (iLength[i].RptMgrName === undefined) {
						// 	iLength[i].RptMgrName = "";
						// }
						oItems.push({
							Pernr: iLength[i].Pernr,
							StartDate: iLength[i].NewStartDate,
							EndDate: iLength[i].NewEndDate,
							PercentAlloc: iLength[i].Alloc,
							Skill: iLength[i].Skill,
							L1Wbs: iLength[i].ProjectId,
							ImRepMgr: iLength[i].RptMgrName,
							Name: iLength[i].Name,
							Country: iLength[i].CountryCode,
							CountryDesc: iLength[i].CountryName,
							State: iLength[i].State,
							StateDesc: "X",
							L3Wbs: iLength[i].LocName,
							L3WbsDesc: iLength[i].LocValue,
							OppId: "",
							Role: iLength[i].RoleCode,
							RoleDesc: "",
							BillRateId: iLength[i].BillRt,
							BufferFlag: iLength[i].BuffFlag,
							PoNumber: iLength[i].PoNumber,
							PoStartDate: "",
							PoEndDate: "",
							PoValue: "0.000",
							PoCurrency: "",
							AllocStat: iLength[i].AllocStat,
							BaseLoc: iLength[i].BaseLoc,
							IvPernr: iLength[i].Pernr,
							EvOutput: ""
						});
						var oHeader = {
							IvPernr: iLength[i].Pernr,
							HeaderItem: oItems
						};

						var oViewModel = "/sap/opu/odata/sap/ZCREATE1_SRV/";
						var oCModel = new sap.ui.model.odata.ODataModel(oViewModel, {
							json: true,
							loadMetadataAsync: true
						});
						oCModel.create("/HeaderSet", oHeader, null, function(oData, oResponse) {
								debugger;
								sap.ui.core.BusyIndicator.hide();
								// var userid = "DEVELOPER";
								// that.oUser = sap.ushell.Container.getUser().getId();
								var oViewModel2 = "/sap/opu/odata/sap/ZGW_RESOURCEFINAL_SRV/";
								var oHModel = new sap.ui.model.odata.ODataModel(oViewModel2, {
									json: true,
									loadMetadataAsync: true
								});
								var L1 = iLength[i].ProjectId;
								// var L1 = "10129-01";
								oHModel.read("/OutPutSet?$filter=IL1 eq '" + L1 + "' and IUser eq '" + that.oUser + "'", null, null, false, function(
									response) {
									debugger;
									if (response.results[0].OpFlag === "S") {
										that.oDUPoolEditAllModel.getData().DUDUPoolDisplay.splice(that.editCount, 1);
										that.oDUPoolEditAllModel.refresh();
										that.editCount--;
										i--;
									} else if (response.results[0].OpFlag === "E") {
										that.editCount++;
									}

									// that.oSDialogModel.getData().listitems.push(opData);
									for (j = 0; j < response.results.length; j++) {
										that.ResAll.listitems.push({
											OpPernr: response.results[j].OpPernr,
											OpStartDate: response.results[j].OpStartDate,
											OpEndDate: response.results[j].OpEndDate,
											OpPercentAlloc: response.results[j].OpPercentAlloc,
											OpLocation: response.results[j].OpLocation,
											OpMessage: response.results[j].OpMessage
										});
										that.countData++;

										// that.PlannedAccToPool.push(that.countData);
										// that.onDisplay();
										that.oMainModel.refresh();
									}
								}, function(error) {
									debugger;
									that.ResAll.listitems.push({
										OpPernr: that.oDeAllocModel.getData().ProjectResouces[that.countData].Pernr,
										OpStartDate: that.oDeAllocModel.getData().ProjectResouces[that.countData].StartDate,
										OpEndDate: that.oDeAllocModel.getData().ProjectResouces[that.countData].EndDate,
										OpPercentAlloc: that.oDeAllocModel.getData().ProjectResouces[that.countData].PercentAlloc,
										OpLocation: that.oDeAllocModel.getData().ProjectResouces[that.countData].L3WbsDesc,
										OpMessage: "Data Fetch Failed"
									});
									that.countData++;
									that.editCount++;
									that.oMainModel.refresh();
									//jQuery.sap.log.getLogger().error("Data fetch failed" + error.toString());
									// that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
									// that.oMessageDialog.open();
								});
								that.oOutputDialog.setModel(new sap.ui.model.json.JSONModel(that.ResAll), "oSDialogModel");
								that.getView().getParent().getParent().getParent().byId("MainView").getController().onDisplay();
								if (that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length !== 0) {
									that.oOutputDialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
									that.busyDialog.close();
									that.oOutputDialog.open();
								}
								//Extra Added
								else {
									that.busyDialog.close();
								}
							},
							function(oError) {
								debugger;
								that.busyDialog.close();
								that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
								that.oMessageDialog.open();
							});
						//End of Change Allocation
					}
				}
				// else{
				// 	this.goToBack();
				// }
			}

			// var dialog = new Dialog({
			// 	title: "Warning",
			// 	type: "Message",
			// 	state: "Warning",
			// 	content: new Text({
			// 		text: "Submitting edit Allocation. Do you really want to continue?"
			// 	}),
			// 	beginButton: new Button({
			// 		text: "OK",
			// 		press: function(evt) {
			// 			debugger;
			// 			dialog.close();
			// 			that.editCount = 0;
			// 			if (!that.busyDialog) {
			// 				var busyDialog = new sap.m.BusyDialog();
			// 				customIconRotationSpeed: 100;
			// 				that.busyDialog = busyDialog;
			// 			}
			// 			that.busyDialog.open();
			// 			that.countData = 0;
			// 			that.ResAll = {
			// 				listitems: []
			// 			};
			// 			var BRBFFlag = false;
			// 			var MandtFlag = false;
			// 			var iLength = that.oDUPoolEditAllModel.getData().DUDUPoolDisplay;

			// 			for (var i = 0; i < iLength.length; i++) {
			// 				if (iLength[i].PoNumber === undefined) {
			// 					iLength[i].PoNumber = "";
			// 				}
			// 				if (iLength[i].Value === undefined) {
			// 					iLength[i].Value = "";
			// 				}
			// 				if (iLength[i].Currency === undefined) {
			// 					iLength[i].Currency = "";
			// 				}
			// 				if (iLength[i].BillRt === undefined) {
			// 					iLength[i].BillRt = "";
			// 				}
			// 				if (iLength[i].RptMgrName === undefined) {
			// 					iLength[i].RptMgrName = "";
			// 				}
			// 			}

			// 			for (var j = 0; j < iLength.length; j++) {
			// 				if (that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[j].Type === "TM" && that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[
			// 						j].BufferCheck === "X") {
			// 					if (iLength[j].BillRt === "" && iLength[j].BuffFlag === "") {
			// 						BRBFFlag = true;
			// 						break;
			// 					}
			// 				} else if (that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[j].Type === "TM" && that.oDUPoolEditAllModel.getData().DUDUPoolDisplay[
			// 						j].BufferCheck ===
			// 					"") {
			// 					if (iLength[j].BillRt === "" && iLength[j].BuffFlag === "") {
			// 						BRBFFlag = true;
			// 						break;
			// 					}
			// 				}
			// 			}
			// 			for (j = 0; j < iLength.length; j++) {
			// 				if (iLength[j].ProjectIdDis === "" || iLength[j].RoleDesc === "" || iLength[j].LocValue === "" || iLength[j].NewStartDate ===
			// 					"" ||
			// 					iLength[j].NewEndDate === "" || iLength[j].Alloc === "") {
			// 					MandtFlag = true;
			// 					break;
			// 				}
			// 			}
			// 			if (MandtFlag) {
			// 				that.busyDialog.close();
			// 				that.oMessageDialog.getContent()[0].setText("Fill in all the fields");
			// 				that.oMessageDialog.open();
			// 			} else if (BRBFFlag) {
			// 				that.busyDialog.close();
			// 				that.oMessageDialog.getContent()[0].setText("Bill Rate or Buffer Flag cannot be Blank in case of TNM Projects");
			// 				that.oMessageDialog.open();
			// 			} else {
			// 				// var that = this;
			// 				if (iLength.length > 0 && (MandtFlag === false)) {
			// 					that.oOutputDialog.getModel("oSDialogModel").getData().listitems = [];
			// 					for (i = 0; i < iLength.length; i++) {
			// 						var oItems = [];
			// 						// if (iLength[i].PoNumber === undefined) {
			// 						// 	iLength[i].PoNumber = "";
			// 						// }
			// 						// if (iLength[i].BillRt === undefined) {
			// 						// 	iLength[i].BillRt = "";
			// 						// }
			// 						// if (iLength[i].RptMgrName === undefined) {
			// 						// 	iLength[i].RptMgrName = "";
			// 						// }
			// 						oItems.push({
			// 							Pernr: iLength[i].Pernr,
			// 							StartDate: iLength[i].NewStartDate,
			// 							EndDate: iLength[i].NewEndDate,
			// 							PercentAlloc: iLength[i].Alloc,
			// 							Skill: iLength[i].Skill,
			// 							L1Wbs: iLength[i].ProjectId,
			// 							ImRepMgr: iLength[i].RptMgrName,
			// 							Name: iLength[i].Name,
			// 							Country: iLength[i].CountryCode,
			// 							CountryDesc: iLength[i].CountryName,
			// 							State: iLength[i].State,
			// 							StateDesc: iLength[i].StateDesc,
			// 							L3Wbs: iLength[i].LocName,
			// 							L3WbsDesc: iLength[i].LocValue,
			// 							OppId: "",
			// 							Role: iLength[i].RoleCode,
			// 							RoleDesc: "",
			// 							BillRateId: iLength[i].BillRt,
			// 							BufferFlag: iLength[i].BuffFlag,
			// 							PoNumber: iLength[i].PoNumber,
			// 							PoStartDate: "",
			// 							PoEndDate: "",
			// 							PoValue: "0.000",
			// 							PoCurrency: "",
			// 							AllocStat: iLength[i].AllocStat,
			// 							BaseLoc: iLength[i].BaseLoc,
			// 							IvPernr: iLength[i].Pernr,
			// 							EvOutput: ""
			// 						});
			// 						var oHeader = {
			// 							IvPernr: iLength[i].Pernr,
			// 							HeaderItem: oItems
			// 						};

			// 						var oViewModel = "/sap/opu/odata/sap/ZCREATE1_SRV/";
			// 						var oCModel = new sap.ui.model.odata.ODataModel(oViewModel, {
			// 							json: true,
			// 							loadMetadataAsync: true
			// 						});
			// 						oCModel.create("/HeaderSet", oHeader, null, function(oData, oResponse) {
			// 								debugger;
			// 								sap.ui.core.BusyIndicator.hide();
			// 								// var userid = "DEVELOPER";
			// 								// that.oUser = sap.ushell.Container.getUser().getId();
			// 								var oViewModel2 = "/sap/opu/odata/sap/ZGW_RESOURCEFINAL_SRV/";
			// 								var oHModel = new sap.ui.model.odata.ODataModel(oViewModel2, {
			// 									json: true,
			// 									loadMetadataAsync: true
			// 								});
			// 								var L1 = iLength[i].ProjectId;
			// 								// var L1 = "10129-01";
			// 								oHModel.read("/OutPutSet?$filter=IL1 eq '" + L1 + "' and IUser eq '" + that.oUser + "'", null, null, false, function(
			// 									response) {
			// 									debugger;
			// 									if (response.results[0].OpFlag === "S") {
			// 										that.oDUPoolEditAllModel.getData().DUDUPoolDisplay.splice(that.editCount, 1);
			// 										that.oDUPoolEditAllModel.refresh();
			// 										that.editCount--;
			// 										i--;
			// 									} else if (response.results[0].OpFlag === "E") {
			// 										that.editCount++;
			// 									}

			// 									// that.oSDialogModel.getData().listitems.push(opData);
			// 									for (var j = 0; j < response.results.length; j++) {
			// 										that.ResAll.listitems.push({
			// 											OpPernr: response.results[j].OpPernr,
			// 											OpStartDate: response.results[j].OpStartDate,
			// 											OpEndDate: response.results[j].OpEndDate,
			// 											OpPercentAlloc: response.results[j].OpPercentAlloc,
			// 											OpLocation: response.results[j].OpLocation,
			// 											OpMessage: response.results[j].OpMessage
			// 										});
			// 										that.countData++;

			// 										// that.PlannedAccToPool.push(that.countData);
			// 										// that.onDisplay();
			// 										that.oMainModel.refresh();
			// 									}
			// 								}, function(error) {
			// 									debugger;
			// 									that.ResAll.listitems.push({
			// 										OpPernr: that.oDeAllocModel.getData().ProjectResouces[that.countData].Pernr,
			// 										OpStartDate: that.oDeAllocModel.getData().ProjectResouces[that.countData].StartDate,
			// 										OpEndDate: that.oDeAllocModel.getData().ProjectResouces[that.countData].EndDate,
			// 										OpPercentAlloc: that.oDeAllocModel.getData().ProjectResouces[that.countData].PercentAlloc,
			// 										OpLocation: that.oDeAllocModel.getData().ProjectResouces[that.countData].L3WbsDesc,
			// 										OpMessage: "Data Fetch Failed"
			// 									});
			// 									that.countData++;
			// 									that.editCount++;
			// 									that.oMainModel.refresh();
			// 									//jQuery.sap.log.getLogger().error("Data fetch failed" + error.toString());
			// 									// that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
			// 									// that.oMessageDialog.open();
			// 								});
			// 								that.oOutputDialog.setModel(new sap.ui.model.json.JSONModel(that.ResAll), "oSDialogModel");
			// 								that.getView().getParent().getParent().getParent().byId("MainView").getController().onDisplay();
			// 								if (that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length !== 0) {
			// 									that.oOutputDialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
			// 									that.busyDialog.close();
			// 									that.oOutputDialog.open();
			// 								}
			// 								//Extra Added
			// 								else {
			// 									that.busyDialog.close();
			// 								}
			// 							},
			// 							function(oError) {
			// 								debugger;
			// 								that.busyDialog.close();
			// 								that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
			// 								that.oMessageDialog.open();
			// 							});
			// 						//End of Change Allocation
			// 					}
			// 				}
			// 				// else{
			// 				// 	this.goToBack();
			// 				// }
			// 			}
			// 		}
			// 	}),
			// 	endButton: new Button({
			// 		text: "Cancel",
			// 		press: function(evt) {
			// 			debugger;
			// 			dialog.close();
			// 		}
			// 	}),
			// 	afterClose: function() {
			// 		dialog.destroy();
			// 	}
			// });
			// dialog.open();

		}

	});

});