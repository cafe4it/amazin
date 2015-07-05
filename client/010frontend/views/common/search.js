Template.search_widget.onCreated(function(){
    var self = this;
    self.browseNodes = new ReactiveVar();

    self.autorun(function(){
        var locale = FlowRouter.getParam('locale') || 'us';
        var subs = self.subscribe('front_getAmazonCategories');
        if(subs.ready()){
            var nodes = AmazonCategories.find().fetch(),
                nodes = _.map(nodes,function(n){
                    return _.extend(n,{text : decodeURI(n.text)});
                })
            self.browseNodes.set(nodes);
        }
    })
})

Template.search_widget.helpers({
    browseNodes : function () {
        return Template.instance().browseNodes.get();
    }
})

Template.search_widget.rendered = function(){
    $(document).ready(function(){
        Meteor.setTimeout(function(){
            var selectedCategory = Session.get('selectedCategory') || FlowRouter.getParam('nodeId');
            if(selectedCategory){
                $('#sltCategories').val(selectedCategory);
            }
        },500);
    });
}

Template.search_widget.events({

})