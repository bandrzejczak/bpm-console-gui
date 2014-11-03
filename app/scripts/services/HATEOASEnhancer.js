'use strict';

/**
 * @ngdoc service
 * @name activitiConsoleApp.HATEOASEnhancer
 * @description
 * # HATEOASEnhancer
 * Service in the activitiConsoleApp.
 */
angular.module('activitiConsoleApp')
    .factory('HATEOASEnhancer', function (ResourceLinkBuilder, RESTApiURL) {
        return {
            'response': function (response) {
                if(response.config.url.indexOf(RESTApiURL) === 0) {
                    var links = response.headers('Link');
                    var newData = {
                        response: response.data
                    };
                    if (links !== null)
                        newData.links = ResourceLinkBuilder.fromHeader(links);
                    response.data = newData;
                }
                return response;
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('HATEOASEnhancer');
    });