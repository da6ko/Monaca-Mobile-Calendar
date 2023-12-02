var $$ = Dom7;

var app = new Framework7({

    el: '#app',
    id: 'your_id',
    name: 'your_name',
    theme: 'auto',
    routes: routes,
});

var mainView = app.views.create('.view-main', {
    url: '/'
});
var leftView = app.views.create('.view-left', {
    url: '/'
});