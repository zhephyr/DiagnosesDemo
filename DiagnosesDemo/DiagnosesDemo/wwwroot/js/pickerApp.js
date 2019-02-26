var app = angular.module('pickerApp', ['ngAnimate', 'ui.bootstrap']);

app.filter('codes', function () {
    return function (list) {
        if (list) {
            return list.join(" / ");
        } else {
            return "";
        }
    };
});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
    $scope.close = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('pickerCtrl', function ($scope, $http, $uibModal) {
    $scope.tabs = [
        {
            name: 'Bundles',
            url: '/templates/bundleTabTemplate.html'
        },
        {
            name: 'Single Products',
            url: '/templates/singleTabTemplate.html'
        }
    ];

    $scope.openInitModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '../../templates/initModalTemplate.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                idx: function () {
                    return;
                }
            }
        });
    };

    $scope.openInitModal();

    var full_prod_list;
    var full_bund_list;

    $scope.single_options = {
        category: "",
        prod_type: "",
        hcpcs: [],
        size: ""
    };

    $scope.bundle_options = {
        hcpcs: [],
        independance: 0,
        location: 0
    };

    $scope.filters = {
        hcpcs: [],
        padding: []
    };

    $scope.hcpcs_filter = {};

    $scope.placehold = {
        category: "Patient Type?",
        prod_type: "Product Type?",
        diagnosis: "Current Diagnosis?"
    };

    $scope.single_acc_status = {
        parent: true,
        first: true,
        second: false,
        third: false
    };

    $scope.bundle_acc_status = {
        parent: true,
        first: true,
        second: false,
        third: false
    };

    $scope.$watch('single_options', function (newVal, oldVal) {
        for (var prop in $scope.single_options) {
            if (newVal[prop] !== oldVal[prop]) {
                switch (prop) {
                    case 'category':
                        $scope.single_acc_status = {
                            parent: true,
                            first: true,
                            second: true,
                            third: false
                        };
                        break;
                    case 'prod_type':
                        $scope.single_acc_status = {
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

    $scope.$watch('bundle_options', function (newVal, oldVal) {
        for (var prop in $scope.bundle_options) {
            if (newVal[prop] !== oldVal[prop]) {
                switch (prop) {
                    case 'hcpcs':
                        $scope.bundle_acc_status = {
                            parent: true,
                            second: true,
                            third: false
                        };
                        break;
                    case 'independance':
                        $scope.bundle_acc_status = {
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

    $http.get('/bundles').then(function (response) {
        full_bund_list = response.data;
        $scope.bundles = full_bund_list.slice();
    });

    $http.get('/diagnoses').then(function (response) {
        $scope.diagnoses = response.data;
    });

    $scope.$watch('single_options', function (newVal, oldVal) {
        var options = {
            MainCat: $scope.single_options.category,
            ProdType: $scope.single_options.prod_type,
            Diagnosis: $scope.single_options.diagnosis,
            Hcpcs: $scope.single_options.hcpcs,
            Size: $scope.single_options.size
        };

        $http.post("/products/update", options).then(function (response) {
            full_prod_list = response.data;
            $scope.products = full_prod_list.slice();
        });
    }, true);

    $scope.$watch('bundle_options', function (newVal, oldVal) {
        var options = {
            HCPCS: $scope.bundle_options.hcpcs,
            Independance: $scope.bundle_options.independance,
            Location: $scope.bundle_options.location
        };

        $http.post("/bundles/update", options).then(function (response) {
            full_bund_list = response.data;
            $scope.bundles = full_bund_list.slice();
        });
    }, true);

    $scope.diagnoses_chosen = [];
    $scope.condition = {};

    $scope.addDiagnosis = function () {
        var ICD10 = $scope.condition.current.split('|')[0].trim();
        if ($scope.diagnoses_chosen.indexOf(ICD10) === -1) {
            $scope.diagnoses_chosen.push(ICD10);
            $scope.condition.current = "";
        }
    };

    $scope.removeCode = function (code) {
        var idx = $scope.diagnoses_chosen.indexOf(code);
        if (idx > -1) {
            $scope.diagnoses_chosen.splice(idx, 1);
        }
    };

    $scope.$watch('diagnoses_chosen', function (newVal, oldVal) {
        if (newVal.length > -1) {

            $http.post("/hcpcs/update", newVal).then(function (response) {
                if (response.data.length > 0) {
                    $scope.hcpcs = response.data[0].hcpcs;
                    $scope.single_options.hcpcs = $scope.hcpcs;
                    $scope.bundle_options.hcpcs = $scope.hcpcs;
                } else {
                    $scope.hcpcs = [];
                    $scope.single_options.hcpcs = $scope.hcpcs;
                    $scope.bundle_options.hcpcs = $scope.hcpcs;
                }
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
    });
});