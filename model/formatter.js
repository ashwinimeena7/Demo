sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		changeDateType: function(sDate) {
			debugger;
			if (sDate !== undefined) {
				if (sDate === "00000000" || sDate === "") {
					return "";
				} else {
					var sYear = sDate.substr(0, 4);
					var sMonth = sDate.substr(4, 2);
					var sDay = sDate.substr(6, 2);
					var sNewDate = sDay + "." + sMonth + "." + sYear;
					return sNewDate;
				}
			} else {
				return "";
			}
		}

	};

});