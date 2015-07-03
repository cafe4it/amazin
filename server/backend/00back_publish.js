if(Meteor.isServer){
    Meteor.publish('admin_getBrowseNodes',function(){
        return BrowseNodes.find();
    });
}