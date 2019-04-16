var app = angular.module('sliderApp', ['ngAnimate', 'ui.bootstrap']);

app.controller('sliderApp', function ($scope, $location, $anchorScroll, $http) {
    $scope.gotoBanner = function (x) {
        $('html, body').animate({
            scrollTop: $("#banner" + x).offset().top
        }, 1000);
    };

    $scope.questionUrls = ['/templates/bundleQuestion1.html', '/templates/bundleQuestion2.html'];

    $scope.currTempIdx = 0;

    $scope.bundle_answers = { weight_shift: 'init', outdoors: 'init' };

    $(function () {
        for (var i = 1; i < $scope.questionUrls.length; i++) {
            var width = $('[id="slide' + i + '"]').width();
            $('[id="slide' + i + '"]').css({ left: "+=" + width });
        }
    });

    $scope.nextSlide = function (idx) {
        if (idx === $scope.currTempIdx) {
            var next = idx + 1;
            $scope.currTempIdx = next;
            var width = $('[id="slide' + idx + '"]').width();
            var leftDist = "-=" + width;
            var rightDist = "+=" + width;

            $('[id="slide' + idx + '"]').animate({
                opacity: 0,
                left: leftDist
            }, 1000);

            $('[id="slide' + next + '"]').animate({
                opacity: 1,
                left: leftDist
            }, 1000);
        };
    };

    $scope.prevSlide = function (idx) {
        if (idx === $scope.currTempIdx) {
            var prev = idx - 1;
            $scope.currTempIdx = prev;
            var width = $('[id="slide' + idx + '"]').width();
            var leftDist = "-=" + width;
            var rightDist = "+=" + width;

            $('[id="slide' + idx + '"]').animate({
                opacity: 0,
                left: rightDist
            }, 1000);

            $('[id="slide' + prev + '"]').animate({
                opacity: 1,
                left: rightDist
            }, 1000);
        }
    };

    $scope.setWeightShift = function (inpt) {
        if ($scope.bundle_answers.weight_shift === 'init') {
            $scope.bundle_answers.weight_shift = inpt;
            $scope.nextSlide(0);
        }
        else {
            $scope.bundle_answers.weight_shift = inpt;
        }
    };

    $scope.setOutdoor = function (inpt) {
        if ($scope.bundle_answers.outdoors === 'init') {
            $scope.bundle_answers.outdoors = inpt;
            $scope.gotoBanner(3);
        }
        else {
            $scope.bundle_answers.outdoors = inpt;
        }
    };

    $scope.selectBubble = function (idx, pop) {
        if (idx !== 0) {
            var $element = $($('.img-bubble')[pop]);
            var $main = $($('.img-bubble')[2]);

            $element.css({ transform: "scale(0,0)" }).promise().done(function () {
                $main.css({ transform: "scale(0,0)" }).promise().done(function () {
                    [$scope.show_bundles[idx], $scope.show_bundles[0]] = [$scope.show_bundles[0], $scope.show_bundles[idx]];
                });
            });

            setTimeout(function () {
                $element.css({ transform: "scale(1,1)" }).promise().done(function () {
                    $main.css({ transform: "scale(1,1)" });
                });
            }, 1000);
        }
    };

    (function () {
        $http.get("/bundles").then(function (response) {
            full_bundle_list = response.data;
            $scope.bundles = full_bundle_list.slice();
        });
    })();

    $scope.$watch('bundle_answers.weight_shift', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.bundles = full_bundle_list.slice();

            if (newVal === 'yes') {
                for (var i = $scope.bundles.length - 1; i >= 0; i--) {
                    if ($scope.bundles[i].chair_func.includes("power")) {
                        $scope.bundles.splice(i, 1);
                    }
                }
            } else if (newVal === 'no') {
                for (var i = $scope.bundles.length - 1; i >= 0; i--) {
                    if (!$scope.bundles[i].chair_func.includes("power")) {
                        $scope.bundles.splice(i, 1);
                    }
                }
            }

            if ($scope.bundle_answers.outdoors !== 'init') {
                if ($scope.bundle_answers.outdoors) {
                    for (var i = $scope.bundles.length - 1; i >= 0; i--) {
                        if ($scope.bundles[i].indoor_outdoor === "indoor") {
                            $scope.bundles.splice(i, 1);
                        }
                    }
                } else if (!$scope.bundle_answers.outdoors) {
                    for (var i = $scope.bundles.length - 1; i >= 0; i--) {
                        if ($scope.bundles[i].indoor_outdoor === "outdoor") {
                            $scope.bundles.splice(i, 1);
                        }
                    }
                }
            }

            $scope.$digest();
        }
    }, true);

    $scope.$watch('bundle_answers.outdoors', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.bundles = full_bundle_list.slice();

            if (newVal) {
                for (var i = $scope.bundles.length - 1; i >= 0; i--) {
                    if ($scope.bundles[i].indoor_outdoor === "indoor") {
                        $scope.bundles.splice(i, 1);
                    }
                }
            } else {
                for (var i = $scope.bundles.length - 1; i >= 0; i--) {
                    if ($scope.bundles[i].indoor_outdoor === "outdoor") {
                        $scope.bundles.splice(i, 1);
                    }
                }
            }

            if ($scope.bundle_answers.weight_shift === 'yes') {
                for (var i = $scope.bundles.length - 1; i >= 0; i--) {
                    if ($scope.bundles[i].chair_func.includes("power")) {
                        $scope.bundles.splice(i, 1);
                    }
                }
            } else if (!$scope.bundle_answers.weight_shift === 'no') {
                for (var i = $scope.bundles.length - 1; i >= 0; i--) {
                    if (!$scope.bundles[i].chair_func.includes("power")) {
                        $scope.bundles.splice(i, 1);
                    }
                }
            }

            $scope.$digest();
        }
    }, true);

    var product_images_list = [
        { name: "Corpus Ergo Backrest", img_src: "Corpus Back & Seat Cushion.jpg" },
        { name: "Permobil F3 Power Wheelchair", img_src: "F3.png" },
        { name: "ROHO Quadtro Select High Profile Seat Cushion", img_src: "ROHO Quadtro Select_HP.jpg" },
        { name: "ROHO Agility Max Contour Backrest", img_src: "AG6 Back Angled QR LG.jpg" },
        { name: "Comfort M2 Seat Cushion", img_src: "M2 Zero 1115.jpg" },
        { name: "ROHO Hybrid Elite Seat Cushion", img_src: "Hybrid Elite Dual Valve_No Bkgrd_No Cov.jpg" },
        { name: "Corpus Ergo Seat cushion", img_src: "Corpus Back & Seat Cushion.jpg" },
        { name: "Permobil M3 Power Wheelchair", img_src: "M3.png" },
        { name: "Permobil F5 VS Power Wheelchair", img_src: "F5VS.png" },
        { name: "Permobil M1 Power Wheelchair", img_src: "M1.png" },
        { name: "ROHO Agility Min Countour Backrest W/ Air and Lumbar", img_src: "AG2 Back Angled LG.jpg" }
    ];

    $scope.$watch('bundles', function (newVal, oldVal) {
        if (newVal) {
            var show_bundles = newVal.slice(0, 5);
            show_bundles.forEach(function (bundle) {
                bundle.products.forEach(function (product) {
                    product.img_src = product_images_list.find(function (element) {
                        if (element.name == product.name) {
                            return element;
                        }
                    }).img_src;
                });
            });

            $scope.show_bundles = show_bundles;
            $scope.$apply();
        }
    });
});