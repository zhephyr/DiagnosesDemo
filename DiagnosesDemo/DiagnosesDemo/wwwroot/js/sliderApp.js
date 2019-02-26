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

    $scope.popIn = function ($element) {
        $element.css({ transform: "scale(1,1)" });
    };

    $scope.popOut = function ($element) {
        $element.css({ transform: "scale(0,0)" });
    };

    $scope.selectBubble = function (idx) {
        var $element = $($('.img-bubble')[idx]);
        var $main = $($('.img-bubble')[2]);

        $element.css({ transform: "scale(0,0)" }).promise().done(function () {
            $main.css({ transform: "scale(0,0)" }).promise().done(function () {
                [colors[idx], colors[2]] = [colors[2], colors[idx]];
            });
        });

        setTimeout(function () {
            $scope.colorBubbles();
            $element.css({ transform: "scale(1,1)" }).promise().done(function () {
                $main.css({ transform: "scale(1,1)" });
            });
        }, 1000);
    };

    var colors = ["red", "yellow", "green", "blue", "violet"];

    angular.element(document).ready(function () {
        $scope.colorBubbles();
    });

    $scope.colorBubbles = function () {
        var bubbles = $('.img-bubble');
        for (var i = 0; i < bubbles.length; i++) {
            var $bubble = $(bubbles[i]);
            $bubble.css({ 'background-color': colors[i] });
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
        }
    }, true);
});