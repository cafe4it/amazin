if (Meteor.isServer) {
    Meteor.publish('front_getBrowseNodes', function (locale) {
        var locale = locale || 'us';
        return BrowseNodes.find({locale: locale}, {fields: {text2: 1, icon: 1, locale: 1}});
    })
}