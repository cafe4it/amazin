if (Meteor.isClient) {
    FlowLayout.setRoot('body');
}

renderView = function (view) {
    var header = ((this.group  === undefined) || this.group.prefix === '/') ? 'header' : 'admin_header';

    FlowLayout.render('defaultLayout', {
        top: header,
        main: this.name || view,
        bottom: "footer"
    });
}

frontRoutes = FlowRouter.group({
    prefix: '/'
});

adminRoutes = FlowRouter.group({
    prefix: '/thi3nAn'
});
