Template.itemsByNode.onCreated(function(){
    var self = this;
    self.SubBrowseNodes = new ReactiveVar();
    self.Items = new ReactiveVar();
    self.autorun(function(c){
        var nodeId = FlowRouter.getParam('nodeId'),
            searchIndex = FlowRouter.getParam('searchIndex');
        Session.set('selectedCategory',nodeId);

        if(nodeId){
            nodeId = parseInt(nodeId);
            Meteor.call('amazon_BrowseNodeLookup',searchIndex,nodeId,function(e,rs){
                self.SubBrowseNodes.set(rs);
            });
            Meteor.call('amazon_ItemSearchAndNodes',nodeId,searchIndex,function(e,rs){
                self.Items.set(rs);
            });

        }
    })
});


Template.itemsByNode.helpers({
    subBrowseNodes : function(){
        return Template.instance().SubBrowseNodes.get();
    },
    searchResult : function(){
        return Template.instance().Items.get()
    }
})