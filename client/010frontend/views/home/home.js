var getPaginatedItems = function (items, page) {
    var page = page || 1,
        per_page = 13,
        offset = (page - 1 ) * per_page,
        paginatedItems = _.rest(items, offset).slice(0, per_page);
    return paginatedItems;
}

Template.home.onCreated(function(){
    Session.set('selectedCategory',undefined);
})

Template.home.helpers({
    browseNodes : function(param){
        var param = param || 0,
            nodes = BrowseNodes.find({},{sort : {text2:1}}).fetch();
        if(param == 1){
            return nodes
        }else{
            var totalPages = Math.ceil(nodes.length / 13);
            nodes = _.map(nodes, function (node) {
                var param = {nodeId: node.nodeId, searchIndex: node.searchIndex},
                    path = FlowRouter.path('itemsByNode', param);
                if(node.searchIndex === 'Apparel') path = '#';
                return _.extend(node, {href: path});

            })
            /*if (totalPages == 3) {
                return {
                    name: 'browseNodes_3',
                    data: nodes
                }
            }*/
            return {
                name : 'browseNodes_list',
                data : nodes
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

Template.browseNodes_list.helpers({
    browseNodes : function () {
        return Template.instance().data;
    }
})

Template.browseNodes_3.rendered = function(){
    $(document).ready(function(){

    })
}