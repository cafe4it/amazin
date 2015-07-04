Template.itemsByNode.onCreated(function(){
    ItemsAndNodes = new ReactiveVar();
    var self = this;
    this.autorun(function(c){
        var nodeId = FlowRouter.getParam('id');
        if(nodeId){
            Meteor.call('amazon_ItemSearchAndNodes',nodeId,function(e,rs){
                ItemsAndNodes.set(rs);
            })
        }
    })
})