frontRoutes.route('/', {
    name: 'home',
    action: renderView,
    subscriptions: function (p, q) {
        var locale = p.locale || 'us';
        this.register('front_browseNodes', Meteor.subscribe('front_getBrowseNodes', locale));
    }
});

FlowRouter.route('/itemsByNode/:id', {
    name: 'itemsByNode',
    action: renderView,
    subscriptions: function (p, q) {

    }
});