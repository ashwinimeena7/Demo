sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/DatePicker"
], function (Controller, Filter, MessageToast, MessageBox, Dialog, Button, Text, DatePicker) {
	"use strict";

	return Controller.extend("ZResourceRPM.controller.Main", {

		onInit: function (oEvent) {
			debugger;

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			//For Adding and Deleting row
			this.count = 0;
			//For Success-Error Count
			this.countData = 0;

			//Allocated Table Select Count
			this.count1 = 0;
			//Planned Table Select Count
			this.count2 = 0;
			//All Table Select Count
			this.count3 = 0;
			//All Multi Account Select Count
			this.count4 = 0;

			//6 Fragments
			this.getView().byId("idProjectResourceFragment").setVisible(true);
			this.getView().byId("idAccountBenchFragment").setVisible(false);
			this.getView().byId("idPUDUBenchFragment").setVisible(false);
			this.getView().byId("idResourcAllocationFragment").setVisible(false);
			this.getView().byId("idDUPoolFragment").setVisible(false);
			this.getView().byId("idAllocDetFragment").setVisible(false);
			this.getView().byId("idDeputationFragment").setVisible(false);
			this.IconTabSelectedKey = this.getView().byId("iconTabHeader").getSelectedKey();
			// this.getView().byId("iconTabHeader").setSelectedKey("PR");

			//ODataModel for ZGW_LTIL_RPM_SRV
			this.oModel = this.getOwnerComponent().getModel("oModel");
			//ODataModel for ZGW_RESOURCEFINAL_SRV
			this.oViewModel = this.getOwnerComponent().getModel("oViewModel");
			//ODataModel for Batches
			this.oModelBatch = this.getOwnerComponent().getModel("oModelBatch");

			//All F4's
			this.oMainModel = this.getOwnerComponent().getModel("oMainModel");
			//Allocated Table Select
			this.oDeAllocModel = this.getOwnerComponent().getModel("oDeAllocModel");
			//Planned Table Select
			this.oDeleteModel = this.getOwnerComponent().getModel("oDeleteModel");
			//All Table Select in Proj Res Tab
			this.oSentToPUModel = this.getOwnerComponent().getModel("oSentToPUModel");
			//All Table Select in Acc Bench Tab
			this.oAccountBenchModel = this.getOwnerComponent().getModel("oAccountBenchModel");
			//All Table Select in Multi Account Pool Tab
			this.oMASendToPracticeModel = this.getOwnerComponent().getModel("oMASendToPracticeModel");
			//Output
			this.oSDialogModel = this.getOwnerComponent().getModel("oSDialogModel");
			//Resource Allocation Table data
			this.oTableAllocDisplay3 = this.getOwnerComponent().getModel("oTableAllocDisplay3");

			this.oDUPoolEditAllModel = this.getOwnerComponent().getModel("oDUPoolEditAllModel");

			this.oOutputDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.PUOutput", this);
			this.getView().addDependent(this.oOutputDialog);
			this.oDUOutputDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.DUOutput", this);
			this.getView().addDependent(this.oDUOutputDialog);
			this.oMessageDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.MessageDialog", this);
			this.getView().addDependent(this.oMessageDialog);
			// this.oWarningDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.WarningDialog", this);
			// this.getView().addDependent(this.oWarningDialog);
			this._oPopover = sap.ui.xmlfragment("ZResourceRPM.fragments.DatePopover", this);
			this.getView().addDependent(this._oPopover);
			this._oPopover.addStyleClass(this.getOwnerComponent().getContentDensityClass());

			var CurrentDate1 = new Date().setHours(0, 0, 0, 0);
			this.CurrentDate = new Date(CurrentDate1);

			// PU 00289817
			// DU 00285385
			// PU & DU 00280072
			// single PU 291430
			// PU & DU 10642988

			// this.oUser = "10642988";
			this.oUser = sap.ushell.Container.getUser().getId();
			var oUserName = sap.ushell.Container.getUser().getFullName();
			this.getView().byId("idUserName").setText("Welcome " + oUserName);
			var oViewModel = "/sap/opu/odata/SAP/ZRIW_RESOURCE_SRV/";
			this.oRAModel = new sap.ui.model.odata.ODataModel(oViewModel, {
				json: true,
				loadMetadataAsync: true
			});
			var that = this;
			this.oRAModel.read("BACKDATED_ALLOC_AUTHSet(IvUserid='" + this.oUser + "')", null, null, true,
				function (data, oResponse) {
					debugger;
					var oBackDated = new sap.ui.model.json.JSONModel(data);
					that.getOwnerComponent().setModel(oBackDated, "oBackDated");
					that.getOwnerComponent().BackDated = that.getOwnerComponent().getModel("oBackDated").getData().EvDate;
					var Bdate = that.getOwnerComponent().BackDated;
					var sYear = Bdate.slice(0, 4);
					var sMonth = Bdate.slice(4, 6);
					var sDay = Bdate.slice(6, 8);
					Bdate = sDay + "." + sMonth + "." + sYear;
					var BackDateDash = sYear + "-" + sMonth + "-" + sDay;
					that.getOwnerComponent().Bdate = Bdate;
					that.getOwnerComponent().BackDateDash = BackDateDash;
					var MsgStripText = "Backdated Allocations before " + Bdate + " will no longer be allowed.";
					that.getView().byId("idMsgStrip").setText(MsgStripText);
				},
				function (oError) {
					debugger;
				});
			var that = this;

			if (this.oUser === "98765432") {
				var oDataRA = {
					Enabled: true
				};
				var RAEnabledModel = new sap.ui.model.json.JSONModel();
				RAEnabledModel.setData(oDataRA);
				this.getView().setModel(RAEnabledModel, "RAEnabledModel");
			} else {
				oDataRA = {
					Enabled: false
				};
				RAEnabledModel = new sap.ui.model.json.JSONModel();
				RAEnabledModel.setData(oDataRA);
				this.getView().setModel(RAEnabledModel, "RAEnabledModel");
			}

			DatePicker.prototype.onAfterRendering = function (evt) {
				$("#" + evt.srcControl.getId() + "-inner").prop("readonly", true);
			};

			// jQuery.sap.PseudoEvents.sapescape = function(oEvt) {};

			//Authorization Matrix
			this.oModel.read("RPM_AUTH_ON_LOGINSet?$filter=IpPsNumber eq '" + this.oUser + "'", null, null, true,
				function (data, oResponse) {
					debugger;
					if (data.results.length !== 0) {
						if (data.results[0].Zzdu === "CENTRAL" && data.results[0].Pu === "CENTRAL") {
							//Authorization Flags
							that.Central = true;
							that.PuFlag = false;
							that.DuFlag = false;
							//PU Set
							/*	that.oModel.read("RPM_PU_F4Set", null, null, true,
									function (data2, oResponse2) {
										debugger;
										that.oMainModel.getData().PU = data2.results;
										that.oMainModel.setData(that.oMainModel.getData());
									},
									function (oError) {
										debugger;
										that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
										that.oMessageDialog.open();
									});*/
							//DU Set
							that.oModel.read("RPM_DU_F4Set", null, null, true,
								function (data2, oResponse2) {
									debugger;
									that.oMainModel.getData().DU = data2.results;
									that.oMainModel.setData(that.oMainModel.getData());
								},
								function (oError) {
									debugger;
									that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
									that.oMessageDialog.open();
								});
						} else if (data.results[0].Zzdu === "" && data.results[0].Pu !== "") {
							that.Central = false;
							if (data.results.length === 1) {
								that.PuFlag = true;
								that.getView().byId("idInpPU").setValue(data.results[0].Pu);
								that.getView().byId("idInpPU").setName(data.results[0].Pu);
								that.getView().byId("idInpPU").setEnabled(false);
								that.getView().byId("idInpPUAB").setValue(data.results[0].Pu);
								that.getView().byId("idInpPUAB").setName(data.results[0].Pu);
								that.getView().byId("idInpPUAB").setEnabled(false);
								that.getView().byId("idInpPUAll").setValue(data.results[0].Pu);
								that.getView().byId("idInpPUAll").setName(data.results[0].Pu);
								that.getView().byId("idInpPUAll").setEnabled(false);
								that.getView().byId("idInpPURA").setValue(data.results[0].Pu);
								that.getView().byId("idInpPURA").setName(data.results[0].Pu);
								that.getView().byId("idInpPURA").setEnabled(false);
								that.getView().byId("idInpPUAD").setValue(data.results[0].Pu);
								that.getView().byId("idInpPUAD").setName(data.results[0].Pu);
								that.getView().byId("idInpPUAD").setEnabled(false);
							} else {
								that.PuFlag = false;
							}
							that.oMainModel.getData().PU = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
							that.getView().byId("idInpDU").setEnabled(false);
							that.getView().byId("idInpDUAB").setEnabled(false);
							that.getView().byId("idInpDUAll").setEnabled(false);
							that.getView().byId("idInpDURA").setEnabled(false);
							that.getView().byId("idInpDUAD").setEnabled(false);
						} else if (data.results[0].Zzdu !== "" && data.results[0].Pu === "") {
							that.Central = false;
							//Start Added on 02.04.2018
							var PU = [{
								Pu: "ADM",
								Name1: "Application Development & Main"
							}];
							that.oMainModel.getData().PU = PU;
							//End Added on 02.04.2018
							that.oMainModel.setData(that.oMainModel.getData());
							if (data.results.length === 1) {
								that.DuFlag = true;
								//Start Commented on 01.04.2018
								// that.getView().byId("idInpDU").setValue(data.results[0].Zzdu);
								// that.getView().byId("idInpDU").setName(data.results[0].Zzdu);
								// that.getView().byId("idInpDU").setEnabled(false);
								// that.getView().byId("idInpDUAB").setValue(data.results[0].Zzdu);
								// that.getView().byId("idInpDUAB").setName(data.results[0].Zzdu);
								// that.getView().byId("idInpDUAB").setEnabled(false);
								// that.getView().byId("idInpDUAll").setValue(data.results[0].Zzdu);
								// that.getView().byId("idInpDUAll").setName(data.results[0].Zzdu);
								// that.getView().byId("idInpDUAll").setEnabled(false);
								// that.getView().byId("idInpDURA").setValue(data.results[0].Zzdu);
								// that.getView().byId("idInpDURA").setName(data.results[0].Zzdu);
								// that.getView().byId("idInpDURA").setEnabled(false);
								//End Commented on 01.04.2018
							} else {
								that.DuFlag = false;
							}
							that.oMainModel.getData().DU = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
							//Start Commented on 01.04.2018
							// that.getView().byId("idInpPU").setEnabled(false);
							// that.getView().byId("idInpPUAB").setEnabled(false);
							// that.getView().byId("idInpPUAll").setEnabled(false);
							// that.getView().byId("idInpPURA").setEnabled(false);
							//End Commented on 01.04.2018
						}
					}
				},
				function (oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});

			//Customer Group Set
			this.oModel.read("Customer_GroupSet", null, null, true,
				function (data, oResponse) {
					debugger;
					that.oMainModel.getData().CustomerGroup = data.results;
					that.oMainModel.setData(that.oMainModel.getData());
				},
				function (oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});
		},

		onExcel: function (oEvent) {
			debugger;
			if (this.IconTabSelectedKey === "PR") {
				var custCodeTitle = this.getView().byId("idInpCustomerCode").getName();
				var custGrpTitle = this.getView().byId("idInpCustomerGrp").getName();
				var prjIDTitle = this.getView().byId("idInpProjectID").getName();
				var psnoDesc = this.getView().byId("idInpPSNo").getValue();
				var PUTitle = this.getView().byId("idInpPU").getName();
				var GPUTitle = this.getView().byId("idInpGPU").getName();
				var DUTitle = this.getView().byId("idInpDU").getName();
				var serviceUrlExl = "/sap/opu/odata/sap/ZGW_RE_ORG_DEV_SRV/";
				if (this.getView().byId("idTable1").getRows().length !== 0) {
					window.open(serviceUrlExl + "RES_DETAILS_EXCELSet(IpCustomerCode='" + custCodeTitle + "',IpCustomerGroup='" + custGrpTitle +
						"',IpDu='" + DUTitle + "',IpLoginPs='" + this.oUser + "',IpGrpPu='" + GPUTitle + "',IpProjId='" + prjIDTitle + "',IpPsNumber='" +
						psnoDesc + "',IpPu='" +
						PUTitle + "')/$value");
				} else {
					this.oMessageDialog.getContent()[0].setText("Select appropriate filters for downloading excel");
					this.oMessageDialog.open();
				}
			} else if (this.IconTabSelectedKey === "AB") {
				custCodeTitle = this.getView().byId("idInpCustomerCodeAB").getName();
				custGrpTitle = this.getView().byId("idInpCustomerGrpAB").getName();
				prjIDTitle = this.getView().byId("idInpProjectIDAB").getName();
				psnoDesc = this.getView().byId("idInpPSNoAB").getValue();
				GPUTitle = this.getView().byId("idInpGPUAB").getName();
				PUTitle = this.getView().byId("idInpPUAB").getName();
				DUTitle = this.getView().byId("idInpDUAB").getName();
				serviceUrlExl = "/sap/opu/odata/sap/ZGW_RE_ORG_DEV_SRV/";
				if (this.getView().byId("idTable2").getRows().length !== 0) {
					window.open(serviceUrlExl + "ACC_BENCH_DETAIL_EXCELSet(IpCustomerCode='" + custCodeTitle + "',IpCustomerGroup='" + custGrpTitle +
						"',IpDu='" + DUTitle + "',IpProjId='" + prjIDTitle +
						"',IpPsNumber='" + psnoDesc + "',IpPu='" + PUTitle + "',IpGrpPu='" + GPUTitle + "')/$value");
				} else {
					this.oMessageDialog.getContent()[0].setText("Select appropriate filters for downloading excel");
					this.oMessageDialog.open();
				}
			} else if (this.IconTabSelectedKey === "PUDU") {
				psnoDesc = this.getView().byId("idInpPsNoAll").getValue();
				GPUTitle = this.getView().byId("idInpGPUAll").getName();
				PUTitle = this.getView().byId("idInpPUAll").getName();
				DUTitle = this.getView().byId("idInpDUAll").getName();
				serviceUrlExl = "/sap/opu/odata/sap/ZGW_RE_ORG_DEV_SRV/";
				if (this.getView().byId("idTable3").getRows().length !== 0) {
					window.open(serviceUrlExl + "BENCH_DETAILS_EXCELSet(IpGrpPu='" + GPUTitle + "',IpDu='" + DUTitle + "',IpPsNumber='" + psnoDesc +
						"',IpPu='" + PUTitle +
						"')/$value");
				} else {
					this.oMessageDialog.getContent()[0].setText("Select appropriate filters for downloading excel");
					this.oMessageDialog.open();
				}
			}
		},

		onClear: function (oEvent) {
			debugger;
			if (this.getView().byId("idReorgPU") !== undefined) {
				this.getView().byId("idReorgPU").getContent()[1].getContent()[0].getBinding("items").filter([]);
				this.getView().byId("idReorgPU")._sSearchFieldValue = "";
			}
			if (this.getView().byId("idGPUDialog") !== undefined) {
				this.getView().byId("idGPUDialog").getBinding("items").filter([]);
				this.getView().byId("idGPUDialog")._sSearchFieldValue = "";
			}
			if (this.getView().byId("idDUDialog") !== undefined) {
				this.getView().byId("idDUDialog").getBinding("items").filter([]);
				this.getView().byId("idDUDialog")._sSearchFieldValue = "";
			}
			if (this.getView().byId("idCustGrpDialog") !== undefined) {
				this.getView().byId("idCustGrpDialog").getBinding("items").filter([]);
				this.getView().byId("idCustGrpDialog")._sSearchFieldValue = "";
			}
			if (this.getView().byId("idCustCodeDialog") !== undefined) {
				this.getView().byId("idCustCodeDialog").getBinding("items").filter([]);
				this.getView().byId("idCustCodeDialog")._sSearchFieldValue = "";
			}
			if (this.getView().byId("idPrjIDDialog") !== undefined) {
				this.getView().byId("idPrjIDDialog").getBinding("items").filter([]);
				this.getView().byId("idPrjIDDialog")._sSearchFieldValue = "";
			}
			if (this.getView().byId("idPSNODialog") !== undefined) {
				this.getView().byId("idPSNODialog").getBinding("items").filter([]);
				this.getView().byId("idPSNODialog")._sSearchFieldValue = "";
			}

			this.oDeAllocModel.getData().ProjectResouces = [];
			this.oDeleteModel.getData().ProjectResouces = [];
			this.oSentToPUModel.getData().ProjectResouces = [];
			this.oAccountBenchModel.getData().ProjectResouces = [];
			this.oMASendToPracticeModel.getData().MASendToPractice = [];
			this.count1 = 0;
			this.count2 = 0;
			this.count3 = 0;
			this.count4 = 0;

			if (this.Central === true) {
				this.getView().byId("idInpGPU").setEnabled(true);
				this.getView().byId("idInpPU").setEnabled(true);
				this.getView().byId("idInpGPUAB").setEnabled(true);
				this.getView().byId("idInpPUAB").setEnabled(true);
				this.getView().byId("idInpPUAll").setEnabled(true);
				this.getView().byId("idInpPURA").setEnabled(true);
				this.getView().byId("idInpPUAD").setEnabled(true);
				this.getView().byId("idInpDU").setEnabled(true);
				this.getView().byId("idInpDUAB").setEnabled(true);
				this.getView().byId("idInpDUAll").setEnabled(true);
				this.getView().byId("idInpDURA").setEnabled(true);
				this.getView().byId("idInpDUAD").setEnabled(true);
			}
			if (this.IconTabSelectedKey === "PR") {
				this.getView().byId("idPrjResBar").setText("Project Resource");
				//Start Commented on 01.04.2018
				// if (this.DuFlag === false) {
				// 	this.getView().byId("idInpDU").setValue("");
				// 	this.getView().byId("idInpDU").setName("");
				// }
				//End Commented on 01.04.2018
				if (this.DuFlag === false || this.DuFlag === true) {
					this.getView().byId("idInpDU").setValue("");
					this.getView().byId("idInpDU").setName("");
					this.getView().byId("idInpPU").setValue("");
					this.getView().byId("idInpPU").setName("");
					this.getView().byId("idInpPU").setEnabled(true);
					this.getView().byId("idInpGPU").setValue("");
					this.getView().byId("idInpGPU").setName("");
					this.getView().byId("idInpGPU").setEnabled(true);
					this.getView().byId("idInpPUAB").setEnabled(true);
					this.getView().byId("idInpPUAll").setEnabled(true);
					this.getView().byId("idInpPURA").setEnabled(true);
					this.getView().byId("idInpPUAD").setEnabled(true);
					this.getView().byId("idInpDU").setEnabled(true);
					this.getView().byId("idInpDUAB").setEnabled(true);
					this.getView().byId("idInpDUAll").setEnabled(true);
					this.getView().byId("idInpDURA").setEnabled(true);
					this.getView().byId("idInpDUAD").setEnabled(true);
				}
				if (this.PuFlag === false) {
					this.getView().byId("idInpGPU").setValue("");
					this.getView().byId("idInpGPU").setName("");
					this.getView().byId("idInpPU").setValue("");
					this.getView().byId("idInpPU").setName("");
				}
				this.getView().byId("idInpCustomerGrp").setValue("");
				this.getView().byId("idInpCustomerGrp").setName("");
				this.getView().byId("idInpCustomerCode").setValue("");
				this.getView().byId("idInpCustomerCode").setName("");
				this.getView().byId("idInpProjectID").setValue("");
				this.getView().byId("idInpProjectID").setName("");
				this.getView().byId("idInpPSNo").setValue("");
				this.getView().byId("idInpPSNo").setName("");
				this.getView().byId("idInpGPU").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpPU").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpDU").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpCustomerGrp").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpCustomerCode").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpProjectID").setValueState(sap.ui.core.ValueState.None);
				var len = this.getView().byId("idTable1").getSelectedIndices();
				for (var i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				this.oMainModel.getData().ProjectResouces = [];
				this.oMainModel.refresh();
			} else if (this.IconTabSelectedKey === "AB") {
				this.getView().byId("idABBar").setText("Account Pool Resource");
				//Start Commented on 01.04.2018
				// if (this.DuFlag === false) {
				// 	this.getView().byId("idInpDUAB").setValue("");
				// 	this.getView().byId("idInpDUAB").setName("");
				// }
				//End Commented on 01.04.2018
				if (this.DuFlag === false || this.DuFlag === true) {
					this.getView().byId("idInpDUAB").setValue("");
					this.getView().byId("idInpDUAB").setName("");
					this.getView().byId("idInpPUAB").setValue("");
					this.getView().byId("idInpPUAB").setName("");
					//03.05.2019 added GPU Logic for AP resource TAB
					this.getView().byId("idInpGPUAB").setValue("");
					this.getView().byId("idInpGPUAB").setName("");
					//
					this.getView().byId("idInpDU").setValue("");
					this.getView().byId("idInpDU").setName("");
					this.getView().byId("idInpPU").setEnabled(true);
					this.getView().byId("idInpPUAB").setEnabled(true);
					this.getView().byId("idInpPUAll").setEnabled(true);
					this.getView().byId("idInpPURA").setEnabled(true);
					this.getView().byId("idInpPUAD").setEnabled(true);
					//03.05.2019 added GPU Logic for AP resource TAB
					this.getView().byId("idInpGPU").setEnabled(true);
					this.getView().byId("idInpGPUAB").setEnabled(true);
					this.getView().byId("idInpGPUAll").setEnabled(true);
					this.getView().byId("idInpGPURA").setEnabled(true);
					//this.getView().byId("idInpGPUAD").setEnabled(true);
					//

					this.getView().byId("idInpDU").setEnabled(true);
					this.getView().byId("idInpDUAB").setEnabled(true);
					this.getView().byId("idInpDUAll").setEnabled(true);
					this.getView().byId("idInpDURA").setEnabled(true);
					this.getView().byId("idInpDUAD").setEnabled(true);
				}
				if (this.PuFlag === false) {
					this.getView().byId("idInpPUAB").setValue("");
					this.getView().byId("idInpPUAB").setName("");
					//03.05.2019 added GPU Logic for AP resource TAB
					this.getView().byId("idInpGPUAB").setValue("");
					this.getView().byId("idInpGPUAB").setName("");
					//
				}
				this.getView().byId("idInpCustomerGrpAB").setValue("");
				this.getView().byId("idInpCustomerGrpAB").setName("");
				this.getView().byId("idInpCustomerCodeAB").setValue("");
				this.getView().byId("idInpCustomerCodeAB").setName("");
				this.getView().byId("idInpProjectIDAB").setValue("");
				this.getView().byId("idInpProjectIDAB").setName("");
				this.getView().byId("idInpPSNoAB").setValue("");
				this.getView().byId("idInpPSNoAB").setName("");
				this.getView().byId("idInpPUAB").setValueState(sap.ui.core.ValueState.None);
				//03.05.2019 added GPU Logic for AP resource TAB
				this.getView().byId("idInpGPUAB").setValueState(sap.ui.core.ValueState.None);
				//
				this.getView().byId("idInpDUAB").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpCustomerGrpAB").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpCustomerCodeAB").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpProjectIDAB").setValueState(sap.ui.core.ValueState.None);
				len = this.getView().byId("idTable2").getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				this.oMainModel.getData().AccountBench = [];
				this.oMainModel.refresh();
			} else if (this.IconTabSelectedKey === "PUDU") {
				this.getView().byId("idAllBar").setText("PU/DU Pool");
				//Start Commented on 01.04.2018
				// if (this.DuFlag === false) {
				// 	this.getView().byId("idInpDUAll").setValue("");
				// 	this.getView().byId("idInpDUAll").setName("");
				// }
				//End Commented on 01.04.2018
				if (this.DuFlag === false || this.DuFlag === true) {
					this.getView().byId("idInpDUAll").setValue("");
					this.getView().byId("idInpDUAll").setName("");
					//03.05.2019 GPU addded on PUDU TAB
					this.getView().byId("idInpGPUAll").setValue("");
					this.getView().byId("idInpGPUAll").setName("");
					//
					this.getView().byId("idInpPUAll").setValue("");
					this.getView().byId("idInpPUAll").setName("");
					this.getView().byId("idInpDU").setValue("");
					this.getView().byId("idInpDU").setName("");
					this.getView().byId("idInpPU").setEnabled(true);
					//03.05.2019 GPU addded on PUDU TAB
					this.getView().byId("idInpGPU").setEnabled(true);
					//
					this.getView().byId("idInpPUAB").setEnabled(true);
					//03.05.2019 GPU addded on PUDU TAB
					this.getView().byId("idInpGPUAB").setEnabled(true);
					//
					this.getView().byId("idInpPUAll").setEnabled(true);
					//03.05.2019 GPU addded on PUDU TAB
					this.getView().byId("idInpGPUAll").setEnabled(true);
					//
					this.getView().byId("idInpPURA").setEnabled(true);
					//03.05.2019 GPU addded on PUDU TAB
					this.getView().byId("idInpGPURA").setEnabled(true);
					//
					this.getView().byId("idInpPUAD").setEnabled(true);
					//03.05.2019 GPU addded on PUDU TAB
					//this.getView().byId("idInpGPUAD").setEnabled(true);
					//
					this.getView().byId("idInpDU").setEnabled(true);
					this.getView().byId("idInpDUAB").setEnabled(true);
					this.getView().byId("idInpDUAll").setEnabled(true);
					this.getView().byId("idInpDURA").setEnabled(true);
					this.getView().byId("idInpDUAD").setEnabled(true);
				}
				if (this.PuFlag === false) {
					this.getView().byId("idInpPUAll").setValue("");
					this.getView().byId("idInpPUAll").setName("");

					/*	this.getView().byId("idInpGPUAll").setValue("");
						this.getView().byId("idInpGPUAll").setName("");*/
				}
				this.getView().byId("idInpPsNoAll").setValue("");
				this.getView().byId("idInpPsNoAll").setName("");
				this.getView().byId("idInpPUAll").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpDUAll").setValueState(sap.ui.core.ValueState.None);
				this.oMainModel.getData().PUDUBench = [];
				this.oMainModel.refresh();
			} else if (this.IconTabSelectedKey === "ResAlloc") {

				//Start Commented on 01.04.2018
				// if (this.DuFlag === false) {
				// 	this.getView().byId("idInpDURA").setValue("");
				// 	this.getView().byId("idInpDURA").setName("");
				// }
				//End Commented on 01.04.2018
				if (this.DuFlag === false || this.DuFlag === true) {
					this.getView().byId("idInpDURA").setValue("");
					this.getView().byId("idInpDURA").setName("");
					this.getView().byId("idInpPURA").setValue("");
					this.getView().byId("idInpPURA").setName("");
					//03.05.2019 GPU Added.
					this.getView().byId("idInpGPURA").setValue("");
					this.getView().byId("idInpGPURA").setName("");
					//
					this.getView().byId("idInpDU").setValue("");
					this.getView().byId("idInpDU").setName("");

					this.getView().byId("idInpPU").setEnabled(true);
					this.getView().byId("idInpPUAB").setEnabled(true);
					this.getView().byId("idInpPUAll").setEnabled(true);
					this.getView().byId("idInpPURA").setEnabled(true);
					//03.05.2019 GPU Added.
					this.getView().byId("idInpGPU").setEnabled(true);
					this.getView().byId("idInpGPUAB").setEnabled(true);
					this.getView().byId("idInpGPUAll").setEnabled(true);
					this.getView().byId("idInpGPURA").setEnabled(true);
					//
					this.getView().byId("idInpPUAD").setEnabled(true);
					this.getView().byId("idInpDU").setEnabled(true);
					this.getView().byId("idInpDUAB").setEnabled(true);
					this.getView().byId("idInpDUAll").setEnabled(true);
					this.getView().byId("idInpDURA").setEnabled(true);
					this.getView().byId("idInpDUAD").setEnabled(true);
				}
				if (this.PuFlag === false) {
					this.getView().byId("idInpPURA").setValue("");
					this.getView().byId("idInpPURA").setName("");
				}

				// for (i = 0; i < this.oTableAllocDisplay3.getData().searchSet.length; i++) {
				// 	this.oTableAllocDisplay3.getData().searchSet[i].CustCodeEditable = true;
				// 	this.oTableAllocDisplay3.getData().searchSet[i].PrjIDEditable = true;
				// }

				this.getView().byId("idInpPURA").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpGPURA").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpDURA").setValueState(sap.ui.core.ValueState.None);
				this.oTableAllocDisplay3.getData().searchSet = [];
				this.oTableAllocDisplay3.refresh();
				this.oMainModel.getData().ProjectID = [];
				this.oMainModel.refresh();
				if (this.oUser === "98765432") {
					var minDateTemp = "2018-01-01";
					var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
					minDate = new Date(minDate);
				} else if (this.oUser === "10642988") {
					var minDateTemp = "2018-01-01";
					var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
					minDate = new Date(minDate);
				} else {
					//5 Days
					// var newDate = new Date();
					// var modDate5Days = new Date(newDate - (5 * 86400000)).setHours(0, 0, 0, 0);
					// minDate = new Date(modDate5Days);

					//1st July
					// var minDateTemp = "2018-07-01";
					// var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
					// minDate = new Date(minDate);

					//Backdated
					var minDateTemp = this.getOwnerComponent().BackDateDash;
					var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
					minDate = new Date(minDate);
				}

				this.oTableAllocDisplay3.getData().searchSet.push({
					Pernr: "",
					StartDate: "",
					//Commented on 18.04.2018
					// CurrentDate: this.CurrentDate,
					CurrentDate: minDate,
					CustCode: "",
					CustCodeDesc: "",
					CustCodeEditable: true,
					PrjIDEditable: true,
					PUName: "",
					PUValue: "",
					EndDate: "99991231",
					PercentAlloc: "",
					Skill: "",
					L1WbsValue: "", //Project ID
					L1WbsName: "", //Project Name
					ImRepMgr: "",
					Name: "",
					Country: "",
					CountryDesc: "",
					State: "",
					StateDesc: "",
					L3WbsValue: "", // Location ID
					L3WbsDescName: "", //Location Name
					OppId: "",
					RoleValue: "",
					RoleName: "",
					RoleDesc: "",
					BillRateValue: "", // Bill Rate ID
					BillRateName: "",
					BufferFlag: "",
					PoNumber: "",
					PoStartDate: "",
					PoEndDate: "",
					PoValue: "",
					PoCurrency: "",
					AllocStat: "",
					BaseLoc: ""
				});
				this.oTableAllocDisplay3.refresh();
				this.count = 0;
			} else if (this.IconTabSelectedKey === "DUPool") {
				this.getView().byId("idDUPoolBar").setText("Multi Account Pool");
			}
			//Changes by 10639214
			else if (this.IconTabSelectedKey === "DetAlloc") {
				this.getView().byId("idADBar").setText("Detailed Allocations");
				if (this.DuFlag === false || this.DuFlag === true) {
					this.getView().byId("idInpDUAD").setValue("");
					this.getView().byId("idInpDUAD").setName("");
					this.getView().byId("idInpPUAD").setValue("");
					this.getView().byId("idInpPUAD").setName("");
					this.getView().byId("idInpDU").setValue("");
					this.getView().byId("idInpDU").setName("");
					this.getView().byId("idInpPU").setEnabled(true);
					this.getView().byId("idInpPUAB").setEnabled(true);
					this.getView().byId("idInpPUAD").setEnabled(true);
					this.getView().byId("idInpPURA").setEnabled(true);
					this.getView().byId("idInpPUAD").setEnabled(true);
					this.getView().byId("idInpDU").setEnabled(true);
					this.getView().byId("idInpDUAB").setEnabled(true);
					this.getView().byId("idInpDUAD").setEnabled(true);
					this.getView().byId("idInpDURA").setEnabled(true);
					this.getView().byId("idInpDUAD").setEnabled(true);
				}
				if (this.PuFlag === false) {
					this.getView().byId("idInpPUAD").setValue("");
					this.getView().byId("idInpPUAD").setName("");
				}
				this.getView().byId("idInpPsNoAD").setValue("");
				this.getView().byId("idInpPsNoAD").setName("");
				this.getView().byId("idInpPUAD").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpDUAD").setValueState(sap.ui.core.ValueState.None);
				this.oMainModel.getData().AllocDetail = [];
				this.oMainModel.refresh();
			}
			//End of Changes
		},

		onSelectTab: function (oEvent) {
			debugger;
			this.IconTabSelectedKey = this.getView().byId("iconTabHeader").getSelectedKey();
			if (this.Central === true) {
				this.getView().byId("idInpPU").setEnabled(true);
				this.getView().byId("idInpPUAB").setEnabled(true);
				this.getView().byId("idInpPUAll").setEnabled(true);
				this.getView().byId("idInpPURA").setEnabled(true);
				this.getView().byId("idInpPUAD").setEnabled(true);
				this.getView().byId("idInpDU").setEnabled(true);
				this.getView().byId("idInpDUAB").setEnabled(true);
				this.getView().byId("idInpDUAll").setEnabled(true);
				this.getView().byId("idInpDURA").setEnabled(true);
				this.getView().byId("idInpDUAD").setEnabled(true);
			}
			if (this.IconTabSelectedKey === "PR") {
				this.onClear();
				var len = this.getView().byId("idTable2").getSelectedIndices();
				for (var i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				this.oMainModel.refresh();
				this.getView().byId("idProjectResourceFragment").setVisible(true);
				this.getView().byId("idAccountBenchFragment").setVisible(false);
				this.getView().byId("idPUDUBenchFragment").setVisible(false);
				this.getView().byId("idResourcAllocationFragment").setVisible(false);
				this.getView().byId("idDUPoolFragment").setVisible(false);
				this.getView().byId("idAllocDetFragment").setVisible(false);
				this.getView().byId("idAllocDetFragment").setVisible(false);
				this.getView().byId("idDeputationFragment").setVisible(false);
			} else if (this.IconTabSelectedKey === "AB") {
				this.onClear();
				len = this.getView().byId("idTable1").getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				this.oMainModel.refresh();
				this.getView().byId("idProjectResourceFragment").setVisible(false);
				this.getView().byId("idAccountBenchFragment").setVisible(true);
				this.getView().byId("idPUDUBenchFragment").setVisible(false);
				this.getView().byId("idResourcAllocationFragment").setVisible(false);
				this.getView().byId("idDUPoolFragment").setVisible(false);
				this.getView().byId("idAllocDetFragment").setVisible(false);
				this.getView().byId("idDeputationFragment").setVisible(false);
			} else if (this.IconTabSelectedKey === "PUDU") {
				this.onClear();
				if (this.DuFlag === true || this.PuFlag === true) {
					var DUTitle = this.getView().byId("idInpDUAll").getValue();
					var PUTitle = this.getView().byId("idInpPUAll").getName();
					var GPUTitle = this.getView().byId("idInpGPUAll").getName();
					var that = this;
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read("PUDUBENCH_PSNO_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" + GPUTitle +
						"'",
						null, null, true,
						function (data, oResponse) {
							debugger;
							that.oMainModel.getData().PsNo = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
				len = this.getView().byId("idTable1").getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				len = this.getView().byId("idTable2").getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				this.oMainModel.refresh();
				this.getView().byId("idPUDUBenchFragment").setVisible(true);
				this.getView().byId("idAccountBenchFragment").setVisible(false);
				this.getView().byId("idProjectResourceFragment").setVisible(false);
				this.getView().byId("idResourcAllocationFragment").setVisible(false);
				this.getView().byId("idDUPoolFragment").setVisible(false);
				this.getView().byId("idAllocDetFragment").setVisible(false);
				this.getView().byId("idDeputationFragment").setVisible(false);
			} else if (this.IconTabSelectedKey === "ResAlloc") {
				this.onClear();
				if (this.DuFlag === true || this.PuFlag === true) {
					this.oMainModel.getData().ProjectID = [];
					DUTitle = this.getView().byId("idInpDURA").getValue();
					PUTitle = this.getView().byId("idInpPURA").getName();
					var GPUTitle = this.getView().byId("idInpGPURA").getName();
					that = this;
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read("PUDUBENCH_PROJID_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" +
						GPUTitle + "'",
						null, null, true,
						function (data, oResponse) {
							debugger;
							for (i = 0; i < that.oTableAllocDisplay3.getData().searchSet.length; i++) {
								that.oTableAllocDisplay3.getData().searchSet[i].L1WbsName = "";
								that.oTableAllocDisplay3.getData().searchSet[i].L1WbsValue = "";
								that.oTableAllocDisplay3.getData().searchSet[i].DUValue = "";
							}
							that.oTableAllocDisplay3.refresh();
							that.oMainModel.getData().ProjectID = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
				len = this.getView().byId("idTable1").getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				len = this.getView().byId("idTable2").getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				this.getView().byId("idResourcAllocationFragment").setVisible(true);
				this.getView().byId("idPUDUBenchFragment").setVisible(false);
				this.getView().byId("idAccountBenchFragment").setVisible(false);
				this.getView().byId("idProjectResourceFragment").setVisible(false);
				this.getView().byId("idDUPoolFragment").setVisible(false);
				this.getView().byId("idAllocDetFragment").setVisible(false);
				this.getView().byId("idDeputationFragment").setVisible(false);
			} else if (this.IconTabSelectedKey === "DUPool") {
				this.onClear();
				this.getView().byId("idDUPoolFragment").setVisible(true);
				this.getView().byId("idResourcAllocationFragment").setVisible(false);
				this.getView().byId("idPUDUBenchFragment").setVisible(false);
				this.getView().byId("idAccountBenchFragment").setVisible(false);
				this.getView().byId("idProjectResourceFragment").setVisible(false);
				this.getView().byId("idAllocDetFragment").setVisible(false);
				this.getView().byId("idDeputationFragment").setVisible(false);
			}
			//Start new by 10639214
			else if (this.IconTabSelectedKey === "DetAlloc") {
				this.onClear();

				this.getView().byId("idAllocDetFragment").setVisible(true);
				this.getView().byId("idResourcAllocationFragment").setVisible(false);
				this.getView().byId("idPUDUBenchFragment").setVisible(false);
				this.getView().byId("idAccountBenchFragment").setVisible(false);
				this.getView().byId("idProjectResourceFragment").setVisible(false);
				this.getView().byId("idDUPoolFragment").setVisible(false);
				this.getView().byId("idDeputationFragment").setVisible(false);
			} else if (this.IconTabSelectedKey === "Deputation") {
				debugger;
				this.onClear();

				this.getView().byId("idAllocDetFragment").setVisible(false);
				this.getView().byId("idResourcAllocationFragment").setVisible(false);
				this.getView().byId("idPUDUBenchFragment").setVisible(false);
				this.getView().byId("idAccountBenchFragment").setVisible(false);
				this.getView().byId("idProjectResourceFragment").setVisible(false);
				this.getView().byId("idDUPoolFragment").setVisible(false);
				this.getView().byId("idDeputationFragment").setVisible(true);
			}
			//End new by 10639214

			this.oMainModel.getData().CustomerCode = [];
			this.oMainModel.getData().ProjectID = [];
			this.oMainModel.getData().PsNo = [];
			this.oMainModel.getData().PUDUProjectID = [];
			this.oMainModel.getData().ProjectResouces = [];
			this.oMainModel.getData().AccountBench = [];
			this.oMainModel.getData().PUDUBench = [];
			this.oMainModel.getData().ProjectIDPUDUBench = [];
			this.oMainModel.getData().DUDUPoolDisplay = [];
			this.oMainModel.refresh();
		},

		onDisplay: function (oEvent) {
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();
			this.oDeAllocModel.getData().ProjectResouces = [];
			this.oDeleteModel.getData().ProjectResouces = [];
			this.oSentToPUModel.getData().ProjectResouces = [];
			this.oAccountBenchModel.getData().ProjectResouces = [];
			this.oMASendToPracticeModel.getData().MASendToPractice = [];
			this.count1 = 0;
			this.count2 = 0;
			this.count3 = 0;
			this.count4 = 0;

			// jQuery.sap.delayedCall(1000, this, function() {
			debugger;
			var that = this;
			if (this.IconTabSelectedKey === "PR") {
				var table = this.getView().byId("idTable1");
				for (var i = 0; i < this.oMainModel.getData().ProjectResouces.length; i++) {
					this.oMainModel.getData().ProjectResouces[i].Enabled = false;
					this.oMainModel.getData().ProjectResouces[i].bSelected = false;
				}
				var len = table.getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				var custCodeTitle = this.getView().byId("idInpCustomerCode").getName();
				var custGrpTitle = this.getView().byId("idInpCustomerGrp").getName();
				var prjIDTitle = this.getView().byId("idInpProjectID").getName();
				var psnoDesc = this.getView().byId("idInpPSNo").getValue();
				var PUTitle = this.getView().byId("idInpPU").getName();
				var GPUTitle = this.getView().byId("idInpGPU").getName();
				var DUTitle = this.getView().byId("idInpDU").getName();
				if (custCodeTitle === "" && custGrpTitle === "" && prjIDTitle === "" && psnoDesc === "" && GPUTitle === "" && PUTitle === "" &&
					DUTitle === "") {
					this.oMessageDialog.getContent()[0].setText("Enter either GPU or PU or DU or Personnel Number");
					this.busyDialog.close();
					this.oMessageDialog.open();
				} else {
					//Project Resource Details
					/*	var sServiceUrl = "/sap/opu/odata/SAP/ZGW_RE_ORG_DEV_SRV/"
						var oModelNew = new sap.ui.model.odata.ODataModel(sServiceUrl, {
							json: false,
							loadMetadataAsync: true
						});*/
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");
					oModelNew.read("PROJ_RES_DETAILSSet?$filter=IpCustomerCode eq '" + custCodeTitle + "' and IpLoginPs eq '" + this.oUser +
						"' and IpCustomerGroup eq '" + custGrpTitle + "' and IpDu eq '" + DUTitle + "' and IpProjId eq '" + prjIDTitle +
						"' and IpPsNumber eq '" + psnoDesc + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" + GPUTitle + "'", null, null, true,
						function (data, oResponse) {
							debugger;
							var title = "Project Resource" + " (" + data.results.length + ")";
							that.getView().byId("idPrjResBar").setText(title);
							that.oMainModel.getData().ProjectResouces = data.results;
							that.oMainModel.setData(that.oMainModel.getData());

							for (i = 0; i < data.results.length; i++) {
								that.oMainModel.getData().ProjectResouces[i].DateValidation = "None";
								var srtDt = that.CurrentDate;
								var startDateStd = new Date(srtDt);
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
									// var modDate5Days = new Date(newDate - (5 * 86400000)).setHours(0, 0, 0, 0);
									// minDate = new Date(modDate5Days);

									// var minDateTemp = "2018-07-01";
									// var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
									// minDate = new Date(minDate);

									var minDateTemp = that.getOwnerComponent().BackDateDash;
									var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
									minDate = new Date(minDate);
								}

								that.oMainModel.getData().ProjectResouces[i].StandardStartDate = minDate;
								// that.oMainModel.getData().ProjectResouces[i].StandardStartDate = startDateStd;
								that.oMainModel.getData().ProjectResouces[i].ActualEndDate = data.results[i].EndDate;

								var endDt = data.results[i].EndDate;
								var yy = endDt.slice(0, 4);
								var mm = endDt.slice(4, 6);
								var dd = endDt.slice(6, 8);
								var StandardEndDate1 = yy + "-" + mm + "-" + dd;
								var endDateStd = new Date(StandardEndDate1);
								that.oMainModel.getData().ProjectResouces[i].StandardEndDate = endDateStd;
								that.oMainModel.getData().ProjectResouces[i].Enabled = false;
								that.oMainModel.getData().ProjectResouces[i].bSelected = false;
								if (data.results[i].BufferFlag === "X") {
									that.oMainModel.getData().ProjectResouces[i].BuffFlag = true;
								}
							}
							that.oMainModel.refresh();
							that.busyDialog.close();
						},
						function (oError) {
							debugger;
							that.busyDialog.close();
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
			} else if (this.IconTabSelectedKey === "AB") {
				table = this.getView().byId("idTable2");
				for (i = 0; i < this.oMainModel.getData().AccountBench.length; i++) {
					this.oMainModel.getData().AccountBench[i].Enabled = false;
					this.oMainModel.getData().AccountBench[i].bSelected = false;
				}
				len = table.getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				custCodeTitle = this.getView().byId("idInpCustomerCodeAB").getName();
				custGrpTitle = this.getView().byId("idInpCustomerGrpAB").getName();
				prjIDTitle = this.getView().byId("idInpProjectIDAB").getName();
				psnoDesc = this.getView().byId("idInpPSNoAB").getValue();
				GPUTitle = this.getView().byId("idInpGPUAB").getName();
				PUTitle = this.getView().byId("idInpPUAB").getName();
				DUTitle = this.getView().byId("idInpDUAB").getName();
				if (GPUTitle === "" && custCodeTitle === "" && custGrpTitle === "" && prjIDTitle === "" && psnoDesc === "" && PUTitle === "" &&
					DUTitle === "") {
					this.oMessageDialog.getContent()[0].setText("Enter either GPU or PU or DU or Personnel Number");
					this.busyDialog.close();
					this.oMessageDialog.open();
				} else {
					//Account Bench Details
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");
					oModelNew.read("ACC_BENCH_DETAILSSet?$filter=IpCustomerCode eq '" + custCodeTitle +
						"' and IpCustomerGroup eq '" + custGrpTitle + "' and IpDu eq '" + DUTitle + "' and IpProjId eq '" + prjIDTitle +
						"' and IpPsNumber eq '" + psnoDesc + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" + GPUTitle + "'", null, null, true,
						function (data, oResponse) {
							debugger;
							var title = "Account Pool Resource" + " (" + data.results.length + ")";
							that.getView().byId("idABBar").setText(title);
							that.oMainModel.getData().AccountBench = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
							for (i = 0; i < data.results.length; i++) {
								that.oMainModel.getData().AccountBench[i].AllocStat = "Pool";
								that.oMainModel.getData().AccountBench[i].DateValidation = "None";
								that.oMainModel.getData().AccountBench[i].bSelected = false;
								that.oMainModel.getData().AccountBench[i].Enabled = false;
								var srtDt = that.CurrentDate;
								var startDateStd = new Date(srtDt);

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
									// var modDate5Days = new Date(newDate - (5 * 86400000)).setHours(0, 0, 0, 0);
									// minDate = new Date(modDate5Days);

									// var minDateTemp = "2018-07-01";
									// var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
									// minDate = new Date(minDate);

									var minDateTemp = that.getOwnerComponent().BackDateDash;
									var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
									minDate = new Date(minDate);
								}

								that.oMainModel.getData().AccountBench[i].StandardStartDate = minDate;
								// that.oMainModel.getData().AccountBench[i].StandardStartDate = startDateStd;

								var endDt = data.results[i].EndDate;
								var yy = endDt.slice(0, 4);
								var mm = endDt.slice(4, 6);
								var dd = endDt.slice(6, 8);
								var StandardEndDate1 = yy + "-" + mm + "-" + dd;
								var endDateStd = new Date(StandardEndDate1);
								that.oMainModel.getData().AccountBench[i].StandardEndDate = endDateStd;
							}
							that.oMainModel.refresh();
							that.busyDialog.close();
						},
						function (oError) {
							debugger;
							that.busyDialog.close();
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
			} else if (this.IconTabSelectedKey === "PUDU") {
				GPUTitle = this.getView().byId("idInpGPUAll").getName();
				psnoDesc = this.getView().byId("idInpPsNoAll").getValue();
				PUTitle = this.getView().byId("idInpPUAll").getName();
				DUTitle = this.getView().byId("idInpDUAll").getName();
				if (GPUTitle === "" && psnoDesc === "" && PUTitle === "" && DUTitle === "") {
					this.oMessageDialog.getContent()[0].setText("Enter either GPU or PU or DU or Personnel Number");
					this.busyDialog.close();
					this.oMessageDialog.open();
				} else {
					//PU DU Bench Details

					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");
					oModelNew.read("BENCH_DETAILSSet?$filter=IpGrpPu eq '" + GPUTitle + "' and IpDu eq '" + DUTitle + "' and IpPsNumber eq '" +
						psnoDesc + "' and IpPu eq '" +
						PUTitle + "'",
						null, null, true,
						function (data, oResponse) {
							debugger;
							var title = "PU/DU Pool" + " (" + data.results.length + ")";
							that.getView().byId("idAllBar").setText(title);
							that.oMainModel.getData().PUDUBench = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
							for (i = 0; i < data.results.length; i++) {
								that.oMainModel.getData().PUDUBench[i].AllocStat = "Pool";
							}
							that.oMainModel.refresh();
							that.busyDialog.close();
						},
						function (oError) {
							debugger;
							that.busyDialog.close();
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
			} else if (this.IconTabSelectedKey === "DUPool") {
				table = this.getView().byId("idTable5");
				len = table.getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
				DUTitle = this.getView().byId("idInpDUDUPool").getName();
				if (DUTitle === "") {
					this.oMessageDialog.getContent()[0].setText("Enter DU");
					this.busyDialog.close();
					this.oMessageDialog.open();
				} else {
					//PU DU Bench Details
					this.oModel.read("RPM_MULTI_ACC_RES_DISPLAYSet?$filter=IvDu eq '" + DUTitle + "'",
						null, null, true,
						function (data, oResponse) {
							debugger;

							var title = "Multi Account Pool" + " (" + data.results.length + ")";
							that.getView().byId("idDUPoolBar").setText(title);
							that.oMainModel.getData().DUDUPoolDisplay = data.results;
							that.oMainModel.setData(that.oMainModel.getData());

							for (i = 0; i < that.oMainModel.getData().DUDUPoolDisplay.length; i++) {
								that.oMainModel.getData().DUDUPoolDisplay[i].DateValidation = "None";
								that.oMainModel.getData().DUDUPoolDisplay[i].Enabled = false;
								that.oMainModel.getData().DUDUPoolDisplay[i].bSelected = false;
								var srtDt = that.CurrentDate;
								var startDateStd = new Date(srtDt);

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
									// var modDate5Days = new Date(newDate - (5 * 86400000)).setHours(0, 0, 0, 0);
									// minDate = new Date(modDate5Days);

									// var minDateTemp = "2018-07-01";
									// var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
									// minDate = new Date(minDate);

									var minDateTemp = that.getOwnerComponent().BackDateDash;
									var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
									minDate = new Date(minDate);
								}

								//Commented on 18.04.2018
								// that.oMainModel.getData().DUDUPoolDisplay[i].StandardStartDate = startDateStd;
								that.oMainModel.getData().DUDUPoolDisplay[i].StandardStartDate = minDate;

								var endDt = data.results[i].EndDate;
								var yy = endDt.slice(0, 4);
								var mm = endDt.slice(4, 6);
								var dd = endDt.slice(6, 8);
								var StandardEndDate1 = yy + "-" + mm + "-" + dd;
								var endDateStd = new Date(StandardEndDate1);
								that.oMainModel.getData().DUDUPoolDisplay[i].StandardEndDate = endDateStd;

								that.oMainModel.getData().DUDUPoolDisplay[i].AllocStat = "Pool";
								that.oMainModel.getData().DUDUPoolDisplay[i].bSelected = false;
								// that.oMainModel.getData().DUDUPoolDisplay[i].StandardStartDate = that.CurrentDate;
								// that.oMainModel.getData().DUDUPoolDisplay[i].StandardEndDate = that.CurrentDate;
								that.oMainModel.getData().DUDUPoolDisplay[i].BuffFlag = "";
								that.oMainModel.getData().DUDUPoolDisplay[i].BillRateEnabled = false;
							}
							that.oMainModel.refresh();
							that.busyDialog.close();
						},
						function (oError) {
							debugger;
							that.busyDialog.close();
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
			} else if (this.IconTabSelectedKey === "DetAlloc") {
				psnoDesc = this.getView().byId("idInpPsNoAD").getValue();
				PUTitle = this.getView().byId("idInpPUAD").getName();
				DUTitle = this.getView().byId("idInpDUAD").getName();
				if (psnoDesc === "") {
					this.oMessageDialog.getContent()[0].setText("Enter Personnel Number");
					this.busyDialog.close();
					this.oMessageDialog.open();
				} else {
					//PU DU Bench Details
					var sServiceUrl = "/sap/opu/odata/SAP/ZGW_BEU_SRV/"
					var oModelNew = new sap.ui.model.odata.ODataModel(sServiceUrl, {
						json: false,
						loadMetadataAsync: true
					});
					oModelNew.read("ALLOCATION_DETAIL_REPORTSet?$filter=PPs eq '" + psnoDesc + "'",
						null, null, true,
						function (data, oResponse) {
							debugger;
							for (i = 0; i < data.results.length; i++) {
								if (data.results[i].ZzchangeDate === "00000000") {
									data.results[i].ZzchangeDate = "";
								}
								if (data.results[i].ZzcreateDate === "00000000") {
									data.results[i].ZzcreateDate = "";
								}
							}
							var title = "Detailed Allocations" + " (" + data.results.length + ")";
							that.getView().byId("idADBar").setText(title);
							that.oMainModel.getData().AllocDetail = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
							that.oMainModel.refresh();
							that.busyDialog.close();
						},
						function (oError) {
							debugger;
							that.busyDialog.close();
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
			}
			this.oMainModel.getData().AccountBench = [];
			this.oMainModel.refresh();
			// this.busyDialog.close();
			// });
		},

		onDeliveryUnit: function (oEvent) {
			debugger;

			var that = this;
			var dialog = new Dialog({
				title: "Warning",
				type: "Message",
				state: "Warning",
				content: new Text({
					text: "Sending to Multi Account Pool. Do you really want to continue?"
				}),
				beginButton: new Button({
					text: "OK",
					press: function (evt) {
						debugger;
						dialog.close();
						if (!that.busyDialog) {
							var busyDialog = new sap.m.BusyDialog();
							customIconRotationSpeed: 100;
							that.busyDialog = busyDialog;
						}
						that.busyDialog.open();
						that.oSDialogModel.getData().listitems = [];
						if (that.getView().byId("idTable2").getSelectedIndices().length !== 0) {

							// var that = this;
							if (that.oAccountBenchModel.getData().ProjectResouces.length !== 0) {
								var batchBench = [];
								var arrBench = {
									"results": []
								};
								var oSaveModel2 = that.oAccountBenchModel;
								for (var i = 0; i < oSaveModel2.getData().ProjectResouces.length; i++) {
									delete oSaveModel2.getData().ProjectResouces[i].__metadata;
									arrBench.results.push({
										Pernr: oSaveModel2.getData().ProjectResouces[i].Pernr,
										StartDate: oSaveModel2.getData().ProjectResouces[i].StartDate,
										EndDate: oSaveModel2.getData().ProjectResouces[i].EndDate,
										L3Wbs: oSaveModel2.getData().ProjectResouces[i].L3Wbs,
										PercentAlloc: oSaveModel2.getData().ProjectResouces[i].PercentAlloc,
										L1Wbs: oSaveModel2.getData().ProjectResouces[i].L1Wbs
									});
								}
								debugger;
								that.oModelBatch.setHeaders({
									"Content-Type": "multipart/mixed;boundary=batch"
								});

								for (i = 0; i < arrBench.results.length; i++) {
									batchBench.push(that.oModelBatch.createBatchOperation("SENT_TO_DUSet?$filter=Pernr%20eq%20'" + arrBench.results[i].Pernr +
										"'",
										"GET"));
								}
								that.oModelBatch.addBatchReadOperations(batchBench);
								that.oModelBatch.setUseBatch(true);
								that.oModelBatch.submitBatch(function (data, mResponse) {
									debugger;
									that.oModelBatch.refresh();
									var opData;
									for (var j = 0; j < data.__batchResponses.length; j++) {
										if (data.__batchResponses[j] !== undefined) {
											opData = data.__batchResponses[j].data.results[0];
											that.oSDialogModel.getData().listitems.push(opData);
										}
									}
									that.onDisplay();
									that.oDUOutputDialog.setModel(that.oSDialogModel, "oSDialogModel");
									that.oSDialogModel.refresh();
								}, function (err) {
									debugger;
									that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
									that.oMessageDialog.open();
								}, false);
								if (that.oDUOutputDialog.getModel("oSDialogModel").getData().listitems.length !== 0) {
									that.oDUOutputDialog.open();
								} else {
									that.oMessageDialog.getContent()[0].setText("No Records Found");
									that.busyDialog.close();
									that.oMessageDialog.open();
								}
							}
							that.busyDialog.close();
						}
						// else {
						// 	that.busyDialog.close();
						// 	that.oMessageDialog.getContent()[0].setText("Select At least one table entry for Sending it to DU");
						// 	that.oMessageDialog.open();
						// }
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function (evt) {
						debugger;
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			if (that.getView().byId("idTable2").getSelectedIndices().length === 0) {
				that.oMessageDialog.getContent()[0].setText("Select At least one table entry for Sending to Multi Account Pool");
				that.oMessageDialog.open();

			} else {
				dialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
				dialog.addStyleClass("MsgDialogClass");
				dialog.getBeginButton().addStyleClass("MsgDialogBtnClass");
				dialog.getEndButton().addStyleClass("MsgDialogBtnClass");
				// that.getView().getDependents()[4].getBeginButton().addStyleClass("MsgDialogBtnClass");
				// that.getView().getDependents()[4].getEndButton().addStyleClass("MsgDialogBtnClass");
				dialog.open();
			}

		},

		onPractice: function (oEvent) {
			debugger;
			// this.oWarningDialog.getContent()[0].setText("Do you want to Send to Practice");
			// this.oWarningDialog.open();

			var that = this;
			var dialog = new Dialog({
				title: "Warning",
				type: "Message",
				state: "Warning",
				content: new Text({
					text: "Sending to Practice. Do you really want to continue?"
				}),
				beginButton: new Button({
					text: "OK",
					press: function (evt) {
						debugger;
						dialog.close();

						if (!that.busyDialog) {
							var busyDialog = new sap.m.BusyDialog();
							customIconRotationSpeed: 100;
							that.busyDialog = busyDialog;
						}
						that.busyDialog.open();

						//Flag For Project Resources Blank Date
						var AccBValFlag = false;
						//Flag For Account Resources Blank Date
						var SentPUFlag = false;
						//Flag For Multi Account Pool Blank Date
						var MAccPoolFlag = false;

						//For Project Resources => For Blank Date
						if (that.oSentToPUModel.getData().ProjectResouces.length >= 1) {
							for (var i = 0; i < that.oSentToPUModel.getData().ProjectResouces.length; i++) {
								if (that.oSentToPUModel.getData().ProjectResouces[i].EndDate === null) {
									that.oMessageDialog.getContent()[0].setText("End Date should not be Blank");
									that.oMessageDialog.open();
									SentPUFlag = false;
									break;
								} else {
									SentPUFlag = true;
								}
							}
						}

						//For Account Resources => For Blank Date
						if (that.oAccountBenchModel.getData().ProjectResouces.length >= 1) {
							for (i = 0; i < that.oAccountBenchModel.getData().ProjectResouces.length; i++) {
								if (that.oAccountBenchModel.getData().ProjectResouces[i].EndDate === null) {
									that.oMessageDialog.getContent()[0].setText("End Date should not be Blank");
									that.oMessageDialog.open();
									AccBValFlag = false;
									break;
								} else {
									AccBValFlag = true;
								}
							}
						}

						//For Multi Account Pool => For Blank Date
						if (that.oMASendToPracticeModel.getData().MASendToPractice.length >= 1) {
							for (i = 0; i < that.oMASendToPracticeModel.getData().MASendToPractice.length; i++) {
								if (that.oMASendToPracticeModel.getData().MASendToPractice[i].EndDate === null) {
									that.oMessageDialog.getContent()[0].setText("End Date should not be Blank");
									that.oMessageDialog.open();
									MAccPoolFlag = false;
									break;
								} else {
									MAccPoolFlag = true;
								}
							}
						}

						if ((that.getView().byId("idTable1").getSelectedIndices().length !== 0 || that.getView().byId("idTable2").getSelectedIndices()
								.length !==
								0 || that.getView().byId("idTable5").getSelectedIndices().length !== 0)) {
							that.oSDialogModel.getData().listitems = [];
							if (that.IconTabSelectedKey === "PR") {
								// var that = this;
								//SENT TO PU
								if (that.oSentToPUModel.getData().ProjectResouces.length !== 0 && SentPUFlag === true) {
									that.oSentToPUModel.refresh();
									var batch = [];
									var arr = {
										"results": []
									};
									var oSaveModel2 = that.oSentToPUModel;
									for (i = 0; i < oSaveModel2.getData().ProjectResouces.length; i++) {
										delete oSaveModel2.getData().ProjectResouces[i].__metadata;
										arr.results.push({
											Pernr: oSaveModel2.getData().ProjectResouces[i].Pernr,
											StartDate: oSaveModel2.getData().ProjectResouces[i].StartDate,
											EndDate: oSaveModel2.getData().ProjectResouces[i].EndDate,
											L3Wbs: oSaveModel2.getData().ProjectResouces[i].L3Wbs,
											PercentAlloc: oSaveModel2.getData().ProjectResouces[i].PercentAlloc,
											L1Wbs: oSaveModel2.getData().ProjectResouces[i].L1Wbs
										});
									}
									debugger;
									that.oModelBatch.setHeaders({
										"Content-Type": "multipart/mixed;boundary=batch"
									});
									for (i = 0; i < arr.results.length; i++) {
										batch.push(that.oModelBatch.createBatchOperation("SENT_PU_RPMSet?$filter=Pernr%20eq%20'" + arr.results[i].Pernr +
											"'%20and%20StartDate%20eq%20'" + arr.results[i].StartDate + "'%20and%20EndDate%20eq%20'" + arr.results[i].EndDate +
											"'%20and%20Wbs%20eq%20'" + arr.results[i].L3Wbs + "'%20and%20Percentage%20eq%20" + arr.results[i].PercentAlloc +
											"%20and%20L1Wbs%20eq%20'" + arr.results[i].L1Wbs + "'",
											"GET"));
									}
									that.oModelBatch.addBatchReadOperations(batch);
									that.oModelBatch.setUseBatch(true);
									that.oModelBatch.submitBatch(function (data, mResponse) {
										that.oModelBatch.refresh();
										debugger;
										var opData;
										for (var j = 0; j < data.__batchResponses.length; j++) {
											if (data.__batchResponses[j] !== undefined) {
												opData = data.__batchResponses[j].data.results[0];
												that.oSDialogModel.getData().listitems.push(opData);
											}
										}
										that.onDisplay();
										that.oOutputDialog.setModel(that.oSDialogModel, "oSDialogModel");
										that.oOutputDialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
										that.oSDialogModel.refresh();
									}, function (err) {
										debugger;
										that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
										that.oMessageDialog.open();
									}, false);
									if (that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length !== 0) {
										that.oOutputDialog.open();
									} else {
										that.oMessageDialog.getContent()[0].setText("No Records Found");
										that.busyDialog.close();
										that.oMessageDialog.open();
									}
								}
							} else if (that.IconTabSelectedKey === "AB") {
								// that = this;
								if (that.oAccountBenchModel.getData().ProjectResouces.length !== 0 && AccBValFlag === true) {
									var batchBench = [];
									var arrBench = {
										"results": []
									};
									oSaveModel2 = that.oAccountBenchModel;
									for (i = 0; i < oSaveModel2.getData().ProjectResouces.length; i++) {
										delete oSaveModel2.getData().ProjectResouces[i].__metadata;
										arrBench.results.push({
											Pernr: oSaveModel2.getData().ProjectResouces[i].Pernr,
											StartDate: oSaveModel2.getData().ProjectResouces[i].StartDate,
											EndDate: oSaveModel2.getData().ProjectResouces[i].EndDate,
											L3Wbs: oSaveModel2.getData().ProjectResouces[i].L3Wbs,
											PercentAlloc: oSaveModel2.getData().ProjectResouces[i].PercentAlloc,
											L1Wbs: oSaveModel2.getData().ProjectResouces[i].L1Wbs
										});
									}
									debugger;
									that.oModelBatch.setHeaders({
										"Content-Type": "multipart/mixed;boundary=batch"
									});
									for (i = 0; i < arrBench.results.length; i++) {
										batchBench.push(that.oModelBatch.createBatchOperation("SENT_PU_RIW_RPMSet?$filter=Pernr%20eq%20'" + arrBench.results[i]
											.Pernr +
											"'%20and%20StartDate%20eq%20'" + arrBench.results[i].StartDate + "'%20and%20EndDate%20eq%20'" + arrBench.results[i].EndDate +
											"'%20and%20Wbs%20eq%20'" + arrBench.results[i].L3Wbs + "'%20and%20Percentage%20eq%20" + arrBench.results[i].PercentAlloc +
											"%20and%20L1Wbs%20eq%20'" + arrBench.results[i].L1Wbs + "'",
											"GET"));
									}
									that.oModelBatch.addBatchReadOperations(batchBench);
									that.oModelBatch.setUseBatch(true);
									that.oModelBatch.submitBatch(function (data, mResponse) {
										debugger;
										that.oModelBatch.refresh();
										var opData;
										for (var j = 0; j < data.__batchResponses.length; j++) {
											if (data.__batchResponses[j] !== undefined) {
												opData = data.__batchResponses[j].data.results[0];
												that.oSDialogModel.getData().listitems.push(opData);
											}
										}
										that.onDisplay();
										that.oOutputDialog.setModel(that.oSDialogModel, "oSDialogModel");
										that.oSDialogModel.refresh();
									}, function (err) {
										debugger;
										that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
										that.oMessageDialog.open();
									}, false);
									if (that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length !== 0) {
										that.oOutputDialog.open();
									} else {
										that.oMessageDialog.getContent()[0].setText("No Records Found");
										that.busyDialog.close();
										that.oMessageDialog.open();
									}
								}
							} else if (that.IconTabSelectedKey === "DUPool") {

								// that = this;
								if (that.oMASendToPracticeModel.getData().MASendToPractice.length !== 0 && MAccPoolFlag === true) {
									var batchBenchMA = [];
									arrBench = {
										"results": []
									};
									oSaveModel2 = that.oMASendToPracticeModel;
									for (i = 0; i < oSaveModel2.getData().MASendToPractice.length; i++) {
										delete oSaveModel2.getData().MASendToPractice[i].__metadata;
										arrBench.results.push({
											Pernr: oSaveModel2.getData().MASendToPractice[i].Pernr,
											StartDate: oSaveModel2.getData().MASendToPractice[i].StartDate,
											EndDate: oSaveModel2.getData().MASendToPractice[i].EndDate,
											Wbs: oSaveModel2.getData().MASendToPractice[i].L3Wbs,
											PercentAlloc: oSaveModel2.getData().MASendToPractice[i].PercentAlloc,
											L1Wbs: oSaveModel2.getData().MASendToPractice[i].L1Wbs
										});
									}
									debugger;
									that.oModelBatch.setHeaders({
										"Content-Type": "multipart/mixed;boundary=batch"
									});
									for (i = 0; i < arrBench.results.length; i++) {
										batchBenchMA.push(that.oModelBatch.createBatchOperation("SENT_TO_PU_MAP_RPMSet?$filter=Pernr%20eq%20'" + arrBench.results[
												i].Pernr +
											"'%20and%20StartDate%20eq%20'" + arrBench.results[i].StartDate + "'%20and%20EndDate%20eq%20'" + arrBench.results[i].EndDate +
											"'%20and%20Wbs%20eq%20'" + arrBench.results[i].Wbs + "'%20and%20Percentage%20eq%20" + arrBench.results[i].PercentAlloc +
											"%20and%20L1Wbs%20eq%20'" + arrBench.results[i].L1Wbs + "'",
											"GET"));
									}
									// for (i = 0; i < arrBench.results.length; i++) {
									// 	batchBenchMA.push(this.oModelBatch.createBatchOperation("SENT_TO_PU_MAP_RPMSet?$filter=Pernr%20eq%20'10611125'%20and%20StartDate%20eq%20'20180226'%20and%20EndDate%20eq%20'20180527'%20and%20Wbs%20eq%20'00111082'%20and%20Percentage%20eq%20100.00%20and%20L1Wbs%20eq%20'00111070'",
									// 		"GET"));
									// }
									that.oModelBatch.addBatchReadOperations(batchBenchMA);
									that.oModelBatch.setUseBatch(true);
									that.oModelBatch.submitBatch(function (data, mResponse) {
										debugger;
										that.oModelBatch.refresh();
										var opData;
										for (var j = 0; j < data.__batchResponses.length; j++) {
											if (data.__batchResponses[j] !== undefined) {
												opData = data.__batchResponses[j].data.results[0];
												that.oSDialogModel.getData().listitems.push(opData);
											}
										}
										that.onDisplay();
										that.oOutputDialog.setModel(that.oSDialogModel, "oSDialogModel");
										that.oSDialogModel.refresh();
									}, function (err) {
										debugger;
										that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
										that.oMessageDialog.open();
									}, false);
									if (that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length !== 0) {
										that.oOutputDialog.open();
									} else {
										that.oMessageDialog.getContent()[0].setText("No Records Found");
										that.busyDialog.close();
										that.oMessageDialog.open();
									}
								}
							}

							that.busyDialog.close();
						}
						// else {
						// 	that.busyDialog.close();
						// 	that.oMessageDialog.getContent()[0].setText("Select At least one table entry for Sending it to PU");
						// 	that.oMessageDialog.open();
						// }
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function (evt) {
						debugger;
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			if (that.getView().byId("idTable1").getSelectedIndices().length === 0 && that.getView().byId("idTable2").getSelectedIndices()
				.length === 0 && that.getView().byId("idTable5").getSelectedIndices().length === 0) {
				that.oMessageDialog.getContent()[0].setText("Select At least one table entry for Sending it to PU");
				that.oMessageDialog.open();

			} else {
				dialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
				dialog.addStyleClass("MsgDialogClass");
				dialog.getBeginButton().addStyleClass("MsgDialogBtnClass");
				dialog.getEndButton().addStyleClass("MsgDialogBtnClass");
				// that.getView().getDependents()[4].getBeginButton().addStyleClass("MsgDialogBtnClass");
				// that.getView().getDependents()[4].getEndButton().addStyleClass("MsgDialogBtnClass");
				// that.getView().byId("idOKBtn").addStyleClass("MsgDialogBtnClass");
				// that.getView().byId("idCancelBtn").addStyleClass("MsgDialogBtnClass");

				dialog.open();
			}
		},

		onAccPool: function (oEvent) {
			debugger;

			var that = this;
			var dialog = new Dialog({
				title: "Warning",
				type: "Message",
				state: "Warning",
				content: new Text({
					text: "Sending to Account Pool. Do you really want to continue?"
				}),
				beginButton: new Button({
					text: "OK",
					press: function (evt) {
						debugger;
						dialog.close();
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

						//Allocated
						that.oDeAllocModel.refresh();
						//Palnned
						that.oDeleteModel.refresh();

						//Flag For Project Resource Blank Date
						var DeAllValFlag = false;
						//Flag For Project Resource Blank Date
						var DelValFlag = false;
						//Flag For Project Resource Change Date
						var DeAllEndDateFlag = false;

						if (that.oDeAllocModel.getData().ProjectResouces.length >= 1) {
							for (var i = 0; i < that.oDeAllocModel.getData().ProjectResouces.length; i++) {
								if (that.oDeAllocModel.getData().ProjectResouces[i].EndDate === null) {
									that.oMessageDialog.getContent()[0].setText("End Date should not be Blank");
									that.oMessageDialog.open();
									DeAllValFlag = false;
									break;
								} else {
									DeAllValFlag = true;
								}
							}
							for (i = 0; i < that.oDeAllocModel.getData().ProjectResouces.length; i++) {
								if (that.oDeAllocModel.getData().ProjectResouces[i].ActualEndDate === that.oDeAllocModel.getData().ProjectResouces[i].EndDate) {
									that.oMessageDialog.getContent()[0].setText(
										"Please Change the End Date for Selected Allocated Resources before sending it to Account Pool");
									that.oMessageDialog.open();
									DeAllEndDateFlag = false;
									break;
								} else {
									DeAllEndDateFlag = true;
								}
							}
						}

						if (that.oDeleteModel.getData().ProjectResouces.length >= 1) {
							for (i = 0; i < that.oDeleteModel.getData().ProjectResouces.length; i++) {
								if (that.oDeleteModel.getData().ProjectResouces[i].EndDate === null) {
									that.oMessageDialog.getContent()[0].setText("End Date should not be Blank");
									that.oMessageDialog.open();
									DelValFlag = false;
									break;
								} else {
									DelValFlag = true;
								}
							}
						}

						if ((that.getView().byId("idTable1").getSelectedIndices().length !== 0)) {
							that.oSDialogModel.getData().listitems = [];
							// var that = this;
							var iLength = that.oDeAllocModel.getData().ProjectResouces;
							var iLengthDel = that.oDeleteModel.getData().ProjectResouces;

							// var AllocatedFlag = false;
							// var PlannedFlag = false;

							var selectedNo = that.getView().byId("idTable1").getSelectedIndices().length;

							if (that.IconTabSelectedKey === "PR") {

								//ALLOCATED
								if (iLength.length > 0 && DeAllValFlag === true) {
									// AllocatedFlag = true;
									that.oOutputDialog.getModel("oSDialogModel").getData().listitems = [];

									for (i = 0; i < iLength.length; i++) {
										var oItems = [];
										oItems.push({
											Pernr: iLength[i].Pernr,
											StartDate: iLength[i].StartDate,
											EndDate: iLength[i].EndDate,
											PercentAlloc: iLength[i].PercentAlloc,
											Skill: "",
											L1Wbs: iLength[i].L1Wbs,
											ImRepMgr: iLength[i].ImRepMgr,
											Name: iLength[i].Name,
											Country: iLength[i].Country,
											CountryDesc: iLength[i].CountryDesc,
											State: iLength[i].State,
											StateDesc: "Y",
											L3Wbs: iLength[i].L3Wbs,
											L3WbsDesc: iLength[i].L3WbsDesc,
											OppId: "",
											Role: iLength[i].Role,
											RoleDesc: "",
											BillRateId: iLength[i].BillRateId,
											BufferFlag: "",
											PoNumber: "",
											PoStartDate: "",
											PoEndDate: "",
											PoValue: "0.000",
											PoCurrency: "",
											AllocStat: "",
											BaseLoc: "",
											IvPernr: iLength[i].Pernr,
											EvOutput: ""
										});
										var oHeader = {
											IvPernr: iLength[i].Pernr,
											HeaderItem: oItems
										};

										//Allocated
										// if (that.oDeAllocModel.getData().ProjectResouces.length !== 0 && DeAllValFlag === true && DeAllEndDateFlag === true) {
										if (that.oDeAllocModel.getData().ProjectResouces.length !== 0 && DeAllValFlag === true && DeAllEndDateFlag === true) {
											//Allocation Change
											var oViewModel = "/sap/opu/odata/sap/ZCREATE1_SRV/";
											var oCModel = new sap.ui.model.odata.ODataModel(oViewModel, {
												json: true,
												loadMetadataAsync: true
											});
											oCModel.create("/HeaderSet", oHeader, null, function (oData, oResponse) {
													debugger;
													sap.ui.core.BusyIndicator.hide();
													// var userid = "DEVELOPER";
													// that.oUser = sap.ushell.Container.getUser().getId();
													var oViewModel2 = "/sap/opu/odata/sap/ZGW_RESOURCEFINAL_SRV/";
													var oHModel = new sap.ui.model.odata.ODataModel(oViewModel2, {
														json: true,
														loadMetadataAsync: true
													});
													var L1 = iLength[i].L1Wbs;
													// var L1 = "10129-01";
													oHModel.read("/OutPutSet?$filter=IL1 eq '" + L1 + "' and IUser eq '" + that.oUser + "'", null, null, false,
														function (
															response) {
															debugger;

															// that.oSDialogModel.getData().listitems.push(opData);
															for (var j = 0; j < response.results.length; j++) {
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
														},
														function (error) {
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
															that.oMainModel.refresh();
															//jQuery.sap.log.getLogger().error("Data fetch failed" + error.toString());
															// that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
															// that.oMessageDialog.open();
														});
													that.oOutputDialog.setModel(new sap.ui.model.json.JSONModel(that.ResAll), "oSDialogModel");
													if (that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length !== 0 && iLengthDel.length === 0) {
														that.oOutputDialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
														that.busyDialog.close();
														if (selectedNo === that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length) {
															that.onDisplay();
														}
														that.oOutputDialog.open();
													}
													//Extra Added
													else {
														that.busyDialog.close();
													}
													// else {
													// 	that.oMessageDialog.getContent()[0].setText("No Results Found");
													// 	that.busyDialog.close();
													// 	that.oMessageDialog.open();
													// }
													// this.oOutputDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
													// this.busyDialog.close();
													// this.oOutputDialog.open();

													// if (this.oOutputDialog.getModel("oSDialogModel").getData().getData().listitems.length !== 0) {
													// 	this.oOutputDialog.setModel(new sap.ui.model.json.JSONModel(this.ResAll), "oSDialogModel");
													// 	this.oOutputDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
													// 	this.busyDialog.close();
													// 	this.oOutputDialog.open();

													// } else {
													// 	this.oMessageDialog.getContent()[0].setText("No Results Found");
													// 	this.busyDialog.close();
													// 	this.oMessageDialog.open();
													// }

												},
												function (oError) {
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
													that.oMainModel.refresh();

													// that.busyDialog.close();
													// that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
													// that.oMessageDialog.open();
												});
											//End of Change Allocation
										} else {
											that.busyDialog.close();
										}
									}
								}
								//PLANNED
								if (iLengthDel.length !== 0) {
									if (that.oDeleteModel.getData().ProjectResouces.length !== 0 && DelValFlag === true) {
										// PlannedFlag = true;
										that.oDeleteModel.refresh();
										var batchDelete = [];
										var arrDelete = {
											"results": []
										};
										var oSaveModelDelete = that.oDeleteModel;
										for (i = 0; i < oSaveModelDelete.getData().ProjectResouces.length; i++) {
											delete oSaveModelDelete.getData().ProjectResouces[i].__metadata;
											arrDelete.results.push({
												Pernr: oSaveModelDelete.getData().ProjectResouces[i].Pernr,
												StartDate: oSaveModelDelete.getData().ProjectResouces[i].StartDate,
												EndDate: oSaveModelDelete.getData().ProjectResouces[i].EndDate,
												L3Wbs: oSaveModelDelete.getData().ProjectResouces[i].L3Wbs,
												PercentAlloc: oSaveModelDelete.getData().ProjectResouces[i].PercentAlloc,
												L1Wbs: oSaveModelDelete.getData().ProjectResouces[i].L1Wbs
											});
										}
										debugger;
										that.oModelBatch.setHeaders({
											"Content-Type": "multipart/mixed;boundary=batch"
										});
										for (i = 0; i < arrDelete.results.length; i++) {
											batchDelete.push(that.oModelBatch.createBatchOperation("ALLOC_DELSet?$filter=Pernr%20eq%20'" + arrDelete.results[i].Pernr +
												"'%20and%20StartDate%20eq%20'" + arrDelete.results[i].StartDate + "'%20and%20EndDate%20eq%20'" + arrDelete.results[
													i].EndDate +
												"'%20and%20Wbs%20eq%20'" + arrDelete.results[i].L3Wbs + "'%20and%20Percentage%20eq%20" + arrDelete.results[i].PercentAlloc +
												"%20and%20L1Wbs%20eq%20'" + arrDelete.results[i].L1Wbs + "'",
												"GET"));
										}
										that.oModelBatch.addBatchReadOperations(batchDelete);
										that.oModelBatch.setUseBatch(true);
										that.oModelBatch.submitBatch(function (data, mResponse) {
											that.oModelBatch.refresh();
											debugger;
											var opData;
											for (var j = 0; j < data.__batchResponses.length; j++) {
												if (data.__batchResponses[j].data !== undefined) {
													opData = data.__batchResponses[j].data.results[0];
													that.ResAll.listitems.push(opData);
													that.countData++;
												} else {
													that.ResAll.listitems.push({
														OpPernr: that.oDeleteModel.getData().ProjectResouces[j].Pernr,
														OpStartDate: that.oDeleteModel.getData().ProjectResouces[j].StartDate,
														OpEndDate: that.oDeleteModel.getData().ProjectResouces[j].EndDate,
														OpPercentAlloc: that.oDeleteModel.getData().ProjectResouces[j].PercentAlloc,
														OpLocation: that.oDeleteModel.getData().ProjectResouces[j].L3WbsDesc,
														OpMessage: "No Records Found"
													});
													that.countData++;
												}
											}

										}, function (err) {
											debugger;
											that.ResAll.listitems.push({
												OpPernr: that.oDeleteModel.getData().ProjectResouces[that.countData].Pernr,
												OpStartDate: that.oDeleteModel.getData().ProjectResouces[that.countData].StartDate,
												OpEndDate: that.oDeleteModel.getData().ProjectResouces[that.countData].EndDate,
												OpPercentAlloc: that.oDeleteModel.getData().ProjectResouces[that.countData].PercentAlloc,
												OpLocation: that.oDeleteModel.getData().ProjectResouces[that.countData].L3WbsDesc,
												OpMessage: "Data Fetch Failed"
											});
											that.countData++;
											that.oMainModel.refresh();
										}, false);
										that.oOutputDialog.setModel(new sap.ui.model.json.JSONModel(that.ResAll), "oSDialogModel");
										if (that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length !== 0) {
											that.oOutputDialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
											that.busyDialog.close();
											if (selectedNo === that.oOutputDialog.getModel("oSDialogModel").getData().listitems.length) {
												that.onDisplay();
											}
											that.oOutputDialog.open();
										} else {
											that.oMessageDialog.getContent()[0].setText("No Records Found");
											that.busyDialog.close();
											that.oMessageDialog.open();
										}
									}
								}
							}
						}
						// else {
						// 	that.busyDialog.close();
						// 	that.oMessageDialog.getContent()[0].setText("Select At least one table entry for Send to Account Pool");
						// 	that.oMessageDialog.open();
						// }
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function (evt) {
						debugger;
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			if (that.getView().byId("idTable1").getSelectedIndices().length === 0) {
				that.oMessageDialog.getContent()[0].setText("Select At least one table entry for Sending it to Account Pool");
				that.oMessageDialog.open();

			} else {
				dialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
				dialog.addStyleClass("MsgDialogClass");
				dialog.getBeginButton().addStyleClass("MsgDialogBtnClass");
				dialog.getEndButton().addStyleClass("MsgDialogBtnClass");
				// that.getView().getDependents()[4].getBeginButton().addStyleClass("MsgDialogBtnClass");
				// that.getView().getDependents()[4].getEndButton().addStyleClass("MsgDialogBtnClass");
				dialog.open();
			}
		},

		onClose: function (oEvent) {
			debugger;
			this.oOutputDialog.close();
			// this.oOutputDialog.destroy();
			// this.oOutputDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.PUOutput", this);
			// this.getView().addDependent(this.oOutputDialog);

		},

		onDUClose: function (oEvent) {
			debugger;
			this.oDUOutputDialog.close();
		},

		onMsgDialogClose: function (oEvent) {
			debugger;
			this.oMessageDialog.close();
		},

		onWarnDialogYes: function (oEvent) {
			debugger;
			this.oWarningDialog.close();

		},

		onWarnDialogNo: function (oEvent) {
			debugger;
			this.oWarningDialog.close();
		},
		onReorgPUClose: function (oEvent) {
			debugger;

			this.getView().byId("idReorgPU").getContent()[0].mAggregations.contentLeft[0].setValue();
			this.getView().byId("idReorgPU").getContent()[1].getContent()[0].getBinding("items").filter([]);
			this.oReorgPUDialog.close();
			//.filter([])

			//this.getView().byId("idReorgPU")._sSearchFieldValue="";
			//this.getView().byId("idReorgPU").getContent()[0].mAggregations.contentLeft[0].mProperties.value="";
			// this.oOutputDialog.destroy();
			// this.oOutputDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.PUOutput", this);
			// this.getView().addDependent(this.oOutputDialog);

		},

		onValueChangePU: function (oEvent) {
			debugger;
			var that = this;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();
			/*	var sServiceUrl = "/sap/opu/odata/SAP/ZGW_RE_ORG_DEV_SRV/"
				var oModelNew = new sap.ui.model.odata.ODataModel(sServiceUrl, {
					json: false,
					loadMetadataAsync: true
				});*/
			var oModelNew = this.getOwnerComponent().getModel("oReorgModel");
			var grpPU;
			if (this.IconTabSelectedKey === "PR") {
				grpPU = this.getView().byId("idInpGPU").getName();
			}
			if (this.IconTabSelectedKey === "AB") {
				grpPU = this.getView().byId("idInpGPUAB").getName();
			}
			if (this.IconTabSelectedKey === "PUDU") {
				grpPU = this.getView().byId("idInpGPUAll").getName();
			}
			if (this.IconTabSelectedKey === "ResAlloc") {
				grpPU = this.getView().byId("idInpGPURA").getName();
			}

			oModelNew.read("RE_ORG_HeaderSet?$filter=ImGrpPu eq '" + grpPU + "'&$expand=IT_PRAC_UNITS_GPU",
				null, null, true,
				function (data, oResponse) {
					debugger;
					that.oMainModel.getData().RE_PU = data.results[0].IT_PRAC_UNITS_GPU.results;
					that.oMainModel.setData(that.oMainModel.getData());
					that.oMainModel.refresh();
					that.busyDialog.close();
				},
				function (oError) {
					debugger;
					that.busyDialog.close();
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});
			this.inputselected = oEvent.getSource();
			for (var i = 0; i < this.getView().byId("idTable4").getRows().length; i++) {
				this.getView().byId("idTable4").getRows()[i].getCells()[3].setName("");
				this.getView().byId("idTable4").getRows()[i].getCells()[3].setValue("");
				this.getView().byId("idTable4").getRows()[i].getCells()[3].setEditable(true);
				this.getView().byId("idTable4").getRows()[i].getCells()[4].setName("");
				this.getView().byId("idTable4").getRows()[i].getCells()[4].setValue("");
				this.getView().byId("idTable4").getRows()[i].getCells()[5].setName("");
				this.getView().byId("idTable4").getRows()[i].getCells()[5].setValue("");
				this.getView().byId("idTable4").getRows()[i].getCells()[5].setEditable(false);
				this.getView().byId("idTable4").getRows()[i].getCells()[6].setName("");
				this.getView().byId("idTable4").getRows()[i].getCells()[6].setValue("");
			}
			var oView = this.getView();
			this.oReorgPUDialog = oView.byId("idReorgPU");
			if (!this.oReorgPUDialog) {
				debugger;
				this.oReorgPUDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.ReorgPU", this);
				oView.addDependent(this.oReorgPUDialog);
				//	var that = this;

			}
			//this.getView().byId("idGPUDialog").getBinding("items").filter([]);
			this.oReorgPUDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			//	this.oPUDialog._sSearchFieldValue = "";
			this.oReorgPUDialog.open();
		},

		onValueChangeGPU: function (oEvent) {
			debugger;
			var that = this;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();
			/*	var sServiceUrl = "/sap/opu/odata/SAP/ZGW_RE_ORG_DEV_SRV/"
				var oModelNew = new sap.ui.model.odata.ODataModel(sServiceUrl, {
					json: false,
					loadMetadataAsync: true
				});*/
			var oModelNew = this.getOwnerComponent().getModel("oReorgModel");
			oModelNew.read("RE_ORG_HeaderSet?$filter=ImGrpPu eq ''&$expand=IT_GROUP_PU",
				null, null, true,
				function (data, oResponse) {
					debugger;
					that.oMainModel.getData().GPU = data.results[0].IT_GROUP_PU.results;
					that.oMainModel.setData(that.oMainModel.getData());
					that.oMainModel.refresh();
					that.busyDialog.close();
				},
				function (oError) {
					debugger;
					that.busyDialog.close();
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});
			this.inputselected = oEvent.getSource();
			for (var i = 0; i < this.getView().byId("idTable4").getRows().length; i++) {
				this.getView().byId("idTable4").getRows()[i].getCells()[3].setName("");
				this.getView().byId("idTable4").getRows()[i].getCells()[3].setValue("");
				this.getView().byId("idTable4").getRows()[i].getCells()[3].setEditable(true);
				this.getView().byId("idTable4").getRows()[i].getCells()[4].setName("");
				this.getView().byId("idTable4").getRows()[i].getCells()[4].setValue("");
				this.getView().byId("idTable4").getRows()[i].getCells()[5].setName("");
				this.getView().byId("idTable4").getRows()[i].getCells()[5].setValue("");
				this.getView().byId("idTable4").getRows()[i].getCells()[5].setEditable(false);
				this.getView().byId("idTable4").getRows()[i].getCells()[6].setName("");
				this.getView().byId("idTable4").getRows()[i].getCells()[6].setValue("");
			}
			var oView = this.getView();
			this.oGPUDialog = oView.byId("idGPUDialog");
			if (!this.oGPUDialog) {
				debugger;
				this.oGPUDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.ReorgGPU", this);
				oView.addDependent(this.oGPUDialog);

			}
			//	this.getView().byId("idGPUDialog").getBinding("items").filter([]);
			this.oGPUDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			this.oGPUDialog._sSearchFieldValue = "";
			this.oGPUDialog.open();
		},

		handleSearchGPU: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("GrpPu", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Zdesc", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		onPUPress: function (oEvent) {
			debugger;

			this.getView().byId("idReorgPU").getContent()[0].mAggregations.contentLeft[0].setValue();
			//
			//	this.getView().byId("idReorgPU")._sSearchFieldValue="";
			//this.getView().byId("idReorgPU").getContent()[0].mAggregations.contentLeft[0].mProperties.value="";
			// this.oOutputDialog.destroy();
			// this.oOutputDialog = sap.ui.xmlfragment("ZResourceRPM.fragments.PUOutput", this);
			// this.getView().addDependent(this.oOutputDialog);

			debugger;
			if (this.Central === true) {
				this.getView().byId("idInpDU").setEnabled(false);
				this.getView().byId("idInpDUAB").setEnabled(false);
				this.getView().byId("idInpDUAll").setEnabled(false);
				this.getView().byId("idInpDURA").setEnabled(false);
				this.getView().byId("idInpDUAD").setEnabled(false);
			}

			if (this.DuFlag === true || this.DuFlag === false) {
				this.getView().byId("idInpDU").setEnabled(false);
				this.getView().byId("idInpDUAB").setEnabled(false);
				this.getView().byId("idInpDUAll").setEnabled(false);
				this.getView().byId("idInpDURA").setEnabled(false);
				this.getView().byId("idInpDUAD").setEnabled(false);
			}

			//	var aContexts = oEvent.getParameter("selectedItems");
			var PUDesc = oEvent.mParameters.listItem.mAggregations.cells[0].mProperties.text;
			var PUTitle = oEvent.mParameters.listItem.mAggregations.cells[1].mProperties.text;
			var DUTitle = "";
			//			if (aContexts.length) {
			if (this.IconTabSelectedKey === "PR") {
				this.getView().byId("idInpPU").setValue(PUTitle);
				this.getView().byId("idInpPU").setName(PUDesc);
				//	this.getView().byId("idInpGPU").setValue("");
				//	this.getView().byId("idInpGPU").setName("");
				this.getView().byId("idInpCustomerGrp").setValue("");
				this.getView().byId("idInpCustomerGrp").setName("");
				this.getView().byId("idInpCustomerCode").setValue("");
				this.getView().byId("idInpCustomerCode").setName("");
				this.getView().byId("idInpProjectID").setValue("");
				this.getView().byId("idInpProjectID").setName("");
				this.getView().byId("idInpPSNo").setValue("");
				this.getView().byId("idInpPSNo").setName("");
				this.getView().byId("idInpGPU").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpPU").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpDU").setValueState(sap.ui.core.ValueState.None);
			} else if (this.IconTabSelectedKey === "AB") {
				//03.05.2019 GPU added in AP TAB.
				this.getView().byId("idInpPUAB").setValue(PUTitle);
				this.getView().byId("idInpPUAB").setName(PUDesc);
				//
				/*	this.getView().byId("idInpPUAB").setValue("");
					this.getView().byId("idInpPUAB").setName("");*/
				this.getView().byId("idInpCustomerGrpAB").setValue("");
				this.getView().byId("idInpCustomerGrpAB").setName("");
				this.getView().byId("idInpCustomerCodeAB").setValue("");
				this.getView().byId("idInpCustomerCodeAB").setName("");
				this.getView().byId("idInpProjectIDAB").setValue("");
				this.getView().byId("idInpProjectIDAB").setName("");
				this.getView().byId("idInpPSNoAB").setValue("");
				this.getView().byId("idInpPSNoAB").setName("");
				//03.05.2019 GPU added in AP TAB.
				this.getView().byId("idInpGPUAB").setValueState(sap.ui.core.ValueState.None);
				//
				this.getView().byId("idInpPUAB").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("idInpDUAB").setValueState(sap.ui.core.ValueState.None);
			} else if (this.IconTabSelectedKey === "PUDU") {
				this.getView().byId("idInpPUAll").setValue(PUTitle);
				this.getView().byId("idInpPUAll").setName(PUDesc);
				this.getView().byId("idInpPsNoAll").setValue("");
				this.getView().byId("idInpPsNoAll").setName("");
				var GPUTitle = this.getView().byId("idInpGPUAll").getName();
				var PUTitle_New = this.getView().byId("idInpPUAll").getName();
				this.oMainModel.getData().PsNo = [];
				var that = this;
				var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

				// PROJ_IDSet
				oModelNew.read(
					"PUDUBENCH_PSNO_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle_New + "' and IpGrpPu eq '" + GPUTitle + "'",
					null, null, true,
					function (data, oResponse) {
						debugger;
						that.oMainModel.getData().PsNo = data.results;
						that.oMainModel.setData(that.oMainModel.getData());
					},
					function (oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});
			} else if (this.IconTabSelectedKey === "ResAlloc") {
				this.getView().byId("idInpPURA").setValueState(sap.ui.core.ValueState.None);
				//03.05.2019 GPU added
				this.getView().byId("idInpGPURA").setValueState(sap.ui.core.ValueState.None);
				//
				this.getView().byId("idInpDURA").setValueState(sap.ui.core.ValueState.None);
				this.inputselected.setValue(PUTitle);
				this.inputselected.setName(PUDesc);
				this.getView().byId("idInpPURA").setValueState(sap.ui.core.ValueState.None);
				this.oMainModel.getData().ProjectID = [];
				var GPUTitle = this.getView().byId("idInpGPURA").getName();
				that = this;
				var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

				// PROJ_IDSet
				oModelNew.read(
					"PUDUBENCH_PROJID_F4Set?$filter=IpDu eq '' and IpPu eq '" + PUDesc + "' and IpGrpPu eq '" + GPUTitle + "'",
					null, null, true,
					function (data, oResponse) {
						debugger;
						that.oMainModel.getData().ProjectID = data.results;
						that.oMainModel.setData(that.oMainModel.getData());
					},
					function (oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});
			} else if (this.IconTabSelectedKey === "DetAlloc") {
				this.getView().byId("idInpPUAD").setValue(PUDesc);
				this.getView().byId("idInpDUAD").setName(PUTitle);
				this.getView().byId("idInpPsNoAD").setValue("");
				this.getView().byId("idInpPsNoAD").setName("");
				this.oMainModel.getData().PsNo = [];
				// var that = this;
				// this.oModel.read(
				// 	"PUDUBENCH_PSNO_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle + "'",
				// 	null, null, true,
				// 	function(data, oResponse) {
				// 		debugger;
				// 		that.oMainModel.getData().PsNo = data.results;
				// 		that.oMainModel.setData(that.oMainModel.getData());
				// 	},
				// 	function(oError) {
				// 		debugger;
				// 		that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
				// 		that.oMessageDialog.open();
				// 	});
			}
			//	}
			this.oReorgPUDialog.close();
			this.getView().byId("idReorgPU").getContent()[1].getContent()[0].getBinding("items").filter([]);

		},

		handleCloseGPU: function (oEvent) {
			debugger;
			if (this.Central === true) {
				this.getView().byId("idInpDU").setEnabled(false);
				this.getView().byId("idInpDUAB").setEnabled(false);
				this.getView().byId("idInpDUAll").setEnabled(false);
				this.getView().byId("idInpDURA").setEnabled(false);
				this.getView().byId("idInpDUAD").setEnabled(false);
			}

			if (this.DuFlag === true || this.DuFlag === false) {
				this.getView().byId("idInpDU").setEnabled(false);
				this.getView().byId("idInpDUAB").setEnabled(false);
				this.getView().byId("idInpDUAll").setEnabled(false);
				this.getView().byId("idInpDURA").setEnabled(false);
				this.getView().byId("idInpDUAD").setEnabled(false);
			}

			var aContexts = oEvent.getParameter("selectedItems");
			var GPUDesc = aContexts[0].getInfo();
			var GPUTitle = aContexts[0].getTitle();
			var DUTitle = "";
			if (aContexts.length) {
				if (this.IconTabSelectedKey === "PR") {
					this.getView().byId("idInpGPU").setValue(GPUDesc);
					this.getView().byId("idInpGPU").setName(GPUTitle);
					this.getView().byId("idInpPU").setValue("");
					this.getView().byId("idInpPU").setName("");
					this.getView().byId("idInpCustomerGrp").setValue("");
					this.getView().byId("idInpCustomerGrp").setName("");
					this.getView().byId("idInpCustomerCode").setValue("");
					this.getView().byId("idInpCustomerCode").setName("");
					this.getView().byId("idInpProjectID").setValue("");
					this.getView().byId("idInpProjectID").setName("");
					this.getView().byId("idInpPSNo").setValue("");
					this.getView().byId("idInpPSNo").setName("");
					this.getView().byId("idInpGPU").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpPU").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDU").setValueState(sap.ui.core.ValueState.None);
				} else if (this.IconTabSelectedKey === "AB") {
					//03.05.2019 GPU added in AP TAB.
					this.getView().byId("idInpGPUAB").setValue(GPUDesc);
					this.getView().byId("idInpGPUAB").setName(GPUTitle);
					//
					this.getView().byId("idInpPUAB").setValue("");
					this.getView().byId("idInpPUAB").setName("");
					this.getView().byId("idInpCustomerGrpAB").setValue("");
					this.getView().byId("idInpCustomerGrpAB").setName("");
					this.getView().byId("idInpCustomerCodeAB").setValue("");
					this.getView().byId("idInpCustomerCodeAB").setName("");
					this.getView().byId("idInpProjectIDAB").setValue("");
					this.getView().byId("idInpProjectIDAB").setName("");
					this.getView().byId("idInpPSNoAB").setValue("");
					this.getView().byId("idInpPSNoAB").setName("");
					//03.05.2019 GPU added in AP TAB.
					this.getView().byId("idInpGPUAB").setValueState(sap.ui.core.ValueState.None);
					//
					this.getView().byId("idInpPUAB").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDUAB").setValueState(sap.ui.core.ValueState.None);
				} else if (this.IconTabSelectedKey === "PUDU") {
					this.getView().byId("idInpGPUAll").setValue(GPUDesc);
					this.getView().byId("idInpGPUAll").setName(GPUTitle);
					this.getView().byId("idInpPUAll").setValue("");
					this.getView().byId("idInpPUAll").setName("");
					this.getView().byId("idInpPsNoAll").setValue("");
					this.getView().byId("idInpPsNoAll").setName("");
					var PUTitle = '';
					this.oMainModel.getData().PsNo = [];
					var that = this;
					/*var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read(
						"PUDUBENCH_PSNO_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" + GPUTitle + "'",
						null, null, true,
						function (data, oResponse) {
							debugger;
							that.oMainModel.getData().PsNo = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});*/
				} else if (this.IconTabSelectedKey === "ResAlloc") {
					this.getView().byId("idInpPURA").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDURA").setValueState(sap.ui.core.ValueState.None);
					this.inputselected.setValue(GPUDesc);
					this.inputselected.setName(GPUTitle);
					this.getView().byId("idInpPURA").setValue("");
					this.getView().byId("idInpPURA").setName("");
					var PUTitle = this.getView().byId("idInpPURA").getName();
					this.getView().byId("idInpGPURA").setValueState(sap.ui.core.ValueState.None);
					this.oMainModel.getData().ProjectID = [];
					that = this;
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read(
						"PUDUBENCH_PROJID_F4Set?$filter=IpDu eq '' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" + GPUTitle + "'",
						null, null, true,
						function (data, oResponse) {
							debugger;
							that.oMainModel.getData().ProjectID = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				} else if (this.IconTabSelectedKey === "DetAlloc") {
					this.getView().byId("idInpPUAD").setValue(PUDesc);
					this.getView().byId("idInpDUAD").setName(PUTitle);
					this.getView().byId("idInpPsNoAD").setValue("");
					this.getView().byId("idInpPsNoAD").setName("");
					this.oMainModel.getData().PsNo = [];
					// var that = this;
					// this.oModel.read(
					// 	"PUDUBENCH_PSNO_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle + "'",
					// 	null, null, true,
					// 	function(data, oResponse) {
					// 		debugger;
					// 		that.oMainModel.getData().PsNo = data.results;
					// 		that.oMainModel.setData(that.oMainModel.getData());
					// 	},
					// 	function(oError) {
					// 		debugger;
					// 		that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					// 		that.oMessageDialog.open();
					// 	});
				}
			}
		},

		onValueChangeDU: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();
			this.inputselected = oEvent.getSource();
			var oView = this.getView();
			this.oDUDialog = oView.byId("idDUDialog");
			if (!this.oDUDialog) {
				debugger;
				this.oDUDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DU", this);
				oView.addDependent(this.oDUDialog);
			}
			// if (this.Central === true) {
			// 	this.getView().byId("idInpPU").setEnabled(false);
			// 	this.getView().byId("idInpPUAB").setEnabled(false);
			// 	this.getView().byId("idInpPUAll").setEnabled(false);
			// 	this.getView().byId("idInpPURA").setEnabled(false);
			// }

			// if (this.DuFlag === true || this.DuFlag === false) {
			// 	this.getView().byId("idInpPU").setEnabled(false);
			// 	this.getView().byId("idInpPUAB").setEnabled(false);
			// 	this.getView().byId("idInpPUAll").setEnabled(false);
			// 	this.getView().byId("idInpPURA").setEnabled(false);
			// }
			this.getView().byId("idDUDialog").getBinding("items").filter([]);
			this.oDUDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			this.oDUDialog._sSearchFieldValue = "";
			this.oDUDialog.open();
		},

		handleSearchDU: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("Zzdu", sap.ui.model.FilterOperator.Contains, sValue)];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseDU: function (oEvent) {
			debugger;
			if (this.Central === true) {
				this.getView().byId("idInpPU").setEnabled(false);
				this.getView().byId("idInpPUAB").setEnabled(false);
				this.getView().byId("idInpPUAll").setEnabled(false);
				this.getView().byId("idInpPURA").setEnabled(false);
				this.getView().byId("idInpPUAD").setEnabled(false);

				//03.05.2019 GPU added.

				this.getView().byId("idInpGPU").setEnabled(false);
				this.getView().byId("idInpGPUAB").setEnabled(false);
				this.getView().byId("idInpGPUAll").setEnabled(false);
				this.getView().byId("idInpGPURA").setEnabled(false);
				//this.getView().byId("idInpGPUAD").setEnabled(false);

				//
			}

			if (this.DuFlag === true || this.DuFlag === false) {
				this.getView().byId("idInpPU").setEnabled(false);
				this.getView().byId("idInpPUAB").setEnabled(false);
				this.getView().byId("idInpPUAll").setEnabled(false);
				this.getView().byId("idInpPURA").setEnabled(false);
				this.getView().byId("idInpPUAD").setEnabled(false);

				//03.05.2019 GPU Added.
				this.getView().byId("idInpGPU").setEnabled(false);
				this.getView().byId("idInpGPUAB").setEnabled(false);
				this.getView().byId("idInpGPUAll").setEnabled(false);
				this.getView().byId("idInpGPURA").setEnabled(false);
				//	this.getView().byId("idInpGPUAD").setEnabled(false);
			}

			var aContexts = oEvent.getParameter("selectedItems");
			var DUTitle = aContexts[0].getTitle();
			var PUTitle = "";
			if (aContexts.length) {
				if (this.IconTabSelectedKey === "PR") {

					this.getView().byId("idInpPU").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDU").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDU").setValue(DUTitle);
					this.getView().byId("idInpDU").setName(DUTitle);
					//03.05.2019 GPU Added
					this.getView().byId("idInpGPU").setValueState(sap.ui.core.ValueState.None);
					//
				} else if (this.IconTabSelectedKey === "AB") {
					this.getView().byId("idInpPUAB").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDUAB").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDUAB").setValue(DUTitle);
					this.getView().byId("idInpDUAB").setName(DUTitle);
					//03.05.2019 GPU Added
					this.getView().byId("idInpGPUAB").setValueState(sap.ui.core.ValueState.None);
					//
				} else if (this.IconTabSelectedKey === "PUDU") {
					//03.05.2019 GPU Added
					this.getView().byId("idInpGPUAll").setValueState(sap.ui.core.ValueState.None);
					//
					this.getView().byId("idInpPUAll").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDUAll").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDUAll").setValue(DUTitle);
					this.getView().byId("idInpDUAll").setName(DUTitle);
					this.getView().byId("idInpPsNoAll").setValue("");
					this.getView().byId("idInpPsNoAll").setName("");
					var that = this;
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read(
						"PUDUBENCH_PROJID_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '' and IpGrpPu eq ''",
						null, null, true,
						function (data, oResponse) {
							debugger;
							that.oMainModel.getData().ProjectIDPUDUBench = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				} else if (this.IconTabSelectedKey === "ResAlloc") {
					//03.05.2019 GPU Added
					this.getView().byId("idInpGPURA").setValueState(sap.ui.core.ValueState.None);
					//
					this.getView().byId("idInpPURA").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDURA").setValueState(sap.ui.core.ValueState.None);
					this.inputselected.setValue(DUTitle);
					this.inputselected.setName(DUTitle);
					this.oMainModel.getData().ProjectID = [];
					that = this;
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read(
						"PUDUBENCH_PROJID_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '' ",
						null, null, true,
						function (data, oResponse) {
							debugger;
							for (var i = 0; i < that.oTableAllocDisplay3.getData().searchSet.length; i++) {
								that.oTableAllocDisplay3.getData().searchSet[i].L1WbsName = "";
								that.oTableAllocDisplay3.getData().searchSet[i].L1WbsValue = "";
								that.oTableAllocDisplay3.getData().searchSet[i].DUValue = "";
							}
							that.oTableAllocDisplay3.refresh();
							that.oMainModel.getData().ProjectID = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				} else if (this.IconTabSelectedKey === "DetAlloc") {
					//03.05.2019 GPU Added
					//this.getView().byId("idInpGPUAD").setValueState(sap.ui.core.ValueState.None);
					//
					this.getView().byId("idInpPUAD").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpDUAD").setValueState(sap.ui.core.ValueState.None);
					this.inputselected.setValue(DUTitle);
					this.inputselected.setName(DUTitle);
					this.oMainModel.getData().ProjectID = [];
					that = this;
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read(
						"PUDUBENCH_PROJID_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '' ",
						null, null, true,
						function (data, oResponse) {
							debugger;
							for (var i = 0; i < that.oTableAllocDisplay3.getData().searchSet.length; i++) {
								that.oTableAllocDisplay3.getData().searchSet[i].L1WbsName = "";
								that.oTableAllocDisplay3.getData().searchSet[i].L1WbsValue = "";
								that.oTableAllocDisplay3.getData().searchSet[i].DUValue = "";
							}
							that.oTableAllocDisplay3.refresh();
							that.oMainModel.getData().ProjectID = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
			}
		},

		onValueChangeDUDUPool: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			var that = this;
			this.oModel.read("RPM_MULTI_ACC_DU_F4Set", null, null, true,
				function (data, oResponse) {
					debugger;
					that.oMainModel.getData().DUDUPool = data.results;
					that.oMainModel.setData(that.oMainModel.getData());
				},
				function (oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});

			this.inputselected = oEvent.getSource();
			var oView = this.getView();
			this.DUDUPoolDialog = oView.byId("idDUDUPoolDialog");
			if (!this.DUDUPoolDialog) {
				debugger;
				this.DUDUPoolDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.DUDUPool", this);
				oView.addDependent(this.DUDUPoolDialog);
			}
			this.getView().byId("idDUDUPoolDialog").getBinding("items").filter([]);
			this.DUDUPoolDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.getView().byId("idDUDUPoolDialog").getBinding("items").filter([]);
			this.busyDialog.close();
			this.DUDUPoolDialog.open();
		},

		handleSearchDUDUPool: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("Du", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Descp", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseDUDUPool: function (oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var DUDUPoolDesc = aContexts[0].getInfo();
			var DUDUPoolTitle = aContexts[0].getTitle();
			this.getView().byId("idInpDUDUPool").setValue(DUDUPoolDesc);
			this.getView().byId("idInpDUDUPool").setName(DUDUPoolTitle);
			window.DUTitle = DUDUPoolTitle;
		},

		onValueChangeCustGrp: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			var oView = this.getView();
			this.oCustGrpDialog = oView.byId("idCustGrpDialog");
			if (!this.oCustGrpDialog) {
				debugger;
				this.oCustGrpDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.CustomerGroup", this);
				oView.addDependent(this.oCustGrpDialog);
			}
			this.getView().byId("idCustGrpDialog").getBinding("items").filter([]);
			this.oCustGrpDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			this.oCustGrpDialog._sSearchFieldValue = "";
			this.oCustGrpDialog.open();
		},

		handleSearchCustGrp: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("Zzaccid", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseCustGrp: function (oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var custGrpDesc = aContexts[0].getInfo();
			var custGrpTitle = aContexts[0].getTitle();
			if (aContexts.length) {
				if (this.IconTabSelectedKey === "PR") {
					this.getView().byId("idInpCustomerGrp").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpCustomerGrp").setValue(custGrpDesc);
					this.getView().byId("idInpCustomerGrp").setName(custGrpTitle);
					this.getView().byId("idInpCustomerCode").setValue("");
					this.getView().byId("idInpCustomerCode").setName("");
					this.getView().byId("idInpProjectID").setValue("");
					this.getView().byId("idInpProjectID").setName("");
					this.getView().byId("idInpPSNo").setValue("");
					this.getView().byId("idInpPSNo").setName("");
				} else if (this.IconTabSelectedKey === "AB") {
					this.getView().byId("idInpCustomerGrpAB").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpCustomerGrpAB").setValue(custGrpDesc);
					this.getView().byId("idInpCustomerGrpAB").setName(custGrpTitle);
					this.getView().byId("idInpCustomerCodeAB").setValue("");
					this.getView().byId("idInpCustomerCodeAB").setName("");
					this.getView().byId("idInpProjectIDAB").setValue("");
					this.getView().byId("idInpProjectIDAB").setName("");
					this.getView().byId("idInpPSNoAB").setValue("");
					this.getView().byId("idInpPSNoAB").setName("");
				}
			}

			var that = this;
			var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

			// PROJ_IDSet
			oModelNew.read("Customer_CodeSetSet?$filter=IpCustomerGroup eq '" + custGrpTitle + "'", null, null, true,
				function (data, oResponse) {
					debugger;
					that.oMainModel.getData().CustomerCode = data.results;
					that.oMainModel.setData(that.oMainModel.getData());
				},
				function (oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});
		},

		onValueChangeCustCode: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			if (this.IconTabSelectedKey === "PR") {
				if (this.getView().byId("idInpCustomerGrp").getName() === "") {
					this.getView().byId("idInpCustomerGrp").setValueState(sap.ui.core.ValueState.Error);
					this.oMessageDialog.getContent()[0].setText("Select Customer Group");
					this.oMessageDialog.open();
					// sap.m.MessageToast.show("Please Select Customer Group");
				} else if (this.getView().byId("idInpCustomerGrp").getName() !== "") {
					this.getView().byId("idInpCustomerGrp").setValueState(sap.ui.core.ValueState.None);
					var oView = this.getView();
					this.oCustCodeDialog = oView.byId("idCustCodeDialog");
					if (!this.oCustCodeDialog) {
						debugger;
						this.oCustCodeDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.CustomerCode", this);
						oView.addDependent(this.oCustCodeDialog);
					}
					this.getView().byId("idCustCodeDialog").getBinding("items").filter([]);
					this.oCustCodeDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					this.oCustCodeDialog._sSearchFieldValue = "";
					this.oCustCodeDialog.open();
				}
				this.busyDialog.close();
			} else if (this.IconTabSelectedKey === "AB") {
				if (this.getView().byId("idInpCustomerGrpAB").getName() === "") {
					this.getView().byId("idInpCustomerGrpAB").setValueState(sap.ui.core.ValueState.Error);
					this.oMessageDialog.getContent()[0].setText("Select Customer Group");
					this.oMessageDialog.open();
				} else if (this.getView().byId("idInpCustomerGrpAB").getName() !== "") {
					oView = this.getView();
					this.oCustCodeDialog = oView.byId("idCustCodeDialog");
					if (!this.oCustCodeDialog) {
						debugger;
						this.oCustCodeDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.CustomerCode", this);
						oView.addDependent(this.oCustCodeDialog);
					}
					this.getView().byId("idCustCodeDialog").getBinding("items").filter([]);
					this.oCustCodeDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					this.oCustCodeDialog._sSearchFieldValue = "";
					this.oCustCodeDialog.open();
				}
				this.busyDialog.close();
			} else if (this.IconTabSelectedKey === "ResAlloc") {
				var that = this;
				this.oModel.read("Customer_CodeSet?$filter=IpCustomerGroup eq '" + "" + "'", null, null, true,
					function (data, oResponse) {
						debugger;
						that.oMainModel.getData().CustomerCodeRA = data.results;
						that.oMainModel.setData(that.oMainModel.getData());
					},
					function (oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});

				oView = this.getView();
				this.oCustCodeRADialog = oView.byId("idCustCodeRADialog");
				if (!this.oCustCodeRADialog) {
					debugger;
					this.oCustCodeRADialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.CustomeCodeRA", this);
					oView.addDependent(this.oCustCodeRADialog);
				}
				this.getView().byId("idCustCodeRADialog").getBinding("items").filter([]);
				this.oCustCodeRADialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.busyDialog.close();
				this.oCustCodeRADialog._sSearchFieldValue = "";
				this.oCustCodeRADialog.open();
			}

		},

		handleSearchCustCode: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("Parnr", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseCustCode: function (oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var custCodeDesc = aContexts[0].getInfo();
			var custCodeTitle = aContexts[0].getTitle();
			if (aContexts.length) {
				if (this.IconTabSelectedKey === "PR") {
					this.getView().byId("idInpCustomerGrp").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpCustomerCode").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpCustomerCode").setValue(custCodeDesc);
					this.getView().byId("idInpCustomerCode").setName(custCodeTitle);
					this.getView().byId("idInpProjectID").setValue("");
					this.getView().byId("idInpProjectID").setName("");
					this.getView().byId("idInpPSNo").setValue("");
					this.getView().byId("idInpPSNo").setName("");
				} else if (this.IconTabSelectedKey === "AB") {
					this.getView().byId("idInpCustomerGrpAB").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpCustomerCodeAB").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpCustomerCodeAB").setValue(custCodeDesc);
					this.getView().byId("idInpCustomerCodeAB").setName(custCodeTitle);
					this.getView().byId("idInpProjectIDAB").setValue("");
					this.getView().byId("idInpProjectIDAB").setName("");
					this.getView().byId("idInpPSNoAB").setValue("");
					this.getView().byId("idInpPSNoAB").setName("");
				} else if (this.IconTabSelectedKey === "ResAlloc") {
					this.inputselected.getParent().getCells()[3].setValue("");
					this.inputselected.getParent().getCells()[3].setName("");
					this.inputselected.getParent().getCells()[3].setEditable(false);
					this.inputselected.getParent().getCells()[4].setValue(custCodeDesc);
					this.inputselected.getParent().getCells()[4].setName(custCodeDesc);
					// this.inputselected.setValue(custCodeDesc);
					this.inputselected.setValue(custCodeTitle);
					this.inputselected.setName(custCodeTitle);
					// this.getView().byId("idInpCustomerCode").setValue(custCodeDesc);
					// this.getView().byId("idInpCustomerCode").setName(custCodeTitle);
				}
			}
		},

		onValueChangePrjID: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			if (this.IconTabSelectedKey === "PR") {
				var custGrpTitle = this.getView().byId("idInpCustomerGrp").getName();
				var custCodeTitle = this.getView().byId("idInpCustomerCode").getName();
				var PUTitle = this.getView().byId("idInpPU").getName();
				var GPUTitle = this.getView().byId("idInpGPU").getName();
				var DUTitle = this.getView().byId("idInpDU").getName();
				if ((this.getView().byId("idInpGPU").getName() === "" && this.getView().byId("idInpPU").getName() === "") && this.getView().byId(
						"idInpDU").getName() === "") {
					this.getView().byId("idInpPU").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("idInpGPU").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("idInpDU").setValueState(sap.ui.core.ValueState.Error);
					this.oMessageDialog.getContent()[0].setText("Select GPU/Practice Unit/Delivery Unit");
					this.oMessageDialog.open();
				} else {
					var that = this;
					//oReorgModel
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read("PROJ_ID_F4Set?$filter=IpCustomerCode eq '" + custCodeTitle + "' and IpDu eq '" + DUTitle +
						"' and IpCustomerGroup eq '" + custGrpTitle + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" + GPUTitle + "'", null, null,
						true,
						function (data, oResponse) {
							debugger;
							that.oMainModel.getData().ProjectID = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
					var oView = this.getView();
					this.oPrjIDDialog = oView.byId("idPrjIDDialog");
					if (!this.oPrjIDDialog) {
						debugger;
						this.oPrjIDDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.ProjectID", this);
						oView.addDependent(this.oPrjIDDialog);
					}
					this.getView().byId("idPrjIDDialog").getBinding("items").filter([]);
					this.oPrjIDDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					this.oPrjIDDialog._sSearchFieldValue = "";
					this.oPrjIDDialog.open();
				}
				this.busyDialog.close();
			} else if (this.IconTabSelectedKey === "AB") {
				custGrpTitle = this.getView().byId("idInpCustomerGrpAB").getName();
				custCodeTitle = this.getView().byId("idInpCustomerCodeAB").getName();
				PUTitle = this.getView().byId("idInpPUAB").getName();
				DUTitle = this.getView().byId("idInpDUAB").getName();
				//03.05.2019 GPU Details added in AP TAB.
				GPUTitle = this.getView().byId("idInpGPUAB").getName();
				if (this.getView().byId("idInpGPUAB").getName() === "" && this.getView().byId("idInpPUAB").getName() === "" && this.getView().byId(
						"idInpDUAB").getName() === "") {
					this.getView().byId("idInpPUAB").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("idInpDUAB").setValueState(sap.ui.core.ValueState.Error);
					//03.05.2019 GPU Details added in AP TAB.
					this.getView().byId("idInpGPUAB").setValueState(sap.ui.core.ValueState.Error);
					this.oMessageDialog.getContent()[0].setText("Select Practice Unit/Delivery Unit");
					this.oMessageDialog.open();
				} else {
					that = this;
					//PROJ_IDSet
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read("PROJ_ID_F4Set?$filter=IpCustomerCode eq '" + custCodeTitle + "' and IpDu eq '" + DUTitle +
						"' and IpCustomerGroup eq '" + custGrpTitle + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" + GPUTitle + "'", null, null,
						true,
						function (data, oResponse) {
							debugger;
							that.oMainModel.getData().ProjectID = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});

					oView = this.getView();
					this.oPrjIDDialog = oView.byId("idPrjIDDialog");
					if (!this.oPrjIDDialog) {
						debugger;
						this.oPrjIDDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.ProjectID", this);
						oView.addDependent(this.oPrjIDDialog);
					}
					this.getView().byId("idPrjIDDialog").getBinding("items").filter([]);
					this.oPrjIDDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					this.oPrjIDDialog._sSearchFieldValue = "";
					this.oPrjIDDialog.open();
				}
				this.busyDialog.close();
			} else if (this.IconTabSelectedKey === "PUDU") {
				this.oViewModel.read("/ProjIDSet", null, null, false,
					function (response) {
						debugger;
						oView = this.getView();
						this.oPrjIDDialog = oView.byId("idPrjIDDialog");
						if (!this.oPrjIDDialog) {
							debugger;
							this.oPrjIDDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.ProjectID", this);
							oView.addDependent(this.oPrjIDDialog);
						}
						this.getView().byId("idPrjIDDialog").getBinding("items").filter([]);
						this.oPrjIDDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
						this.oPrjIDDialog._sSearchFieldValue = "";
						this.oPrjIDDialog.open();
					},
					function (error) {
						debugger;
						this.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						this.oMessageDialog.open();
					});
				this.busyDialog.close();
			} else if (this.IconTabSelectedKey === "ResAlloc") {
				if (this.getView().byId("idInpGPURA").getName() === "" && this.getView().byId("idInpPURA").getName() === "" && this.getView().byId(
						"idInpDURA").getName() === "") {
					this.getView().byId("idInpPURA").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("idInpGPURA").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("idInpDURA").setValueState(sap.ui.core.ValueState.Error);
					this.oMessageDialog.getContent()[0].setText("Select either Group PU/Practice Unit/Delivery Unit");
					this.oMessageDialog.open();
				} else {
					this.inputId = oEvent.getSource().getId();
					this.inputselected = oEvent.getSource();
					// oEvent.getSource().getParent().getCells()[4].setName("");
					// oEvent.getSource().getParent().getCells()[4].setValue("");
					// oEvent.getSource().getParent().getCells()[5].setName("");
					// oEvent.getSource().getParent().getCells()[5].setValue("");
					// oEvent.getSource().getParent().getCells()[9].setName("");
					// oEvent.getSource().getParent().getCells()[9].setValue("");
					oEvent.getSource().getParent().getCells()[6].setName("");
					oEvent.getSource().getParent().getCells()[6].setValue("");
					oEvent.getSource().getParent().getCells()[10].setName("");
					oEvent.getSource().getParent().getCells()[10].setValue("");
					oView = this.getView();
					this.oPrjIDDialog = oView.byId("idPrjIDDialog");
					if (!this.oPrjIDDialog) {
						debugger;
						this.oPrjIDDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.ProjectID", this);
						oView.addDependent(this.oPrjIDDialog);
					}
					this.oPrjIDDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
					this.getView().byId("idPrjIDDialog").getBinding("items").filter([]);
					this.oPrjIDDialog._sSearchFieldValue = "";
					this.oPrjIDDialog.open();
				}
				this.busyDialog.close();
			}
		},

		handleSearchPrjID: function (oEvent) {
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
		searchReorgPU: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.mParameters.newValue;
			var filters = [new Filter("Pu", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("GrpPu", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Zdesc", sap.ui.model.FilterOperator.Contains, sValue)

			];
			oFilter = new sap.ui.model.Filter(filters, false);
			//	var oBinding = oEvent.getSource().getBinding("items");
			var oBinding = this.getView().byId("idReorgPU").getContent()[1].getContent()[0].getBinding("items");
			oBinding.filter([oFilter]);
		},

		// onValueChangeCustCodeRA: function(oEvent) {
		// 	debugger;
		// 	this.inputId = oEvent.getSource().getId();
		// 	this.inputselected = oEvent.getSource();
		// 	var oView = this.getView();
		// 	this.oPrjIDDialog = oView.byId("idPrjIDDialog");
		// 	if (!this.oPrjIDDialog) {
		// 		debugger;
		// 		this.oPrjIDDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.CustomeCodeRA", this);
		// 		oView.addDependent(this.oPrjIDDialog);
		// 	}
		// 	this.oPrjIDDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		// 	this.getView().byId("idPrjIDDialog").getBinding("items").filter([]);
		// 	this.oPrjIDDialog.open();
		// },

		onValueChangePURA: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			var oView = this.getView();
			this.oPURADialog = oView.byId("idPURADialog");
			if (!this.oPURADialog) {
				debugger;
				this.oPURADialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.PURA", this);
				oView.addDependent(this.oPURADialog);
			}
			this.getView().byId("idPURADialog").getBinding("items").filter([]);
			this.oPURADialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			this.oPURADialog._sSearchFieldValue = "";
			this.oPURADialog.open();
		},

		handleClosePURA: function (oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var PUDesc = aContexts[0].getInfo();
			var PUTitle = aContexts[0].getTitle();
			this.inputselected.setValue(PUTitle);
			this.inputselected.setName(PUTitle);
		},

		onValueChangeRole: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			this.inputselected = oEvent.getSource();
			var oViewModel = "/sap/opu/odata/SAP/ZGW_BEU_SRV/";
			var oBEUModel = new sap.ui.model.odata.ODataModel(oViewModel, {
				json: true,
				loadMetadataAsync: true
			});
			var that = this;
			oBEUModel.read("ROLE_F4Set", null, null, true,
				function (data, oResponse) {
					debugger;
					that.oMainModel.getData().Role = data.results;
					that.oMainModel.setData(that.oMainModel.getData());
				},
				function (oError) {
					debugger;
					that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
					that.oMessageDialog.open();
				});
			var oView = this.getView();
			this.oRoleDialog = oView.byId("idRoleDialog");
			if (!this.oRoleDialog) {
				debugger;
				this.oRoleDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.Role", this);
				oView.addDependent(this.oRoleDialog);
			}
			this.getView().byId("idRoleDialog").getBinding("items").filter([]);
			this.oRoleDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.busyDialog.close();
			this.oRoleDialog._sSearchFieldValue = "";
			this.oRoleDialog.open();
		},

		handleSearchRole: function (oEvent) {
			debugger;
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("RoleDesc", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("RoleCode", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleCloseRole: function (oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var RoleDesc = aContexts[0].getInfo();
			var RoleTitle = aContexts[0].getTitle();
			this.inputselected.setValue(RoleTitle);
			this.inputselected.setName(RoleDesc);
		},

		onValueChangeReportingMgr: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			if (oEvent.getSource().getParent().getCells()[3].getValue() === "") {
				this.oMessageDialog.getContent()[0].setText("Select Project ID");
				this.oMessageDialog.open();
				oEvent.getSource().getParent().getCells()[9].setValue("");
			} else {
				// var oViewModel = "/sap/opu/odata/sap/ZGW_RESOURCEFINAL_SRV/";
				// var oModel = new sap.ui.model.odata.ODataModel(oViewModel, {
				// 	json: true,
				// 	loadMetadataAsync: true
				// });
				this.inputselected = oEvent.getSource();
				var L1 = oEvent.getSource().getParent().getCells()[3].getName();

				var that = this;
				this.oViewModel.read("/ReportSet?$filter=IvPosid eq '" + L1 + "'", null, null, true,
					function (data, oResponse) {
						debugger;
						that.oMainModel.getData().ReportMgr = data.results;
						that.oMainModel.setData(that.oMainModel.getData());
					},
					function (oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});
				var oView = this.getView();
				this.oReportMgrDialog = oView.byId("idReportingMgrDialog");
				if (!this.oReportMgrDialog) {
					debugger;
					this.oReportMgrDialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.ReportingManager", this);
					oView.addDependent(this.oReportMgrDialog);
				}
				this.getView().byId("idReportingMgrDialog").getBinding("items").filter([]);
				this.oReportMgrDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.oReportMgrDialog._sSearchFieldValue = "";
				this.oReportMgrDialog.open();
			}
			this.busyDialog.close();
		},

		handleSearchReportMgr: function (oEvent) {
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

		handleCloseReportMgr: function (oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var ReportMgrDesc = aContexts[0].getInfo();
			var ReportMgrTitle = aContexts[0].getTitle();
			this.inputselected.setValue(ReportMgrDesc);
			this.inputselected.setName(ReportMgrTitle);
		},

		handleClosePrjID: function (oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var prjIDDesc = aContexts[0].getInfo();
			var prjIDTitle = aContexts[0].getTitle();
			var b = prjIDTitle + " " + prjIDDesc;
			if (aContexts.length) {
				if (this.IconTabSelectedKey === "PR") {
					this.getView().byId("idInpProjectID").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpProjectID").setValue(prjIDDesc);
					this.getView().byId("idInpProjectID").setName(prjIDTitle);
					this.getView().byId("idInpPSNo").setValue("");
					this.getView().byId("idInpPSNo").setName("");
				} else if (this.IconTabSelectedKey === "AB") {
					this.getView().byId("idInpProjectIDAB").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("idInpProjectIDAB").setValue(prjIDDesc);
					this.getView().byId("idInpProjectIDAB").setName(prjIDTitle);
					this.getView().byId("idInpPSNoAB").setValue("");
					this.getView().byId("idInpPSNoAB").setName("");
				} else if (this.IconTabSelectedKey === "ResAlloc") {
					this.inputselected.setValue(b);
					this.inputselected.setName(prjIDTitle);
					this.inputselected.getParent().getCells()[5].setValue("");
					this.inputselected.getParent().getCells()[5].setName("");
					this.inputselected.getParent().getCells()[5].setEditable(false);
					if (this.inputselected.getParent().getCells()[3].getValue() === "") {
						this.oMessageDialog.getContent()[0].setText("Select Project ID");
						this.oMessageDialog.open();
						// oEvent.getSource().getParent().getCells()[5].setValue("");
						oEvent.getSource().getParent().getCells()[6].setValue("");
					} else {
						// var prjIDTitle = oEvent.getSource().getParent().getCells()[3].getName();
						var path = oEvent.getParameters().selectedContexts[0].sPath.slice(11);
						var CustomerName = this.oMainModel.getData().ProjectID[path].CustName;
						this.inputselected.getParent().getCells()[4].setValue(CustomerName);
						this.inputselected.getParent().getCells()[4].setName(CustomerName);
						var that = this;
						this.oModel.read("RPM_PU_RA_F4Set?$filter=IpProjId eq '" + prjIDTitle + "'", null, null, true,
							function (data, oResponse) {
								debugger;
								// that.oMainModel.getData().PURA = data.results;
								// that.oMainModel.setData(that.oMainModel.getData());
								if (data.results.length === 0) {
									that.inputselected.getParent().getCells()[6].setEditable(false);
									that.inputselected.getParent().getCells()[6].setValue("");
									that.inputselected.getParent().getCells()[6].setName("");
								} else if (data.results.length === 1) {
									that.inputselected.getParent().getCells()[6].setEditable(false);
									that.inputselected.getParent().getCells()[6].setValue(data.results[0].Pu);
									that.inputselected.getParent().getCells()[6].setName(data.results[0].Pu);
								} else {
									that.inputselected.getParent().getCells()[6].setEditable(true);
									that.oMainModel.getData().PURA = data.results;
									that.oMainModel.setData(that.oMainModel.getData());
								}
								// if (data.results.length === 0) {
								// 	that.inputselected.getParent().getCells()[5].setEditable(false);
								// 	that.inputselected.getParent().getCells()[5].setValue("");
								// 	that.inputselected.getParent().getCells()[5].setName("");
								// } else if (data.results.length === 1) {
								// 	that.inputselected.getParent().getCells()[5].setEditable(false);
								// 	that.inputselected.getParent().getCells()[5].setValue(data.results[0].Pu);
								// 	that.inputselected.getParent().getCells()[5].setName(data.results[0].Pu);
								// } else {
								// 	that.inputselected.getParent().getCells()[5].setEditable(true);
								// 	that.oMainModel.getData().PURA = data.results;
								// 	that.oMainModel.setData(that.oMainModel.getData());
								// }
							},
							function (oError) {
								debugger;
								that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
								that.oMessageDialog.open();
							});
					}
				}
			}
		},

		onValueChangePSNo: function (oEvent) {
			debugger;
			if (!this.busyDialog) {
				var busyDialog = new sap.m.BusyDialog();
				customIconRotationSpeed: 100;
				this.busyDialog = busyDialog;
			}
			this.busyDialog.open();

			// oEvent.oSource._lastValue = "";

			if (this.IconTabSelectedKey === "PR") {
				var prjIDTitle = this.getView().byId("idInpProjectID").getName();
				var that = this;
				//RPM PSNo Set
				this.oModel.read("RPM_PS_NO_F4Set?$filter=IpProjId eq '" + prjIDTitle + "'", null, null, true,
					function (data, oResponse) {
						debugger;
						that.oMainModel.getData().PsNo = data.results;
						that.oMainModel.setData(that.oMainModel.getData());
					},
					function (oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});

				var oView = this.getView();
				this.oPSNODialog = oView.byId("idPSNODialog");
				if (!this.oPSNODialog) {
					debugger;
					this.oPSNODialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.PSNO", this);
					oView.addDependent(this.oPSNODialog);
				}
				this.getView().byId("idPSNODialog").getBinding("items").filter([]);
				this.oPSNODialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.busyDialog.close();
				this.oPSNODialog._sSearchFieldValue = "";
				this.oPSNODialog.open();
			} else if (this.IconTabSelectedKey === "AB") {
				prjIDTitle = this.getView().byId("idInpProjectID").getName();
				that = this;
				//RPM PSNo Set
				this.oModel.read("RPM_PS_NO_F4Set?$filter=IpProjId eq '" + prjIDTitle + "'", null, null, true,
					function (data, oResponse) {
						debugger;
						that.oMainModel.getData().PsNo = data.results;
						that.oMainModel.setData(that.oMainModel.getData());
					},
					function (oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});

				oView = this.getView();
				this.oPSNODialog = oView.byId("idPSNODialog");
				if (!this.oPSNODialog) {
					debugger;
					this.oPSNODialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.PSNO", this);
					oView.addDependent(this.oPSNODialog);
				}
				this.getView().byId("idPSNODialog").getBinding("items").filter([]);
				this.oPSNODialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.busyDialog.close();
				this.oPSNODialog._sSearchFieldValue = "";
				this.oPSNODialog.open();
			} else if (this.IconTabSelectedKey === "PUDU") {
				oView = this.getView();
				this.oPSNODialog = oView.byId("idPSNODialog");
				if (!this.oPSNODialog) {
					debugger;
					this.oPSNODialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.PSNO", this);
					oView.addDependent(this.oPSNODialog);
				}
				this.getView().byId("idPSNODialog").getBinding("items").filter([]);
				this.oPSNODialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.busyDialog.close();
				this.oPSNODialog._sSearchFieldValue = "";
				this.oPSNODialog.open();
			}
			//Changes by 10639214
			else if (this.IconTabSelectedKey === "DetAlloc") {
				var PUTitle = this.getView().byId("idInpPUAD").getName();
				var DUTitle = this.getView().byId("idInpDUAD").getName();
				if (PUTitle === "" && DUTitle === "") {
					prjIDTitle = "";
					that = this;
					//RPM PSNo Set
					this.oModel.read("RPM_PS_NO_F4Set?$filter=IpProjId eq '" + prjIDTitle + "'", null, null, true,
						function (data, oResponse) {
							debugger;
							that.oMainModel.getData().PsNo = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				} else {
					this.getView().byId("idInpPsNoAD").setValue("");
					this.getView().byId("idInpPsNoAD").setName("");
					this.oMainModel.getData().PsNo = [];
					var GPUTitle = '';
					that = this;
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");

					// PROJ_IDSet
					oModelNew.read(
						"PUDUBENCH_PSNO_F4Set?$filter=IpDu eq '" + DUTitle + "' and IpPu eq '" + PUTitle + "' and IpGrpPu eq '" + GPUTitle + "'",
						null, null, true,
						function (data, oResponse) {
							debugger;
							that.oMainModel.getData().PsNo = data.results;
							that.oMainModel.setData(that.oMainModel.getData());
						},
						function (oError) {
							debugger;
							that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
							that.oMessageDialog.open();
						});
				}
				oView = this.getView();
				this.oPSNODialog = oView.byId("idPSNODialog");
				if (!this.oPSNODialog) {
					debugger;
					this.oPSNODialog = sap.ui.xmlfragment(oView.getId(), "ZResourceRPM.fragments.PSNO", this);
					oView.addDependent(this.oPSNODialog);
				}
				this.getView().byId("idPSNODialog").getBinding("items").filter([]);
				this.oPSNODialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.busyDialog.close();
				this.oPSNODialog._sSearchFieldValue = "";
				this.oPSNODialog.open();
			}
			//End of Changes
		},

		handleSearchPSNO: function (oEvent) {
			debugger;
			// this.searchPsNo = oEvent.getSource()._searchField;
			// oEvent.getSource()._searchField.setValue("");
			var oFilter = [];
			var sValue = oEvent.getParameter("value");
			var filters = [new Filter("Pernr", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)
			];
			oFilter = new sap.ui.model.Filter(filters, false);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClosePSNO: function (oEvent) {
			debugger;
			var aContexts = oEvent.getParameter("selectedItems");
			var psnoTitle = aContexts[0].getTitle();
			if (aContexts.length) {
				if (this.IconTabSelectedKey === "PR") {
					this.getView().byId("idInpPSNo").setValue(psnoTitle);
					this.getView().byId("idInpPSNo").setName(psnoTitle);
				} else if (this.IconTabSelectedKey === "AB") {
					this.getView().byId("idInpPSNoAB").setValue(psnoTitle);
					this.getView().byId("idInpPSNoAB").setName(psnoTitle);
				} else if (this.IconTabSelectedKey === "PUDU") {
					this.getView().byId("idInpPsNoAll").setValue(psnoTitle);
					this.getView().byId("idInpPsNoAll").setName(psnoTitle);
				} else if (this.IconTabSelectedKey === "DetAlloc") {
					this.getView().byId("idInpPsNoAD").setValue(psnoTitle);
					this.getView().byId("idInpPsNoAD").setName(psnoTitle);
				}
			}
			this.getView().byId("idPSNODialog").getBinding("items").filter([]);
			// oEvent.getSource()._searchField.setValue("");
		},

		clearAllFiltersSortings: function (oEvent) {
			debugger;
			if (this.IconTabSelectedKey === "PR") {
				var table = this.getView().byId("idTable1");
				for (var i = 0; i < this.oMainModel.getData().ProjectResouces.length; i++) {
					this.oMainModel.getData().ProjectResouces[i].Enabled = false;
					this.oMainModel.getData().ProjectResouces[i].bSelected = false;
				}
				var len = table.getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
			} else if (this.IconTabSelectedKey === "AB") {
				table = this.getView().byId("idTable2");
				for (i = 0; i < this.oMainModel.getData().AccountBench.length; i++) {
					this.oMainModel.getData().AccountBench[i].Enabled = false;
					this.oMainModel.getData().AccountBench[i].bSelected = false;
				}
				len = table.getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
			} else if (this.IconTabSelectedKey === "PUDU") {
				table = this.getView().byId("idTable3");
			} else if (this.IconTabSelectedKey === "DUPool") {
				table = this.getView().byId("idTable5");
				for (i = 0; i < this.oMainModel.getData().DUDUPoolDisplay.length; i++) {
					this.oMainModel.getData().DUDUPoolDisplay[i].Enabled = false;
					this.oMainModel.getData().DUDUPoolDisplay[i].bSelected = false;
				}
				len = table.getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
			} else if (this.IconTabSelectedKey === "DetAlloc") {
				table = this.getView().byId("idTable6");
			}
			var iColCounter = 0;
			// table.clearSelection();
			var iTotalCols = table.getColumns().length;
			var oListBinding = table.getBinding();
			if (oListBinding) {
				oListBinding.aSorters = null;
				oListBinding.aFilters = null;
			}
			this.oMainModel.refresh(true);
			for (iColCounter = 0; iColCounter < iTotalCols; iColCounter++) {
				table.getColumns()[iColCounter].setSorted(false);
				table.getColumns()[iColCounter].setFilterValue("");
				table.getColumns()[iColCounter].setFiltered(false);
			}
		},

		onTableSelection: function (oEvent) {
			debugger;
			//To Be Done
			var a = oEvent.getSource().getId() + "-rows-row0";
			// var a = oEvent.getSource().sId + "-rows-row0";
			this.DateValVar = this.getView().byId(a);

			// var a = oEvent.getParameters().rowIndex;
			// this.DateValVar = oEvent.getSource().getRows()[a].getCells();

			if (this.IconTabSelectedKey === "PR") {

				if (oEvent.getParameters().rowContext !== null) {
					if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
						oEvent.getParameters().rowContext.getObject().bSelected = true;
					} else {
						oEvent.getParameters().rowContext.getObject().bSelected = false;
					}

					var path = oEvent.getParameters().rowContext.sPath.slice(17);
					// var path = oEvent.getParameters().rowIndex;
					var data = this.oMainModel.getData().ProjectResouces[path];

					var sDate = this.CurrentDate;
					var year = sDate.getFullYear().toString();
					var month = (sDate.getMonth() + 1).toString();
					if (month.length === 1) {
						month = "0" + month;
					}
					var day = (sDate.getDate()).toString();
					if (day.length === 1) {
						day = "0" + day;
					}
					var strDate = year + month + day;

					var yy = strDate.slice(0, 4);
					var mm = strDate.slice(4, 6);
					var dd = strDate.slice(6, 8);
					var strDate2 = yy + "-" + mm + "-" + dd;
					strDate2 = new Date(strDate2);

					var yy1 = data.StartDate.slice(0, 4);
					var mm1 = data.StartDate.slice(4, 6);
					var dd1 = data.StartDate.slice(6, 8);
					var modelStDate = yy1 + "-" + mm1 + "-" + dd1;
					modelStDate = new Date(modelStDate);

					var yy2 = data.EndDate.slice(0, 4);
					var mm2 = data.EndDate.slice(4, 6);
					var dd2 = data.EndDate.slice(6, 8);
					var modelEdDate = yy2 + "-" + mm2 + "-" + dd2;
					modelEdDate = new Date(modelEdDate);

					//Allocated
					if (modelStDate <= strDate2) {
						if (oEvent.getParameters().rowContext.getObject().bSelected) {
							this.oDeAllocModel.getData().ProjectResouces[this.count1] = data;
							oEvent.getParameters().rowContext.sPath.slice(17);

							if (data.EndDate === "99991231") {
								this.oMainModel.getData().ProjectResouces[path].Enabled = true;
								this.oMainModel.getData().ProjectResouces[path].OriginalEndDate = data.EndDate;
								this.oMainModel.getData().ProjectResouces[path].EndDate = strDate;
							} else if (modelEdDate < strDate2) {
								this.oMainModel.getData().ProjectResouces[path].Enabled = false;
								this.oMainModel.getData().ProjectResouces[path].OriginalEndDate = data.EndDate;
								this.oMainModel.getData().ProjectResouces[path].EndDate = data.EndDate;
							} else {
								this.oMainModel.getData().ProjectResouces[path].Enabled = true;
								this.oMainModel.getData().ProjectResouces[path].OriginalEndDate = data.EndDate;
								this.oMainModel.getData().ProjectResouces[path].EndDate = data.EndDate;
							}
							// this.oMainModel.getData().ProjectResouces[path].EndDate = strDate;
							this.oMainModel.refresh();
							this.count1++;
						} else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
							this.oMainModel.getData().ProjectResouces[path].EndDate = this.oMainModel.getData().ProjectResouces[path].OriginalEndDate;
							this.oMainModel.getData().ProjectResouces[path].Enabled = false;
							this.DateValVar.getCells()[11].setValueState(sap.ui.core.ValueState.None);
							// this.DateValVar[11].setValueState(sap.ui.core.ValueState.None);
							this.oMainModel.refresh();
							var DeAllocLen = this.oDeAllocModel.getData().ProjectResouces;
							var MainLen = this.oMainModel.getData().ProjectResouces;
							for (var i = 0; i < DeAllocLen.length; i++) {
								if ((DeAllocLen[i].Pernr === MainLen[path].Pernr) &&
									(DeAllocLen[i].StartDate === MainLen[path].StartDate)) {
									this.oDeAllocModel.getData().ProjectResouces.splice(i, 1);
									this.oDeAllocModel.refresh();
									this.count1--;
									i--;
									break;
								}
							}
						}

						// this.oSentToPUModel.getData().ProjectResouces[this.count3] = data;
						// this.count3++;

						if (oEvent.getParameters().rowContext.getObject().bSelected) {
							this.oSentToPUModel.getData().ProjectResouces[this.count3] = data;
							this.count3++;
						} else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
							var SendLen = this.oSentToPUModel.getData().ProjectResouces;
							MainLen = this.oMainModel.getData().ProjectResouces;
							for (i = 0; i < SendLen.length; i++) {
								if ((SendLen[i].Pernr === MainLen[path].Pernr) &&
									(SendLen[i].StartDate === MainLen[path].StartDate)) {
									this.oSentToPUModel.getData().ProjectResouces.splice(i, 1);
									this.oSentToPUModel.refresh();
									this.count3--;
									i--;
									break;
								}
							}
						}
					}

					//Planned
					else {
						if (oEvent.getParameters().rowContext.getObject().bSelected) {
							this.oDeleteModel.getData().ProjectResouces[this.count2] = data;
							this.oMainModel.getData().ProjectResouces[path].Enabled = false;
							this.oMainModel.refresh();
							this.count2++;
							this.oSentToPUModel.getData().ProjectResouces[this.count3] = data;
							this.count3++;
						} else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
							var DelcLen = this.oDeleteModel.getData().ProjectResouces;
							MainLen = this.oMainModel.getData().ProjectResouces;
							for (i = 0; i < DelcLen.length; i++) {
								if ((DelcLen[i].Pernr === MainLen[path].Pernr) &&
									(DelcLen[i].StartDate === MainLen[path].StartDate)) {
									this.oDeleteModel.getData().ProjectResouces.splice(i, 1);
									this.oDeleteModel.refresh();
									this.count2--;
									i--;
									break;
								}
							}
							SendLen = this.oSentToPUModel.getData().ProjectResouces;
							MainLen = this.oMainModel.getData().ProjectResouces;
							for (i = 0; i < SendLen.length; i++) {
								if ((SendLen[i].Pernr === MainLen[path].Pernr) &&
									(SendLen[i].StartDate === MainLen[path].StartDate)) {
									this.oSentToPUModel.getData().ProjectResouces.splice(i, 1);
									this.oSentToPUModel.refresh();
									this.count3--;
									i--;
									break;
								}
							}
						}

					}
					this.oDeAllocModel.refresh();
					this.oDeleteModel.refresh();
				} else if (oEvent.getParameters().rowContext === null) {
					this.onDisplay();
					// for (i = 0; i < this.oMainModel.getData().ProjectResouces.length; i++) {
					// 	this.oMainModel.getData().ProjectResouces[i].bSelected = false;
					// }
					// this.oMainModel.refresh();
				}

			} else if (this.IconTabSelectedKey === "AB") {

				if (oEvent.getParameters().rowContext !== null) {
					if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
						oEvent.getParameters().rowContext.getObject().bSelected = true;
					} else {
						oEvent.getParameters().rowContext.getObject().bSelected = false;
					}
					path = oEvent.getParameters().rowContext.sPath.slice(14);
					data = this.oMainModel.getData().AccountBench[path];
					sDate = this.CurrentDate;
					year = sDate.getFullYear().toString();
					month = (sDate.getMonth() + 1).toString();
					if (month.length === 1) {
						month = "0" + month;
					}
					day = (sDate.getDate()).toString();
					if (day.length === 1) {
						day = "0" + day;
					}
					strDate = year + month + day;
					yy = strDate.slice(0, 4);
					mm = strDate.slice(4, 6);
					dd = strDate.slice(6, 8);
					strDate2 = yy + "-" + mm + "-" + dd;
					strDate2 = new Date(strDate2);

					yy1 = data.StartDate.slice(0, 4);
					mm1 = data.StartDate.slice(4, 6);
					dd1 = data.StartDate.slice(6, 8);
					modelStDate = yy1 + "-" + mm1 + "-" + dd1;
					modelStDate = new Date(modelStDate);

					yy2 = data.EndDate.slice(0, 4);
					mm2 = data.EndDate.slice(4, 6);
					dd2 = data.EndDate.slice(6, 8);
					modelEdDate = yy2 + "-" + mm2 + "-" + dd2;
					modelEdDate = new Date(modelEdDate);

					//Allocated
					if (modelStDate <= strDate2) {
						if (oEvent.getParameters().rowContext.getObject().bSelected) {
							this.oDeAllocModel.getData().ProjectResouces[this.count1] = data;

							if (modelEdDate < strDate2) {
								this.oMainModel.getData().AccountBench[path].Enabled = false;
								this.oMainModel.getData().AccountBench[path].OriginalEndDate = data.EndDate;
								this.oMainModel.getData().AccountBench[path].EndDate = data.EndDate;
							} else {
								this.oMainModel.getData().AccountBench[path].Enabled = true;
								this.oMainModel.getData().AccountBench[path].OriginalEndDate = data.EndDate;
								this.oMainModel.getData().AccountBench[path].EndDate = strDate;
							}
							// if (data.EndDate === "99991231") {
							// this.oMainModel.getData().AccountBench[path].EndDate = strDate;
							// } 

							// else {
							// 	this.oMainModel.getData().AccountBench[path].EndDate = data.EndDate;
							// }
							// this.oMainModel.getData().AccountBench[path].EndDate = strDate;
							this.oMainModel.refresh();
							this.count1++;
						} else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
							this.oMainModel.getData().AccountBench[path].Enabled = false;
							this.DateValVar.getCells()[11].setValueState(sap.ui.core.ValueState.None);
							// this.DateValVar[11].setValueState(sap.ui.core.ValueState.None);
							this.oMainModel.getData().AccountBench[path].EndDate = this.oMainModel.getData().AccountBench[path].OriginalEndDate;
							this.oMainModel.refresh();
							DeAllocLen = this.oDeAllocModel.getData().ProjectResouces;
							MainLen = this.oMainModel.getData().AccountBench;
							for (i = 0; i < this.oDeAllocModel.getData().ProjectResouces.length; i++) {
								if ((DeAllocLen[i].Pernr === MainLen[path].Pernr) &&
									(DeAllocLen[i].StartDate === MainLen[path].StartDate)
								) {
									this.oDeAllocModel.getData().ProjectResouces.splice(i, 1);
									this.oDeAllocModel.refresh();
									this.count1--;
									i--;
									break;
								}
							}
						}
						if (oEvent.getParameters().rowContext.getObject().bSelected) {
							this.oAccountBenchModel.getData().ProjectResouces[this.count3] = data;
							this.count3++;
						} else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
							var AccLen = this.oAccountBenchModel.getData().ProjectResouces;
							MainLen = this.oMainModel.getData().AccountBench;
							for (i = 0; i < AccLen.length; i++) {
								if ((AccLen[i].Pernr === MainLen[path].Pernr) &&
									(AccLen[i].StartDate === MainLen[path].StartDate)) {
									this.oAccountBenchModel.getData().ProjectResouces.splice(i, 1);
									this.oAccountBenchModel.refresh();
									this.count3--;
									i--;
									break;
								}
							}
						}
					}

					//Planned
					else {
						if (oEvent.getParameters().rowContext.getObject().bSelected) {
							this.oDeleteModel.getData().ProjectResouces[this.count2] = data;
							this.oMainModel.getData().AccountBench[path].Enabled = false;
							this.oMainModel.refresh();
							this.count2++;
							this.oAccountBenchModel.getData().ProjectResouces[this.count3] = data;
							this.count3++;
						} else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
							var DelLen = this.oDeleteModel.getData().ProjectResouces;
							MainLen = this.oMainModel.getData().AccountBench;
							for (i = 0; i < DelLen.length; i++) {
								if ((DelLen[i].Pernr === MainLen[path].Pernr) &&
									(DelLen[i].StartDate === MainLen[path].StartDate)) {
									this.oDeleteModel.getData().ProjectResouces.splice(i, 1);
									this.oDeleteModel.refresh();
									this.count2--;
									i--;
									break;
								}
							}
							AccLen = this.oAccountBenchModel.getData().ProjectResouces;
							MainLen = this.oMainModel.getData().AccountBench;
							for (i = 0; i < AccLen.length; i++) {
								if ((AccLen[i].Pernr === MainLen[path].Pernr) &&
									(AccLen[i].StartDate === MainLen[path].StartDate)) {
									this.oAccountBenchModel.getData().ProjectResouces.splice(i, 1);
									this.oAccountBenchModel.refresh();
									this.count3--;
									i--;
									break;
								}
							}
						}

					}
					this.oDeAllocModel.refresh();
					this.oDeleteModel.refresh();
				} else if (oEvent.getParameters().rowContext === null) {
					this.onDisplay();
				}

			} else if (this.IconTabSelectedKey === "DUPool") {

				if (oEvent.getParameters().rowContext !== null) {
					if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
						oEvent.getParameters().rowContext.getObject().bSelected = true;
					} else {
						oEvent.getParameters().rowContext.getObject().bSelected = false;
					}
					path = oEvent.getParameters().rowContext.sPath.slice(17);
					data = this.oMainModel.getData().DUDUPoolDisplay[path];

					sDate = this.CurrentDate;
					year = sDate.getFullYear().toString();
					month = (sDate.getMonth() + 1).toString();
					if (month.length === 1) {
						month = "0" + month;
					}
					day = (sDate.getDate()).toString();
					if (day.length === 1) {
						day = "0" + day;
					}
					strDate = year + month + day;
					yy = strDate.slice(0, 4);
					mm = strDate.slice(4, 6);
					dd = strDate.slice(6, 8);
					strDate2 = yy + "-" + mm + "-" + dd;
					strDate2 = new Date(strDate2);

					yy1 = data.StartDate.slice(0, 4);
					mm1 = data.StartDate.slice(4, 6);
					dd1 = data.StartDate.slice(6, 8);
					modelStDate = yy1 + "-" + mm1 + "-" + dd1;
					modelStDate = new Date(modelStDate);

					yy2 = data.EndDate.slice(0, 4);
					mm2 = data.EndDate.slice(4, 6);
					dd2 = data.EndDate.slice(6, 8);
					modelEdDate = yy2 + "-" + mm2 + "-" + dd2;
					modelEdDate = new Date(modelEdDate);

					//Allocated
					if (modelStDate <= strDate2) {
						if (oEvent.getParameters().rowContext.getObject().bSelected) {
							// this.oDeAllocModel.getData().ProjectResouces[this.count1] = data;

							if (data.EndDate === "99991231") {
								this.oMainModel.getData().DUDUPoolDisplay[path].Enabled = true;
								this.oMainModel.getData().DUDUPoolDisplay[path].OriginalEndDate = data.EndDate;
								this.oMainModel.getData().DUDUPoolDisplay[path].EndDate = strDate;
							} else if (modelEdDate < strDate2) {
								this.oMainModel.getData().DUDUPoolDisplay[path].Enabled = false;
								this.oMainModel.getData().DUDUPoolDisplay[path].OriginalEndDate = data.EndDate;
								this.oMainModel.getData().DUDUPoolDisplay[path].EndDate = data.EndDate;
							} else {
								this.oMainModel.getData().DUDUPoolDisplay[path].Enabled = true;
								this.oMainModel.getData().DUDUPoolDisplay[path].OriginalEndDate = data.EndDate;
								this.oMainModel.getData().DUDUPoolDisplay[path].EndDate = data.EndDate;
							}
							// this.oMainModel.getData().DUDUPoolDisplay[path].EndDate = strDate;
							this.oMainModel.refresh();
							this.oMASendToPracticeModel.getData().MASendToPractice[this.count4] = data;
							this.count4++;
							this.oMASendToPracticeModel.refresh();
							// this.count1++;
						} else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
							this.DateValVar.getCells()[7].setValueState(sap.ui.core.ValueState.None);
							// this.DateValVar[7].setValueState(sap.ui.core.ValueState.None);
							this.oMainModel.getData().DUDUPoolDisplay[path].Enabled = false;
							this.oMainModel.getData().DUDUPoolDisplay[path].EndDate = this.oMainModel.getData().DUDUPoolDisplay[path].OriginalEndDate;
							this.oMainModel.refresh();

							SendLen = this.oMASendToPracticeModel.getData().MASendToPractice;
							MainLen = this.oMainModel.getData().DUDUPoolDisplay;
							for (i = 0; i < SendLen.length; i++) {
								if ((SendLen[i].Pernr === MainLen[path].Pernr) &&
									(SendLen[i].StartDate === MainLen[path].StartDate)) {
									this.oMASendToPracticeModel.getData().MASendToPractice.splice(i, 1);
									this.oMASendToPracticeModel.refresh();
									this.count4--;
									i--;
									break;
								}
							}
							this.oMASendToPracticeModel.refresh();

							// DeAllocLen = this.oDeAllocModel.getData().ProjectResouces;
							// MainLen = this.oMainModel.getData().DUDUPoolDisplay;
							// for (i = 0; i < this.oDeAllocModel.getData().ProjectResouces.length; i++) {
							// 	if ((DeAllocLen[i].Pernr === MainLen[path].Pernr) &&
							// 		(DeAllocLen[i].StartDate === MainLen[path].StartDate)
							// 	) {
							// 		this.oDeAllocModel.getData().ProjectResouces.splice(i, 1);
							// 		this.oDeAllocModel.refresh();
							// 		this.count1--;
							// 		i--;
							// 		break;
							// 	}
							// }
						}

						// if (oEvent.getParameters().rowContext.getObject().bSelected) {
						// 	this.oMASendToPracticeModel.getData().MASendToPractice[this.count4] = data;
						// 	this.count4++;
						// } else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
						// 	SendLen = this.oMASendToPracticeModel.getData().MASendToPractice;
						// 	MainLen = this.oMainModel.getData().DUDUPoolDisplay;
						// 	for (i = 0; i < SendLen.length; i++) {
						// 		if ((SendLen[i].Pernr === MainLen[path].Pernr) &&
						// 			(SendLen[i].StartDate === MainLen[path].StartDate)) {
						// 			this.oMASendToPracticeModel.getData().MASendToPractice.splice(i, 1);
						// 			this.oMASendToPracticeModel.refresh();
						// 			this.count4--;
						// 			i--;
						// 			break;
						// 		}
						// 	}
						// }
					}

					//Planned
					else {
						if (oEvent.getParameters().rowContext.getObject().bSelected) {
							// this.oDeleteModel.getData().ProjectResouces[this.count2] = data;

							this.oMainModel.getData().DUDUPoolDisplay[path].Enabled = false;
							this.oMainModel.refresh();
							// this.count2++;
							this.oMASendToPracticeModel.getData().MASendToPractice[this.count4] = data;
							this.count4++;
						} else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
							SendLen = this.oMASendToPracticeModel.getData().MASendToPractice;
							MainLen = this.oMainModel.getData().DUDUPoolDisplay;
							for (i = 0; i < SendLen.length; i++) {
								if ((SendLen[i].Pernr === MainLen[path].Pernr) &&
									(SendLen[i].StartDate === MainLen[path].StartDate)) {
									this.oMASendToPracticeModel.getData().MASendToPractice.splice(i, 1);
									this.oMASendToPracticeModel.refresh();
									this.count4--;
									i--;
									break;
								}
							}
						}

					}
					this.oDeAllocModel.refresh();
					this.oDeleteModel.refresh();

					// if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
					// 	oEvent.getParameters().rowContext.getObject().bSelected = true;
					// } else {
					// 	oEvent.getParameters().rowContext.getObject().bSelected = false;
					// }

					// path = oEvent.getParameters().rowContext.sPath.slice(17);
					// data = this.oMainModel.getData().DUDUPoolDisplay[path];

					// if (oEvent.getParameters().rowContext.getObject().bSelected) {
					// 	this.oMASendToPracticeModel.getData().MASendToPractice[this.count4] = data;
					// 	this.count4++;
					// 	this.oMASendToPracticeModel.refresh();

					// } else if (oEvent.getParameters().rowContext.getObject().bSelected === false) {
					// 	SendLen = this.oMASendToPracticeModel.getData().MASendToPractice;
					// 	MainLen = this.oMainModel.getData().DUDUPoolDisplay;
					// 	for (i = 0; i < SendLen.length; i++) {
					// 		if ((SendLen[i].Pernr === MainLen[path].Pernr) &&
					// 			(SendLen[i].StartDate === MainLen[path].StartDate)) {
					// 			this.oMASendToPracticeModel.getData().MASendToPractice.splice(i, 1);
					// 			this.oMASendToPracticeModel.refresh();
					// 			this.count4--;
					// 			i--;
					// 			break;
					// 		}
					// 	}
					// }
				} else if (oEvent.getParameters().rowContext === null) {
					this.onDisplay();
				}

			}
		},

		handleChangeEndDate: function (oEvent) {
			debugger;
			// this.DateValVar = oEvent.getSource().getParent();
			// this.DateValVar = oEvent.getSource();
			if (this.IconTabSelectedKey === "PR" || this.IconTabSelectedKey === "AB") {
				var val = oEvent.getParameters().value;
				if (val !== "") {
					var regex = new RegExp(/(0[1-9]|[12]\d|3[01]).(0[1-9]|1[0-2]).([1-9]\d{3})/);
					if ((!regex.test(val)) || val.length !== 10) {
						this.oMessageDialog.getContent()[0].setText("Provide dd.MM.yyyy date format");
						this.oMessageDialog.open();
						oEvent.getSource().getParent().getCells()[11].setValueState(sap.ui.core.ValueState.Error);
						oEvent.getSource().getParent().getCells()[11].setValue("");

					} else {
						oEvent.getSource().getParent().getCells()[11].setValueState(sap.ui.core.ValueState.None);
					}
				}
				oEvent.getSource().getParent().getCells()[11].setEnabled(true);
			}

			if (this.IconTabSelectedKey === "DUPool") {
				val = oEvent.getParameters().value;
				if (val !== "") {
					regex = new RegExp(/(0[1-9]|[12]\d|3[01]).(0[1-9]|1[0-2]).([1-9]\d{3})/);
					if ((!regex.test(val)) || val.length !== 10) {
						this.oMessageDialog.getContent()[0].setText("Provide dd.MM.yyyy date format");
						this.oMessageDialog.open();
						oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.Error);
						oEvent.getSource().getParent().getCells()[7].setValue("");

					} else {
						oEvent.getSource().getParent().getCells()[7].setValueState(sap.ui.core.ValueState.None);
					}
				}
				oEvent.getSource().getParent().getCells()[7].setEnabled(true);
			}

			// if (this.IconTabSelectedKey === "PR") {
			// 	oEvent.getSource().getParent().getCells()[11].setEnabled(true);
			// } else if (this.IconTabSelectedKey === "AB") {
			// 	oEvent.getSource().getParent().getCells()[11].setEnabled(true);
			// }
		},

		handleChangeEndDateRA: function (oEvent) {
			debugger;
			var val = oEvent.getParameters().value;
			oEvent.getSource().getParent().getCells()[5].setEnabled(true);
			if (val !== "") {
				var regex = new RegExp(/(0[1-9]|[12]\d|3[01]).(0[1-9]|1[0-2]).([1-9]\d{3})/);
				// var regex = new RegExp(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/);
				if ((!regex.test(val)) || val.length !== 10) {
					this.oMessageDialog.getContent()[0].setText("Provide dd.MM.yyyy date format");
					this.oMessageDialog.open();
					oEvent.getSource().getParent().getCells()[5].setValue("");
				}
			}
		},

		handleValueHelp: function (oEvent) {
			debugger;
			this.inputId = oEvent.getSource().getId();
			this.inputselected = oEvent.getSource();
		},

		handleValidationError: function (oEvent) {
			oEvent.getSource().getParent().getCells()[0].setValueStateText("Numeric Values Only");
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
		},

		handleValidationSuccess: function (oEvent) {
			oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
		},

		onPernrSubmit: function (oEvent) {
			debugger;
			// this.PsNumber = "10660337";
			if (oEvent.getSource().getParent().getCells()[0].getValue() === "") {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			}
			this.PsNumber = oEvent.getSource().getParent().getCells()[0].getValue();
			var cell = oEvent.getSource().getParent().getCells()[1];
			var cell2 = oEvent.getSource().getParent().getCells()[2];
			var cell9 = oEvent.getSource().getParent().getCells()[9];
			var cell10 = oEvent.getSource().getParent().getCells()[10];
			if (oEvent.getSource().getParent().getCells()[0].getValueState() !== "Error" && oEvent.getSource().getParent().getCells()[0].getValue()
				.length > 1) {
				var that = this;
				this.oModel.read("PSNO_DetailsSet(IPsNumber='" + this.PsNumber + "')", null, null, true,

					//
					function (data, oResponse) {
						debugger;
						cell.setText(data.EvName);
						cell2.setText(data.EvBaselocDesc);
						that.oTableAllocDisplay3.refresh();
						var thi1 = that;
						var oModelNew = that.getOwnerComponent().getModel("oReorgModel");
						oModelNew.read("RESOURCE_CHECKSet(LsPernr='" + that.PsNumber + "')", null, null, true,
							function (odata, oResponse) {
								debugger;

								if (odata.LsOutput === "FAIL" || odata.LsOutput === "fail") {
									cell9.setEnabled(false);
									cell9.setValue("99991231");
									cell10.setEditable(false);

								} else {
									//	
									cell10.setEditable(true);
									/*	cell9.setEnabled(false);
										cell9.setValue("99991231");*/
									cell9.setEnabled(true);
									cell9.setValue();
									//	cell9.setValue(thi1.convertDate(new Date()));
								}
							},
							function (oError) {
								debugger;
								that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
								that.oMessageDialog.open();
							});
						//var oModelNew = this.getOwnerComponent().getModel("oReorgModel");
					},
					function (oError) {
						debugger;
						that.oMessageDialog.getContent()[0].setText("Data Fetch Failed");
						that.oMessageDialog.open();
					});
			} else if (oEvent.getSource().getParent().getCells()[0].getValueState() !== "None" && oEvent.getSource().getParent().getCells()[0]
				.getValue()
				.length > 1) {
				oEvent.getSource().getParent().getCells()[0].setValue("");
				this.oTableAllocDisplay3.refresh();
			}
		},

		onAddRes: function (oEvent) {
			debugger;
			var iLength = this.oTableAllocDisplay3.getData().searchSet;
			this.rowCount = [];
			for (var i = 0; i < iLength.length; i++) {
				// if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].StartDate === "") {
				// 	this.rowCount.push(i + 1);
				// }
				if (iLength[i].Pernr === "" || iLength[i].StartDate === "") {
					this.rowCount.push(i + 1);
				}
			}

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
				// var modDate5Days = new Date(newDate - (5 * 86400000)).setHours(0, 0, 0, 0);
				// minDate = new Date(modDate5Days);

				// var minDateTemp = "2018-07-01";
				// var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
				// minDate = new Date(minDate);

				var minDateTemp = this.getOwnerComponent().BackDateDash;
				var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
				minDate = new Date(minDate);
			}

			if (this.count === -1) {
				this.oTableAllocDisplay3.getData().searchSet.push({
					Enabled: "false",
					Pernr: "",
					StartDate: "",
					//Commented on 18.04.2018
					// CurrentDate: this.CurrentDate,
					CurrentDate: minDate,
					CustCode: "",
					CustCodeDesc: "",
					CustCodeEditable: true,
					PrjIDEditable: true,
					PUName: "",
					PUValue: "",
					EndDate: "99991231",
					PercentAlloc: "",
					Skill: "",
					L1WbsValue: "", //Project ID
					L1WbsName: "", //Project Name
					ImRepMgr: "",
					Name: "",
					Country: "",
					CountryDesc: "",
					State: "",
					StateDesc: "",
					L3WbsValue: "", // Location ID
					L3WbsDescName: "", //Location Name
					OppId: "",
					RoleValue: "",
					RoleName: "",
					RoleDesc: "",
					BillRateValue: "", // Bill Rate ID
					BillRateName: "",
					BufferFlag: "",
					PoNumber: "",
					PoStartDate: "",
					PoEndDate: "",
					PoValue: "",
					PoCurrency: "",
					AllocStat: "",
					BaseLoc: ""
				});
				this.oTableAllocDisplay3.updateBindings(true);
				this.count++;
			} else {
				if (this.oTableAllocDisplay3.getData().searchSet[this.count].Pernr === "") {
					this.oMessageDialog.getContent()[0].setText("Enter PS Number");
					this.oMessageDialog.open();
				}
				// else if (this.oTableAllocDisplay3.getData().searchSet[this.count].L1WbsName === "") {
				// 	this.oMessageDialog.getContent()[0].setText("Select Project ID");
				// 	this.oMessageDialog.open();
				// }
				else if (this.oTableAllocDisplay3.getData().searchSet[this.count].StartDate === "") {
					this.oMessageDialog.getContent()[0].setText("Select Start Date");
					this.oMessageDialog.open();
				} else {
					if (this.oUser === "98765432") {
						minDateTemp = "2018-01-01";
						minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
						minDate = new Date(minDate);
					} else if (this.oUser === "10642988") {
						var minDateTemp = "2018-01-01";
						var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
						minDate = new Date(minDate);
					} else {
						// var newDate = new Date();
						// var modDate5Days = new Date(newDate - (5 * 86400000)).setHours(0, 0, 0, 0);
						// minDate = new Date(modDate5Days);

						// minDateTemp = "2018-07-01";
						// minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
						// minDate = new Date(minDate);

						var minDateTemp = this.getOwnerComponent().BackDateDash;
						var minDate = new Date(minDateTemp).setHours(0, 0, 0, 0);
						minDate = new Date(minDate);
					}

					if (this.rowCount.length === 0) {
						this.FirstSubmit = true;
						this.oTableAllocDisplay3.getData().searchSet.push({
							Enabled: "false",
							Pernr: "",
							StartDate: "",
							//Commented on 18.04.2018
							// CurrentDate: this.CurrentDate,
							CurrentDate: minDate,
							CustCode: "",
							CustCodeDesc: "",
							CustCodeEditable: true,
							PrjIDEditable: true,
							PUName: "",
							PUValue: "",
							EndDate: "99991231",
							PercentAlloc: "",
							Skill: "",
							L1WbsValue: "", //Project ID
							L1WbsName: "", //Project Name
							ImRepMgr: "",
							Name: "",
							Country: "",
							CountryDesc: "",
							State: "",
							StateDesc: "",
							L3WbsValue: "", // Location ID
							L3WbsDescName: "", //Location Name
							OppId: "",
							RoleValue: "",
							RoleName: "",
							RoleDesc: "",
							BillRateValue: "", // Bill Rate ID
							BillRateName: "",
							BufferFlag: "",
							PoNumber: "",
							PoStartDate: "",
							PoEndDate: "",
							PoValue: "",
							PoCurrency: "",
							AllocStat: "",
							BaseLoc: ""
						});
						this.oTableAllocDisplay3.updateBindings(true);
						this.count++;
					} else {
						this.FirstSubmit = false;
						this.oMessageDialog.getContent()[0].setText("Fill in all Details in row no. " + this.rowCount + " of table");
						this.oMessageDialog.open();
					}
				}
			}
		},

		onDeleteRow: function (oEvent) {
			debugger;
			this.count--;
			//To be done
			var index = oEvent.getSource().getParent().getIndex();
			// var index = oEvent.getSource().getParent().oBindingContexts.oTableAllocDisplay3.sPath.substring(11);
			this.oTableAllocDisplay3.getData().searchSet.splice(index, 1);
			this.oTableAllocDisplay3.refresh();
		},
		//not to use this
		submitAllocationnouse: function (evt) {
			debugger;
			var that = this;
			that.countData = 0;
			var createData = {
				"EpFlag": "",
				"EpOutput": "",
				"ET_RETURN": [],
				"WA_FINAL": []

			};
			that.rowCount = [];
			var iLength = that.oTableAllocDisplay3.getData().searchSet;
			for (var i = 0; i < iLength.length; i++) {
				// if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].StartDate === "") {
				// 	that.rowCount.push(i + 1);
				// }
				if (iLength[i].Pernr === "" || iLength[i].StartDate === "") {
					that.rowCount.push(i + 1);
				}
			}
			for (i = 0; i < iLength.length; i++) {
				// if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].StartDate === "") {
				// 	that.FirstSubmit = false;
				// 	break;
				// } else {
				// 	that.FirstSubmit = true;
				// }
				if (iLength[i].Pernr === "" || iLength[i].StartDate === "") {
					that.FirstSubmit = false;
					break;
				} else {
					that.FirstSubmit = true;
				}
			}
			if (that.rowCount.length === 0 && that.FirstSubmit === true) {
				//	var iLength = that.oTableAllocDisplay3.getData().searchSet;
				for (var i = 0; i < iLength.length; i++) {
					var Pernr = iLength[i].Pernr;
					var ProjectID = iLength[i].L1WbsName;
					if (ProjectID === undefined) {
						ProjectID = "";
					} else {
						ProjectID = iLength[i].L1WbsName;
					}

					var PU = iLength[i].PUName;
					if (PU === undefined) {
						PU = "";
					} else {
						PU = iLength[i].PUName;
					}

					var Location = "";
					var Skills = "";

					var CustCode = iLength[i].CustCode;
					if (CustCode === undefined) {
						CustCode = "";
					} else {
						CustCode = iLength[i].CustCode;
					}

					var percent = iLength[i].PercentAlloc;
					if (percent === undefined || percent === "") {
						percent = "100";
					} else {
						percent = iLength[i].PercentAlloc;
					}

					var ReportMgr = iLength[i].ReportingManager;
					if (ReportMgr === undefined) {
						ReportMgr = "";
					} else {
						ReportMgr = iLength[i].ReportingManager;
					}
					var Role = iLength[i].Role;
					if (Role === undefined) {
						Role = "";
					} else {
						Role = iLength[i].Role;
					}
					var sDate = iLength[i].StartDate;

					var year = sDate.getFullYear().toString();
					var month = (sDate.getMonth() + 1).toString();
					if (month.length === 1) {
						month = "0" + month;
					}
					var day = (sDate.getDate()).toString();
					if (day.length === 1) {
						day = "0" + day;
					}
					var strDate = year + month + day;
					var endDate = iLength[i].EndDate;

					createData.WA_FINAL.push({
						"PsNumber": Pernr,
						"StartDate": strDate,
						"EndDate": endDate,
						"ProjectId": ProjectID,
						"Percentage": percent,
						"Role": Role,
						"Irm": ReportMgr,
						"Pu": PU,
						"CustomerCode": CustCode

					});

				}
				var myHeaders = {
					"X-Requested-With": "XMLHttpRequest",
					"Content-Type": "application/json",
					"DataServiceVersion": "2.0",
					"X-CSRF-Token": "Fetch",
					"Accept": "application/atom+xml,application/xml,application/atomsvc+xml"
				};
				var that = this;
				var oModelNew = that.getOwnerComponent().getModel("oReorgModel");
				oModelNew.create("/RPM_RA_HDRSet", createData, null, function (oData, response) {
						debugger;
						//	if (oData.response === undefined || oData.response === "") {
						var oRoleID = {
							listitems: []
						};
						that.ResAll = {
							listitems: []
						};
						/*for (var i = 0; i < response.results.length; i++) {
							oRoleID.listitems.push({
								OpPernr: response.results[i].OpPernr,
								OpStartDate: response.results[i].OpStartDate,
								OpEndDate: response.results[i].OpEndDate,
								OpPercentAlloc: response.results[i].OpPercentAlloc,
								OpLocation: response.results[i].OpLocation,
								OpMessage: response.results[i].OpMessage,
								OpFlag: response.results[i].OpFlag
							});
						}*/
						var len = that.oTableAllocDisplay3.getData().searchSet.length;
						for (that.countData = 0; that.countData < len; that.countData++) {
							var sD = that.oTableAllocDisplay3.getData().searchSet[that.countData].StartDate;
							year = sD.getFullYear().toString();
							month = (sD.getMonth() + 1).toString();
							if (month.length === 1) {
								month = "0" + month;
							}
							day = (sD.getDate()).toString();
							if (day.length === 1) {
								day = "0" + day;
							}
							strDate = year + month + day;

							var Enddate = that.oTableAllocDisplay3.getData().searchSet[that.countData].EndDate;

							that.ResAll.listitems.push({
								OpPernr: that.oTableAllocDisplay3.getData().searchSet[that.countData].Pernr,
								OpStartDate: strDate,
								OpEndDate: Enddate,
								OpPercentAlloc: that.oTableAllocDisplay3.getData().searchSet[that.countData].Percentage,
								OpLocation: that.oTableAllocDisplay3.getData().searchSet[that.countData].Location,
								OpMessage: oData.EpOutput,
								OpFlag: oData.EpFlag
							});
						}

						that.countData++;
						that.oMainModel.refresh();
						/*var iTable = that.getView().byId("tblRIW12").getModel("oTableAllocDisplay3").oData.searchSet;
						var iOutputTable = oRoleID.listitems;
						for (var i = 0; i < iTable.length; i++) {
							for (var j = 0; j < iOutputTable.length; j++) {
								if (iTable[i].Pernr === iOutputTable[j].OpPernr) {
									if (iOutputTable[j].OpFlag === "S") {
										that.getView().getModel("oTableAllocDisplay3").getData().searchSet.splice(i, 1);
										that.getView().getModel("oTableAllocDisplay3").updateBindings(true);
										i--;
										if (i === -1) {
											i = 0;
										}
									}
								}
							}
						}*/
						/*	if (iTable.length === 0) {
								that.goToBack();
							}*/
						that.oOutputDialog.setModel(new sap.ui.model.json.JSONModel(that.ResAll), "oSDialogModel");
						that.oOutputDialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
						that.busyDialog.close();
						that.oOutputDialog.open();
						for (var j = 0; j < that.ResAll.listitems.length; j++) {
							if (that.ResAll.listitems[j].OpFlag === "1") {
								that.oTableAllocDisplay3.getData().searchSet.splice(j, 1);
								that.oTableAllocDisplay3.refresh();
								that.ResAll.listitems.splice(j, 1);
								j--;
								// this.count--;
								// this.onClear();
							}
						}
						if (that.oTableAllocDisplay3.getData().searchSet.length === 0) {
							that.count = -1;
						}

						/*else {
							that.oMessageDialog.getContent()[0].setText(oData.EpOutput);
							that.oMessageDialog.open();
						}*/
						/*oController1._OutPutValueHelp.setModel(new sap.ui.model.json.JSONModel(oRoleID), "oSDialogModel");
						oController1._OutPutValueHelp.open();*/

					},
					function (error) {
						debugger;
						/*sap.m.MessageToast.show("Data fetch failed", {
							duration: 1000,
							animationDuration: 1000
						});*/
						that.oMessageDialog.getContent()[0].setText("Data fetch failed");
						that.oMessageDialog.open();
					});
			} else {
				that.oMessageDialog.getContent()[0].setText("Fill in all Details in row no. " + this.rowCount + " of table");
				that.oMessageDialog.open();
			}

			//	}
			//}

		},
		submitAllocation: function (oEvent) {
			debugger;
			var that = this;
			that.countData = 0;
			that.rowCount = [];
			var iLength = that.oTableAllocDisplay3.getData().searchSet;
			for (var i = 0; i < iLength.length; i++) {
				// if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].StartDate === "") {
				// 	that.rowCount.push(i + 1);
				// }
				if (iLength[i].Pernr === "" || iLength[i].StartDate === "") {
					that.rowCount.push(i + 1);
				}
			}

			for (i = 0; i < iLength.length; i++) {
				// if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].StartDate === "") {
				// 	that.FirstSubmit = false;
				// 	break;
				// } else {
				// 	that.FirstSubmit = true;
				// }
				if (iLength[i].Pernr === "" || iLength[i].StartDate === "") {
					that.FirstSubmit = false;
					break;
				} else {
					that.FirstSubmit = true;
				}
			}
			// for (var i = 0; i < iLength.length; i++) {
			// 	if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].PUName === "" || iLength[i].StartDate === "") {
			// 		this.rowCount.push(i + 1);
			// 	}
			// }

			// for (i = 0; i < iLength.length; i++) {
			// 	if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].PUName === "" || iLength[i].StartDate === "") {
			// 		this.FirstSubmit = false;
			// 		break;
			// 	} else {
			// 		this.FirstSubmit = true;
			// 	}
			// }

			if (that.rowCount.length === 0 && that.FirstSubmit === true) {
				if (!that.busyDialog) {
					var busyDialog = new sap.m.BusyDialog();
					customIconRotationSpeed: 100;
					that.busyDialog = busyDialog;
				}
				that.busyDialog.open();
				that.oSDialogModel.getData().listitems = [];
				iLength = that.oTableAllocDisplay3.getData().searchSet;
				// var that = this;
				that.ResAll = {
					listitems: []
				};

				for (i = 0; i < iLength.length; i++) {
					var Pernr = iLength[i].Pernr;
					var ProjectID = iLength[i].L1WbsName;
					if (ProjectID === undefined) {
						ProjectID = "";
					} else {
						ProjectID = iLength[i].L1WbsName;
					}

					var PU = iLength[i].PUName;
					if (PU === undefined) {
						PU = "";
					} else {
						PU = iLength[i].PUName;
					}
					var percent = iLength[i].PercentAlloc;
					if (percent === undefined || percent === "") {
						percent = "100";
					} else {
						percent = iLength[i].PercentAlloc;
					}
					var Location = "";
					var Skills = "";

					var CustCode = iLength[i].CustCode;
					if (CustCode === undefined) {
						CustCode = "";
					} else {
						CustCode = iLength[i].CustCode;
					}

					var ReportMgr = iLength[i].ReportingManager;
					if (ReportMgr === undefined) {
						ReportMgr = "";
					} else {
						ReportMgr = iLength[i].ReportingManager;
					}
					var Role = iLength[i].Role;
					if (Role === undefined) {
						Role = "";
					} else {
						Role = iLength[i].Role;
					}
					var sDate = iLength[i].StartDate;

					var year = sDate.getFullYear().toString();
					var month = (sDate.getMonth() + 1).toString();
					if (month.length === 1) {
						month = "0" + month;
					}
					var day = (sDate.getDate()).toString();
					if (day.length === 1) {
						day = "0" + day;
					}
					var strDate = year + month + day;
					var endDate = iLength[i].EndDate;

					// this.oModel.read(
					// 	"RESOURCE_ALLOCATIONSet(AccountId='',CustomerCode='',PsNumber='" + Pernr + "',StartDate='" +
					// 	strDate + "',EndDate='" + endDate + "',OpportunityId='',ProjectId='" + ProjectID +
					// 	"',RequestedLocation='" + Location + "',Skill='" + Skills + "',BufferFlag='',Pu='" + PU +
					// 	"',RamgFlag='',Acknowledgement='')",
					var oModelNew = that.getOwnerComponent().getModel("oReorgModel");
					oModelNew.read("RESOURCE_ALLOCATIONSet(AccountId='',CustomerCode='" + CustCode + "',PsNumber='" + Pernr + "',StartDate='" +
						strDate +
						"',EndDate='" + endDate + "',Percentage=" + percent + "m,OpportunityId='',ProjectId='" + ProjectID +
						"',RequestedLocation='',Skill='',BufferFlag='',Pu='" + PU + "',RamgFlag='',Acknowledgement='',Role='" + Role +
						"',Irm='" +
						ReportMgr + "')",
						null, null, false,
						function (data, oResponse) {
							debugger;
							var sD = that.oTableAllocDisplay3.getData().searchSet[that.countData].StartDate;
							year = sD.getFullYear().toString();
							month = (sD.getMonth() + 1).toString();
							if (month.length === 1) {
								month = "0" + month;
							}
							day = (sD.getDate()).toString();
							if (day.length === 1) {
								day = "0" + day;
							}
							strDate = year + month + day;
							if (that.oTableAllocDisplay3.getData().searchSet[that.countData].PercentAlloc !== "") {
								var per = that.oTableAllocDisplay3.getData().searchSet[that.countData].PercentAlloc;
							} else {
								var per = "100";
							}

							that.ResAll.listitems.push({
								OpPernr: that.oTableAllocDisplay3.getData().searchSet[that.countData].Pernr,
								OpStartDate: strDate,
								OpEndDate: that.oTableAllocDisplay3.getData().searchSet[that.countData].EndDate,
								OpPercentAlloc: per,
								OpLocation: that.oTableAllocDisplay3.getData().searchSet[that.countData].Location,
								OpMessage: data.EpOutput,
								OpFlag: data.EpFlag
							});
							that.countData++;
							that.oMainModel.refresh();
						},
						function (oError) {
							debugger;
							var sD = that.oTableAllocDisplay3.getData().searchSet[that.countData].StartDate;
							year = sD.getFullYear().toString();
							month = (sD.getMonth() + 1).toString();
							if (month.length === 1) {
								month = "0" + month;
							}
							day = (sD.getDate()).toString();
							if (day.length === 1) {
								day = "0" + day;
							}
							strDate = year + month + day;
							that.ResAll.listitems.push({
								OpPernr: that.oTableAllocDisplay3.getData().searchSet[that.countData].Pernr,
								OpStartDate: strDate,
								OpEndDate: that.oTableAllocDisplay3.getData().searchSet[that.countData].EndDate,
								OpPercentAlloc: "100%",
								OpLocation: that.oTableAllocDisplay3.getData().searchSet[that.countData].Location,
								OpMessage: "Data Fetch Failed"
							});
							that.countData++;
						});
				}
				that.oOutputDialog.setModel(new sap.ui.model.json.JSONModel(that.ResAll), "oSDialogModel");
				that.oOutputDialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
				that.busyDialog.close();
				that.oOutputDialog.open();
				for (var j = 0; j < that.ResAll.listitems.length; j++) {
					if (that.ResAll.listitems[j].OpFlag === "1") {
						that.oTableAllocDisplay3.getData().searchSet.splice(j, 1);
						that.oTableAllocDisplay3.refresh();
						that.ResAll.listitems.splice(j, 1);
						j--;
						// this.count--;
						// this.onClear();
					}
				}
				if (that.oTableAllocDisplay3.getData().searchSet.length === 0) {
					that.count = -1;
				}
			} else {
				that.oMessageDialog.getContent()[0].setText("Fill in all Details in row no. " + this.rowCount + " of table");
				that.oMessageDialog.open();
			}

			// var dialog = new Dialog({
			// 	title: "Warning",
			// 	type: "Message",
			// 	state: "Warning",
			// 	content: new Text({
			// 		text: "Submitting Create Allocation. Do you really want to continue?"
			// 	}),
			// 	beginButton: new Button({
			// 		text: "OK",
			// 		press: function(evt) {
			// 			debugger;
			// 			dialog.close();
			// 			that.countData = 0;
			// 			that.rowCount = [];
			// 			var iLength = that.oTableAllocDisplay3.getData().searchSet;
			// 			for (var i = 0; i < iLength.length; i++) {
			// 				if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].StartDate === "") {
			// 					that.rowCount.push(i + 1);
			// 				}
			// 			}

			// 			for (i = 0; i < iLength.length; i++) {
			// 				if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].StartDate === "") {
			// 					that.FirstSubmit = false;
			// 					break;
			// 				} else {
			// 					that.FirstSubmit = true;
			// 				}
			// 			}
			// 			// for (var i = 0; i < iLength.length; i++) {
			// 			// 	if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].PUName === "" || iLength[i].StartDate === "") {
			// 			// 		this.rowCount.push(i + 1);
			// 			// 	}
			// 			// }

			// 			// for (i = 0; i < iLength.length; i++) {
			// 			// 	if (iLength[i].Pernr === "" || iLength[i].L1WbsName === "" || iLength[i].PUName === "" || iLength[i].StartDate === "") {
			// 			// 		this.FirstSubmit = false;
			// 			// 		break;
			// 			// 	} else {
			// 			// 		this.FirstSubmit = true;
			// 			// 	}
			// 			// }

			// 			if (that.rowCount.length === 0 && that.FirstSubmit === true) {
			// 				if (!that.busyDialog) {
			// 					var busyDialog = new sap.m.BusyDialog();
			// 					customIconRotationSpeed: 100;
			// 					that.busyDialog = busyDialog;
			// 				}
			// 				that.busyDialog.open();
			// 				that.oSDialogModel.getData().listitems = [];
			// 				iLength = that.oTableAllocDisplay3.getData().searchSet;
			// 				// var that = this;
			// 				that.ResAll = {
			// 					listitems: []
			// 				};

			// 				for (i = 0; i < iLength.length; i++) {
			// 					var Pernr = iLength[i].Pernr;
			// 					var ProjectID = iLength[i].L1WbsName;
			// 					var PU = iLength[i].PUName;
			// 					var Location = "";
			// 					var Skills = "";
			// 					var ReportMgr = iLength[i].ReportingManager;
			// 					if (ReportMgr === undefined) {
			// 						ReportMgr = "";
			// 					} else {
			// 						ReportMgr = iLength[i].ReportingManager;
			// 					}
			// 					var Role = iLength[i].Role;
			// 					if (Role === undefined) {
			// 						Role = "";
			// 					} else {
			// 						Role = iLength[i].Role;
			// 					}
			// 					var sDate = iLength[i].StartDate;

			// 					var year = sDate.getFullYear().toString();
			// 					var month = (sDate.getMonth() + 1).toString();
			// 					if (month.length === 1) {
			// 						month = "0" + month;
			// 					}
			// 					var day = (sDate.getDate()).toString();
			// 					if (day.length === 1) {
			// 						day = "0" + day;
			// 					}
			// 					var strDate = year + month + day;
			// 					var endDate = iLength[i].EndDate;

			// 					// this.oModel.read(
			// 					// 	"RESOURCE_ALLOCATIONSet(AccountId='',CustomerCode='',PsNumber='" + Pernr + "',StartDate='" +
			// 					// 	strDate + "',EndDate='" + endDate + "',OpportunityId='',ProjectId='" + ProjectID +
			// 					// 	"',RequestedLocation='" + Location + "',Skill='" + Skills + "',BufferFlag='',Pu='" + PU +
			// 					// 	"',RamgFlag='',Acknowledgement='')",
			// 					that.oModel.read("RESOURCE_ALLOCATIONSet(AccountId='',CustomerCode='',PsNumber='" + Pernr + "',StartDate='" + strDate +
			// 						"',EndDate='" + endDate + "',OpportunityId='',ProjectId='" + ProjectID +
			// 						"',RequestedLocation='',Skill='',BufferFlag='',Pu='" + PU + "',RamgFlag='',Acknowledgement='',Role='" + Role +
			// 						"',Irm='" +
			// 						ReportMgr + "')",
			// 						null, null, false,
			// 						function(data, oResponse) {
			// 							debugger;
			// 							var sD = that.oTableAllocDisplay3.getData().searchSet[that.countData].StartDate;
			// 								year = sD.getFullYear().toString();
			// 							month = (sD.getMonth() + 1).toString();
			// 							if (month.length === 1) {
			// 								month = "0" + month;
			// 							}
			// 							day = (sD.getDate()).toString();
			// 							if (day.length === 1) {
			// 								day = "0" + day;
			// 							}
			// 							strDate = year + month + day;
			// 							that.ResAll.listitems.push({
			// 								OpPernr: that.oTableAllocDisplay3.getData().searchSet[that.countData].Pernr,
			// 								OpStartDate: strDate,
			// 								OpEndDate: that.oTableAllocDisplay3.getData().searchSet[that.countData].EndDate,
			// 								OpPercentAlloc: "100%",
			// 								OpLocation: that.oTableAllocDisplay3.getData().searchSet[that.countData].Location,
			// 								OpMessage: data.EpOutput,
			// 								OpFlag: data.EpFlag
			// 							});
			// 							that.countData++;
			// 							that.oMainModel.refresh();
			// 						},
			// 						function(oError) {
			// 							debugger;
			// 							var sD = that.oTableAllocDisplay3.getData().searchSet[that.countData].StartDate;
			// 							year = sD.getFullYear().toString();
			// 							month = (sD.getMonth() + 1).toString();
			// 							if (month.length === 1) {
			// 								month = "0" + month;
			// 							}
			// 							day = (sD.getDate()).toString();
			// 							if (day.length === 1) {
			// 								day = "0" + day;
			// 							}
			// 							strDate = year + month + day;
			// 							that.ResAll.listitems.push({
			// 								OpPernr: that.oTableAllocDisplay3.getData().searchSet[that.countData].Pernr,
			// 								OpStartDate: strDate,
			// 								OpEndDate: that.oTableAllocDisplay3.getData().searchSet[that.countData].EndDate,
			// 								OpPercentAlloc: "100%",
			// 								OpLocation: that.oTableAllocDisplay3.getData().searchSet[that.countData].Location,
			// 								OpMessage: "Data Fetch Failed"
			// 							});
			// 							that.countData++;
			// 						});
			// 				}
			// 				that.oOutputDialog.setModel(new sap.ui.model.json.JSONModel(that.ResAll), "oSDialogModel");
			// 				that.oOutputDialog.addStyleClass(that.getOwnerComponent().getContentDensityClass());
			// 				that.busyDialog.close();
			// 				that.oOutputDialog.open();
			// 				for (var j = 0; j < that.ResAll.listitems.length; j++) {
			// 					if (that.ResAll.listitems[j].OpFlag === "1") {
			// 						that.oTableAllocDisplay3.getData().searchSet.splice(j, 1);
			// 						that.oTableAllocDisplay3.refresh();
			// 						that.ResAll.listitems.splice(j, 1);
			// 						j--;
			// 						// this.count--;
			// 						// this.onClear();
			// 					}
			// 				}
			// 				if (that.oTableAllocDisplay3.getData().searchSet.length === 0) {
			// 					that.count = -1;
			// 				}
			// 			} else {
			// 				that.oMessageDialog.getContent()[0].setText("Fill in all Details in row no. " + this.rowCount + " of table");
			// 				that.oMessageDialog.open();
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

		},

		onAllocateRes: function (oEvent) {
			debugger;

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("DUPoolEditAllocation");

			this.oDUPoolEditAllModel.getData().DUDUPoolDisplay = [];

			var selectedrows = this.getView().byId("idTable5").getSelectedIndices();
			var selectedData;
			for (var i = 0; i < selectedrows.length; i++) {
				selectedData = this.getView().byId("idTable5").getContextByIndex(selectedrows[i]).getObject();
				this.oDUPoolEditAllModel.getData().DUDUPoolDisplay.push(selectedData);
			}
			this.oDUPoolEditAllModel.refresh();
			// oRouter.navTo("DUPoolEditAllocation");

			if (this.oDUPoolEditAllModel.getData().DUDUPoolDisplay.length === 1) {
				this.getView().getParent().getParent().getParent().byId("DUPoolEditAllocationView").byId("idAllocation").setEnabled(true);
			} else {
				this.getView().getParent().getParent().getParent().byId("DUPoolEditAllocationView").byId("idAllocation").setEnabled(false);
			}
			var MsgStripText = "Backdated Allocations before " + this.getOwnerComponent().Bdate + " will no longer be allowed.";
			this.getView().getParent().getParent().getParent().byId("DUPoolEditAllocationView").byId("idMsgStrip").setText(MsgStripText);
			this.onDisplay();
		},
		navToExt: function (evt) {
			debugger;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("DeputHome");
		},
		navToEOA: function (evt) {
			debugger;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("OvrEOA");
		},

		onStartdatePress: function (evt) {
			debugger;
			this._oPopover.openBy(evt.getSource());
			tabIndex = evt.oSource.oParent.oBindingContexts.oMainModel.sPath.split("/")[2];
			/*	var 
				var tabId = evt.oSource.mAssociations.ariaLabelledBy[0].split("-")[8];*/
			var temp = evt.oSource.oParent.oBindingContexts.oMainModel.oModel.oData.AccountBench[evt.oSource.oParent.oBindingContexts.oMainModel
				.sPath.split("/")[2]];
			this._oPopover.getContent()[0].setMinDate(temp.StandardStartDate);
			this._oPopover.getContent()[0].setMaxDate(temp.StandardEndDate);
			//	this._oPopover.getContent()[0].setShowWeekNumbers(false);

		},
		handleCalendarSelect: function (evt) {
			debugger;
			var oCalendar = evt.getSource();
			//	var oText = this.byId("selectedDate");
			var aSelectedDates = oCalendar.getSelectedDates();
			var oDate;
			oDate = this.convertDate(aSelectedDates[0].getStartDate());
			this.getView().getModel("oMainModel").getData().AccountBench[tabIndex].EndDate = oDate;
			//this.getOwnerComponent().getModel("oTableAllocDisplay3").getData().searchSet[tabIndex].b = oDate;
			/*} else if (tabId === "idtrc") {
				this.getOwnerComponent().getModel("oTableAllocDisplay3").getData().searchSet[tabIndex].E = oDate;
			}*/
			//	this.getOwnerComponent().getModel("oTableAllocDisplay3").getData().searchSet[tabIndex].b = oDate;
			this.getView().getModel("oMainModel").refresh();
			this._oPopover.close();
			//	var a=this.oFormatYyyymmdd.format(oDate);
			//oText.setText(this.oFormatYyyymmdd.format(oDate));

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
	});
});
var tabIndex;