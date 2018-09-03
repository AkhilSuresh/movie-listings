var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate']);


myApp.controller('navController', function($scope) {});

myApp.controller('movieDetailsController', function($scope, $http) {
    var selectedMovie = JSON.parse(window.localStorage.selectedmovie);

    $scope.movieUrl = function(url) {
        return 'https://image.tmdb.org/t/p/w500/' + $scope.movieDetails.poster_path;
    }
    $http.get('https://api.themoviedb.org/3/movie/' + selectedMovie.id + '?api_key=bd76c7ba0e82c7be9510fe78b92992e2&language=en-US')
        .then(function(response) {
            $scope.movieDetails = response.data;

        });

    $http.get('https://api.themoviedb.org/3/movie/' + selectedMovie.id + '/credits?api_key=bd76c7ba0e82c7be9510fe78b92992e2')
        .then(function(response) {
            $scope.credits = response.data;
        });
    $scope.castImage = function(url) {
        return 'https://image.tmdb.org/t/p/original/' + url;
    }

    $scope.getRating = function(value) {
        return Math.round(value);
    }

});


myApp.controller('moviesListController', function($scope, $http) {

    $scope.movieUrl = function(url, poster) {
        return url ? 'https://image.tmdb.org/t/p/w500/' + url : 'https://image.tmdb.org/t/p/w500/' + poster;
    }

    $scope.movieDetails = function(movie) {
        window.localStorage.selectedmovie = JSON.stringify(movie);
        window.location.href = '#details';
    }

    $scope.addToFavorites = function(movie, event) {
        var favorites = JSON.parse(window.localStorage.getItem("favorites"));
        favorites.push(movie);
        window.localStorage.setItem("favorites", JSON.stringify(favorites));
        event.stopPropagation();
    }

    $scope.inFavorites = function(id) {
        var inFavorites = false;
        var favorites = JSON.parse(window.localStorage.getItem("favorites"));
        favorites.forEach(function(favorite) {
            if (favorite.id == id) {
                inFavorites = true;
            }
        });
        return inFavorites;
    }

    $scope.searchKeyword = window.localStorage.keyword;

    $http.get('https://api.themoviedb.org/3/search/movie?api_key=bd76c7ba0e82c7be9510fe78b92992e2&language=en-US&page=1&include_adult=true&query=' + window.localStorage.keyword)
        .then(function(response) {

            $scope.movies = response.data.results;
        });

});

myApp.controller('favoritesController', function($scope, $http) {

    $scope.movieUrl = function(url) {
        return 'https://image.tmdb.org/t/p/w500/' + url;
    }

    $scope.movieDetails = function(movie) {
        window.localStorage.selectedmovie = JSON.stringify(movie);
        window.location.href = '#details';
    }

    $scope.addToFavorites = function(movie, event) {
        var favorites = JSON.parse(window.localStorage.getItem("favorites"));
        favorites.push(movie);
        window.localStorage.setItem("favorites", JSON.stringify(favorites));
        event.stopPropagation();
    }

    $scope.searchKeyword = window.localStorage.keyword;

    $scope.movies = JSON.parse(window.localStorage.getItem("favorites"));

});


//Define route for site
myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            title: 'home',
            templateUrl: 'pages/home.html'
        })
        .when('/favorites', {
            title: 'Favorites',
            templateUrl: 'pages/favorites.html',
            controller: 'favoritesController as favoritesController'
        })
        .when('/details', {
            title: 'details',
            templateUrl: 'pages/details.html',
            controller: 'movieDetailsController as movieDetailsController'
        })
        .when('/movies', {
            title: 'movies',
            templateUrl: 'pages/movies.html',
            controller: 'moviesListController as moviesListController'
        })
        .otherwise({
            redirectTo: 'pages/notfound.html'
        });
}]);