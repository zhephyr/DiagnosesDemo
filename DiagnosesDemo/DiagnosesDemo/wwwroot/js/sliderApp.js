var app = angular.module('sliderApp', ['ngAnimate', 'ui.bootstrap']);

app.controller('sliderCtrl', function ($scope, $location, $anchorScroll, $http) {
    $scope.gotoBanner = function (x) {
        setTimeout(function () {
            $('html, body').animate({
                scrollTop: $("#banner" + x).offset().top
            }, 1000);
        }, 0);

    };

    $scope.questionaireComplete = false;

    $scope.questionUrls = [
        { tile: 'X', url: '/templates/slides/X_weight_shift.html' },
        { tile: '0Y', url: '/templates/slides/0Y_operate_power.html' },
        { tile: '0X', url: '/templates/slides/0X_indoors_outdoors.html' },
        { tile: '1X', url: '/templates/slides/1X_pivot_transfer.html' },
        { tile: 'XXX', url: '/templates/slides/XXX_injuries.html' },
        { tile: 'XXXX', url: '/templates/slides/XXXX_min_max.html' },
        { tile: 'alt1', url: '/templates/slides/alt1_training_offer.html' }
    ];

    $scope.displayedSlides = ['X'];

    $scope.currTempIdx = 0;

    $scope.bundle_answers = new Array(4);

    $scope.setOption = function (q, a) {
        var idx = $scope.displayedSlides.indexOf(q);
        var temp_answers = new Array(4);

        var i = 0;
        while ($scope.bundle_answers[i] != null && i < idx) {
            temp_answers[i] = $scope.bundle_answers[i];
            i++;
        }
        temp_answers[idx] = a;

        $scope.bundle_answers = temp_answers;

        $scope.displayedSlides = $scope.displayedSlides.slice(0, idx + 1);
        $scope.addSlide();
        $scope.nextSlide(idx);
    };

    $scope.addSlide = function () {
        var code = $scope.bundle_answers.join('');

        switch ($scope.displayedSlides.length) {
            case 0:
                $scope.displayedSlides.push('X');
                break;
            case 1:
                if (code == '1') {
                    $scope.displayedSlides.push('1X');
                } else {
                    $scope.displayedSlides.push('0Y');
                    $scope.displayedSlides.push('0X');
                }
                break;
            case 2:
                $scope.displayedSlides.push('XXX');
                break;
            case 3:
                $scope.displayedSlides.push('XXXX');
                break;
            case 4:
                var int_code = parseInt($scope.bundle_answers.join(''), 2);
                $scope.showBundle(int_code);
                break;
        }
    };

    $scope.setAltOption = function (tile, option) {
        switch (tile) {
            case '0Y':
                $scope.displayedSlides.push('alt1');
                break;
            case 'alt1':
                $scope.displayedSlides.push('alt2');
                break;
            case 'alt2':
                $scope.showBundle(6);
                break;
        }
    };

    $scope.showBundle = function (code) {
        $scope.bundle = $scope.bundles.find(function (bundle) {
            return parseInt(bundle.id) === code;
        });
        $scope.bundle.products.forEach(function (prod) {
            try {
                prod.src = $scope.product_images_list.find(function (item) {
                    return item.name === prod.name;
                }).img_src;
            } catch (ex) {
                alert(prod.name);
            }
        });
        $scope.questionaireComplete = true;
        $scope.gotoBanner(3);
    };

    $(function () {
        $('.question').css({ left: "+=" + $('.question').width() });

        for (var i = 0; i < $scope.displayedSlides.length; i++) {
            for (var j = 0; j <= i; j++) {
                $('[id="' + $scope.displayedSlides[j] + '"]').css({ left: "-=" + $('[id="' + $scope.displayedSlides[j] + '"]').width() });
            }
        }
    });

    $scope.nextSlide = function (idx) {
        if (idx === $scope.currTempIdx && idx < $scope.displayedSlides.length - 1) {
            var next = idx + 1;
            $scope.currTempIdx = next;
            var width = $('[id="' + $scope.displayedSlides[idx] + '"]').width();
            var leftDist = "-=" + width;

            $('[id="' + $scope.displayedSlides[idx] + '"]').animate({
                opacity: 0,
                left: leftDist
            }, 1000);

            $('[id="' + $scope.displayedSlides[next] + '"]').animate({
                opacity: 1,
                left: leftDist
            }, 1000);
        }
    };

    $scope.prevSlide = function (idx) {
        if (idx === $scope.currTempIdx && idx > 0) {
            var prev = idx - 1;
            $scope.currTempIdx = prev;
            var width = $('[id="' + $scope.displayedSlides[idx] + '"]').width();
            var rightDist = "+=" + width;

            $('[id="' + $scope.displayedSlides[idx] + '"]').animate({
                opacity: 0,
                left: rightDist
            }, 1000);

            $('[id="' + $scope.displayedSlides[prev] + '"]').animate({
                opacity: 1,
                left: rightDist
            }, 1000);
        }
    };

    (function () {
        $http.get("/bundles").then(function (response) {
            full_bundle_list = response.data;
            $scope.bundles = full_bundle_list.slice();
        });
    })();

    $scope.product_images_list = [
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
        { name: "ROHO Agility Min Countour Backrest W/Air and Lumbar", img_src: "AG2 Back Angled LG.jpg" },
        { name: "Aero X", img_src: "Aero X.jpg" },
        { name: "Aero Z", img_src: "Aero Z.jpg" },
        { name: "Aero T", img_src: "Aero T.jpg" }

    ];
});