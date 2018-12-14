var app = angular.module('pickerApp', ['ngAnimate', 'ui.bootstrap', 'darthwade.loading']);

app.filter('codes', function () {
    return function (list) {
        if (list) {
            return list.join(" / ");
        } else {
            return "";
        }
    }
});

app.controller('pickerCtrl', function ($scope, $http, $loading) {
    var full_prod_list;

    $scope.options = {
        main_cat: "",
        prod_type: "",
        hcpcs: [],
        size: ""
    };

    $scope.filters = {
        hcpcs: [],
        padding: []
    }

    $scope.hcpcs_filter = {};

    $scope.placehold = {
        main_cat: "Patient Type?",
        prod_type: "Product Type?",
        diagnosis: "Current Diagnosis?"
    };

    $scope.head_status = {
        parent: true,
        first: false,
        second: false,
        third: true
    };

    $scope.collapseHeader = function () {
        $scope.head_status.parent = false;
        var content = document.getElementById("content");
        content.scrollIntoView(true);
    }

    $scope.$watch('options', function (newVal, oldVal) {
        for (var prop in $scope.options) {
            if (newVal[prop] !== oldVal[prop]) {
                switch (prop) {
                    case 'main_cat':
                        $scope.head_status = {
                            parent: true,
                            first: false,
                            second: true,
                            third: false
                        };
                        break;
                    case 'prod_type':
                        $scope.head_status = {
                            parent: true,
                            first: false,
                            second: false,
                            third: true
                        };
                        break;
                    default:
                        break;
                }
            }
        }
    }, true);

    $scope.currentPage = 1;
    $scope.pageSize = 15;

    $http.get('/products').then(function (response) {
        full_prod_list = response.data;
        $scope.products = full_prod_list.slice();
    });

    $http.get('/diagnoses').then(function (response) {
        $scope.diagnoses = response.data;
    });

    $scope.$watch('options', function (newVal, oldVal) {
        if (newVal.main_cat !== "") {
            $loading.start('products');

            var options = {
                MainCat: $scope.options.main_cat,
                ProdType: $scope.options.prod_type,
                Diagnosis: $scope.options.diagnosis,
                Hcpcs: $scope.options.hcpcs,
                Size: $scope.options.size
            }

            $http.post("/products/update", options).then(function (response) {
                full_prod_list = response.data;
                $scope.products = full_prod_list.slice();
                $loading.finish('products')
            });
        }
    }, true);

    $scope.diagnoses_chosen = [];
    $scope.condition = {};

    $scope.addDiagnosis = function () {
        var ICD10 = $scope.condition.current.split('|')[0].trim();
        if ($scope.diagnoses_chosen.indexOf(ICD10) == -1) {
            $scope.diagnoses_chosen.push(ICD10);
            $scope.condition.current = "";
        }
    }

    $scope.removeCode = function (code) {
        var idx = $scope.diagnoses_chosen.indexOf(code);
        if (idx > -1) {
            $scope.diagnoses_chosen.splice(idx, 1);
        }
    }

    $scope.$watch('diagnoses_chosen', function (newVal, oldVal) {
        if (newVal.length > -1) {
            $loading.start('products');

            $http.post("/hcpcs/update", newVal).then(function (response) {
                if (response.data.length > 0) {
                    $scope.hcpcs = response.data[0].hcpcs;
                    $scope.options.hcpcs = $scope.hcpcs;
                } else {
                    $scope.hcpcs = [];
                    $scope.options.hcpcs = $scope.hcpcs;
                }
                $loading.finish('products')
            });
        }
    }, true);

    $scope.$watchCollection('hcpcs_filter', function () {
        $scope.filters.hcpcs = [];
        angular.forEach($scope.hcpcs_filter, function (value, key) {
            if (value)
                $scope.filters.hcpcs.push(key.toUpperCase());
        });
    });

    $scope.$watchCollection('pad_filter', function () {
        $scope.filters.padding = [];
        angular.forEach($scope.pad_filter, function (value, key) {
            if (value)
                $scope.filters.padding.push(key.toUpperCase());
        });
    });

    $scope.$watchCollection('filters', function () {
        $loading.start('products');

        $scope.products = full_prod_list.slice();
        var removal = [];

        for (var i = (full_prod_list.length - 1); i >= 0; i--) {
            if ($scope.filters.padding.length > 0) {
                if ($scope.filters.padding.indexOf(full_prod_list[i].pad_type) < 0) {
                    $scope.products.splice(i, 1);
                    continue;
                }
            }

            if ($scope.filters.hcpcs.length > 0) {
                var found = false;
                for (var j = 0; j < full_prod_list[i].hcpcs.length; j++) {
                    if ($scope.filters.hcpcs.indexOf(full_prod_list[i].hcpcs[j]) > -1)
                        found = true;
                }

                if (found) {
                    $scope.products.splice(i, 1);
                    continue;
                }
            }
        }

        $loading.finish('products')
    });
});