Template.itemsByNode.onCreated(function(){
    SubBrowseNodes = new ReactiveVar();
    ItemsAndNodes = new ReactiveVar();
    Session.set('selectedCategory',FlowRouter.getParam('nodeId'));
});

Tracker.autorun(function(c){
    var nodeId = FlowRouter.getParam('nodeId');
    if(nodeId){
        nodeId = parseInt(nodeId);
        Meteor.call('amazon_BrowseNodeLookup',nodeId,function(e,rs){
            SubBrowseNodes.set(rs);
        })
        Meteor.call('amazon_ItemSearchAndNodes',nodeId,function(e,rs){
            ItemsAndNodes.set(rs);
        })
    }
})
Template.itemsByNode.helpers({
    browseNodes : function(){
        return SubBrowseNodes.get();
    },
    items : function(){
        return ItemsAndNodes.get()
    }
})