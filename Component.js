sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ZResourceRPM/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ZResourceRPM.Component", {

		metadata: {
			manifest: "json",

			config: {
				fullWidth: true,
				resourceBundle: "i18n/i18n.properties",
				serviceConfig: {
					name: "ZGW_LTIL_RPM_SRV",
					serviceUrl: "/sap/opu/odata/sap/ZGW_LTIL_RPM_SRV"
				},
				serviceConfig2: {
					name: "ZGW_RESOURCEFINAL_SRV",
					serviceUrl: "/sap/opu/odata/sap/ZGW_RESOURCEFINAL_SRV/"
				},
				/*serviceConfig3: {
					name: "ZOVERSEAS_DEPUTATION_V2_SRV",
					serviceUrl: "/sap/opu/odata/sap/ZOVERSEAS_DEPUTATION_V2_SRV/"
				},
				serviceConfig4: {
					name: "ZTRAVEL_V2_SRV_01",
					serviceUrl: "/sap/opu/odata/sap/ZTRAVEL_V2_SRV_01/"
				},
				serviceConfig5: {
					name: "ZVISA_OVERSEAS_SRV",
					serviceUrl: "/sap/opu/odata/sap/ZVISA_OVERSEAS_SRV/"
				},
				serviceConfig6: {
					name: "ZOVERSEAS_V3_O_SRV",
					serviceUrl: "/sap/opu/odata/sap/ZOVERSEAS_V3_O_SRV/"
				},
				serviceConfig7: {
					name: "ZDEPUT_RPM_SRV",
					serviceUrl: "/sap/opu/odata/sap/ZDEPUT_RPM_SRV/"
				},*/
				serviceConfig8: {
					name: "ZGW_RE_ORG_DEV_SRV",
					serviceUrl: "/sap/opu/odata/sap/ZGW_RE_ORG_DEV_SRV/"
				}
			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			this.setModel(models.createDeviceModel(), "device");

			var mConfig = this.getMetadata().getConfig();

			var sServiceUrl = mConfig.serviceConfig.serviceUrl;
			var sServiceUrl2 = mConfig.serviceConfig2.serviceUrl;
			/*	var sServiceUrl7 = mConfig.serviceConfig7.serviceUrl;*/

			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {
				json: false,
				loadMetadataAsync: true
			});

			var oViewModel = new sap.ui.model.odata.ODataModel(sServiceUrl2, {
				json: false,
				loadMetadataAsync: true
			});
			/*var oRPMModel = new sap.ui.model.odata.ODataModel(sServiceUrl7, {
				json: false,
				loadMetadataAsync: true
			});*/

			/*var sServiceUrl3 = mConfig.serviceConfig3.serviceUrl;
			var oAllocoDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl3, {
				json: true,
				loadMetadataAsync: true
			});
			this.setModel(oAllocoDataModel, "oAllocoDataModel");*/

			/*var sServiceUrl4 = mConfig.serviceConfig4.serviceUrl;
			var oTravelModel = new sap.ui.model.odata.ODataModel(sServiceUrl4, {
				json: true,
				loadMetadataAsync: true
			});
			this.setModel(oTravelModel, "oTravelModel");
			
			var sServiceUrl5 = mConfig.serviceConfig5.serviceUrl;
			var oVisaDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl5, {
				json: true,
				loadMetadataAsync: true
			});
			this.setModel(oVisaDataModel, "oVisaDataModel");
			
			var sServiceUrl6 = mConfig.serviceConfig6.serviceUrl;
			var oOvrDataModel = new sap.ui.model.odata.ODataModel(sServiceUrl6, {
				json: true,
				loadMetadataAsync: true
			});
			this.setModel(oOvrDataModel, "oOvrDataModel");

			
			*/
			var oModelBatch = new sap.ui.model.odata.ODataModel(sServiceUrl, {
				json: false,
				loadMetadataAsync: true
			});
			var sServiceUrl8 = mConfig.serviceConfig8.serviceUrl;
			var oReorgModel = new sap.ui.model.odata.ODataModel(sServiceUrl8, {
				json: true,
				loadMetadataAsync: true
			});
			this.setModel(oReorgModel, "oReorgModel");

			this.Data = {
				"CustomerGroup": {},
				"CustomerCode": {},
				"ProjectID": {},
				"ProjectIDPUDUBench": {},
				"PUDUProjectID": {},
				"PU": {},
				"DU": {},
				"PsNo": {},
				"PURA": {},
				"ProjectResouces": {},
				"AccountBench": {},
				"PUDUBench": {},
				"Role": {},
				"ReportMgr": {},
				"DUDUPool": {},
				"DUDUPoolDisplay": {},
				"CustomerCodeRA": {},
				"AllocDetail": {},
				"GPU": {},
				"RE_PU": {}
			};
			this.oMainModel = new sap.ui.model.json.JSONModel();
			this.oMainModel.setData(this.Data);
			this.oMainModel.iSizeLimit = 99999;
			this.setModel(this.oMainModel, "oMainModel");

			this.Data2 = {
				"ProjectResouces": []
			};

			this.oDeAllocModel = new sap.ui.model.json.JSONModel();
			this.oDeAllocModel.setData(this.Data2);
			this.oDeAllocModel.iSizeLimit = 99999;
			this.setModel(this.oDeAllocModel, "oDeAllocModel");

			this.Data3 = {
				"ProjectResouces": []
			};

			this.oDeleteModel = new sap.ui.model.json.JSONModel();
			this.oDeleteModel.setData(this.Data3);
			this.oDeleteModel.iSizeLimit = 99999;
			this.setModel(this.oDeleteModel, "oDeleteModel");

			this.Data4 = {
				"ProjectResouces": []
			};

			this.oAccountBenchModel = new sap.ui.model.json.JSONModel();
			this.oAccountBenchModel.setData(this.Data4);
			this.oAccountBenchModel.iSizeLimit = 99999;
			this.setModel(this.oAccountBenchModel, "oAccountBenchModel");

			this.Data5 = {
				"searchSet": []
			};

			this.oTableAllocDisplay3 = new sap.ui.model.json.JSONModel();
			this.oTableAllocDisplay3.setData(this.Data5);
			this.oTableAllocDisplay3.iSizeLimit = 99999;
			this.setModel(this.oTableAllocDisplay3, "oTableAllocDisplay3");

			this.Data6 = {
				"ProjectResouces": []
			};

			this.oSentToPUModel = new sap.ui.model.json.JSONModel();
			this.oSentToPUModel.setData(this.Data6);
			this.oSentToPUModel.iSizeLimit = 99999;
			this.setModel(this.oSentToPUModel, "oSentToPUModel");

			this.Data7 = {
				"DUDUPoolDisplay": []
			};

			this.oDUPoolEditAllModel = new sap.ui.model.json.JSONModel();
			this.oDUPoolEditAllModel.setData(this.Data7);
			this.oDUPoolEditAllModel.iSizeLimit = 99999;
			this.setModel(this.oDUPoolEditAllModel, "oDUPoolEditAllModel");

			this.Data8 = {
				"MASendToPractice": []
			};

			this.oMASendToPracticeModel = new sap.ui.model.json.JSONModel();
			this.oMASendToPracticeModel.setData(this.Data8);
			this.oMASendToPracticeModel.iSizeLimit = 99999;
			this.setModel(this.oMASendToPracticeModel, "oMASendToPracticeModel");

			this.oRoleID = {
				"listitems": []
			};

			this.oSDialogModel = new sap.ui.model.json.JSONModel();
			this.oSDialogModel.setData(this.oRoleID);
			this.oSDialogModel.iSizeLimit = 99999;
			this.setModel(this.oSDialogModel, "oSDialogModel");

			oModel.setDefaultCountMode("None");
			this.setModel(oModel, "oModel");
			this.getModel("oModel").setSizeLimit(99999);

			oViewModel.setDefaultCountMode("None");
			this.setModel(oViewModel, "oViewModel");
			this.getModel("oViewModel").setSizeLimit(99999);

			/*oRPMModel.setDefaultCountMode("None");
			this.setModel(oRPMModel, "oRPMModel");
			this.getModel("oRPMModel").setSizeLimit(99999);*/

			oModelBatch.setDefaultCountMode("None");
			this.setModel(oModelBatch, "oModelBatch");
			this.getModel("oModelBatch").setSizeLimit(99999);

			// Set device model
			var oDeviceModel = new sap.ui.model.json.JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
				listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
			});
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");

			this._oApplicationProperties = new sap.ui.model.json.JSONModel({
				serviceUrl: sServiceUrl

			});
			this.setModel(this._oApplicationProperties, "appProperties");

			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		},

		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});