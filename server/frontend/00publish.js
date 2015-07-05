if (Meteor.isServer) {
    Meteor.publish('front_getBrowseNodes', function (locale) {
        var locale = locale || 'us';
        return BrowseNodes.find({locale: locale});
    });

    Meteor.publish('front_getAmazonCategories',function(){
        return AmazonCategories.find({},{fields : {value : 0}})
    })
}