'use strict';
var app = angular.module('app', ['ui.router', 'ngResource'])
        .constant('backend', {
            url: 'http://money2back/'
        })
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
        })
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/404");
            $stateProvider
                    .state('index', {
                        url: '/',
                        templateUrl: "/views/index.html"
                    })
                    .state('login', {
                        url: '/login',
                        templateUrl: "views/login.html"
                        
                    })

                    .state('404', {
                        url: "/404",
                        templateUrl: "views/404.html"
                    })
                    ;
        })
        .factory('AuthTokenFactory', function ($window, $location) {
            var store = $window.localStorage;
            var key = 'auth-token';
            return {
                getToken: getToken,
                setToken: setToken,
                removeToken: removeToken
            };
            function getToken() {
                return store.getItem(key);
            }
            function setToken(token) {
                if (token) {
                    store.setItem(key, token);
                } else {
                    store.removeItem(key);
                }
            }
            function removeToken() {
                store.removeItem(key);
            }

        })
        .factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
            return {
                request: addToken
            };
            function addToken(config) {
                var token = AuthTokenFactory.getToken();
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            }
        });


;
