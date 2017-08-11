'use strict';

var app = angular.module('pickerApp', ['ngAnimate', 'ui.bootstrap'])
app.controller('pickerCtrl', function ($scope, $http) {
	$scope.product = {
		main_cat: "",
		prod_type: "",
		diagnosis: "",
		hcpcs: ""
	}

	$scope.placehold = {
		main_cat: "Patient Type?",
		prod_type: "Product Type?",
		diagnosis: "Current Diagnosis?"
	}

	$scope.head_status = {
		first: true,
		second: false,
		third: false
	}

	$scope.$watch('product', function (newVal, oldVal) {
		for (var prop in $scope.product) {
			if (newVal[prop] !== oldVal[prop]) {
				switch (prop) {
					case 'main_cat':
						$scope.head_status = {
							first: false,
							second: true,
							third: false
						}
						break;
					case 'prod_type':
						$scope.head_status = {
							first: false,
							second: false,
							third: true
						}
						break;
					default:
						break;
				}
			}
		}
	}, true);
});