sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ZResourceRPM.controller.FmtView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZResourceRPM.view.FmtView
		 */
		onInit: function () {

		},
		
		onDisplay: function (oEvent) {
			var that = this;
			var i,len;
			var	table = this.getView().byId("idTable2");
				for (i = 0; i < this.oMainModel.getData().AccountBench.length; i++) {
					this.oMainModel.getData().AccountBench[i].Enabled = false;
					this.oMainModel.getData().AccountBench[i].bSelected = false;
				}
				len = table.getSelectedIndices();
				for (i = 0; i < len.length; i++) {
					len.pop();
					i--;
				}
			
					//Account Bench Details
					var oModelNew = this.getOwnerComponent().getModel("oReorgModel");
					oModelNew.read("ACC_BENCH_DETAILSSet?$filter=IpCustomerCode eq '" + "" +
						"' and IpCustomerGroup eq '" + "" + "' and IpDu eq '" + "" + "' and IpProjId eq '" + "" +
						"' and IpPsNumber eq '" + "" + "' and IpPu eq '" + "SAP" + "' and IpGrpPu eq '" + "" + "'", null, null, true,
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
			
			
		
		
			// this.busyDialog.close();
			// });
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZResourceRPM.view.FmtView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZResourceRPM.view.FmtView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZResourceRPM.view.FmtView
		 */
		//	onExit: function() {
		//
		//	}

	});

});