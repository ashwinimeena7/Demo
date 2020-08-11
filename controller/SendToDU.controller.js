sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("ZResourceRPM.controller.SendToDU", {

		onInit: function() {
			debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		goToBack: function() {
			debugger;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Main");
		}

	});

});