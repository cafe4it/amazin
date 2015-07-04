Template.home.rendered = function(){
    $(document).ready(function(){
        Meteor.setTimeout(function(){$('select').material_select();},300);
    })
}

var getPaginatedItems = function (items, page) {
    var page = page || 1,
        per_page = 13,
        offset = (page - 1 ) * per_page,
        paginatedItems = _.rest(items, offset).slice(0, per_page);
    return paginatedItems;
}

Template.home.helpers({
    browseNodes : function(param){
        var param = param || 0,
            nodes = BrowseNodes.find({},{sort : {text2:1}}).fetch();
        if(param == 1){
            return nodes
        }else{
            var totalPages = Math.ceil(nodes.length / 13);
            nodes = _.map(nodes,function(node){
                var param = {id : node._id};
                return _.extend(node, {href : FlowRouter.path('itemsByNode',param)});
            })
            if(totalPages == 3){
                return {
                    name : 'browseNodes_3',
                    data : nodes
                }
            }
        }
    }
})

Template.browseNodes_3.helpers({
    browseNodes : function (page) {
        var nodes = Template.instance().data;
        return getPaginatedItems(nodes,page);
    }
});

Template.browseNodes_3.rendered = function(){
    $(document).ready(function(){
        //Materialize.showStaggeredList('.nodes_item');
        $('.tooltipped').tooltip({delay: 50});
    })
}