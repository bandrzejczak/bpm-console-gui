'use strict';

/**
 * @ngdoc function
 * @name bpmConsoleApp.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the bpmConsoleApp
 */
angular.module('bpmConsoleApp')
    .controller('ProcessesCtrl', ['$scope', 'Processes', 'ngTableParams', '$filter', 'SweetAlert', '$state',
        function ($scope, Processes, NgTableParams, $filter, SweetAlert, $state) {
            $scope.empty = false;
            Processes.get().$promise.then(function (response) {
                var data = response.response;
                if (data.length < 1)
                    $scope.empty = true;
                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 10,
                    filter: {},
                    sorting: {
                        name: 'desc',
                        version: 'desc'
                    }
                }, {
                    filterDelay: 100,
                    counts: $scope.empty ? [] : [10, 25, 50, 100],
                    total: data.length,
                    getData: function ($defer, params) {
                        var filteredData = params.filter() ?
                            $filter('filter')(data, params.filter()) :
                            data;
                        var orderedData = params.sorting() ?
                            $filter('orderBy')(filteredData, params.orderBy()) :
                            data;

                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });
            });

            $scope.start = function (processId) {
                Processes.start({id: processId}).$promise.then(
                    function () {
                        SweetAlert.swal($scope.msg.processes.start.success, '', 'success');
                        $state.go('app.tasks.inbox');
                    }
                );
            };
        }]
);