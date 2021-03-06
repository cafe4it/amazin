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
    });
    searchResult = new ReactiveVar({isDefault : true});
    paramsSearch = new ReactiveVar({});
})

Template.search_widget.helpers({
    browseNodes : function () {
        return Template.instance().browseNodes.get();
    },
    searchResult : function(){
        var sr = searchResult.get();
        console.log(sr);
        if(_.has(sr,'isDefault')){
            return {
                name : 'search_default',
                data : []
            }
        }

        if(_.has(sr,'isSearching')){
            return {
                name : 'search_loading',
                data : []
            }
        }

        if(!sr.isFound){
            return {
                name : 'search_notFound',
                data : []
            }
        }else{
            return {
                name : sr.data.display,
                data : sr
            }
        }
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
    'keyup #txtKeyword' : function(e,t){
        e.preventDefault();
        if(e.keyCode == 13){
           var keyword = $('#txtKeyword').val(),
               catId = $('#sltCategories').val();
            if(keyword.length <= 1) return;
            paramsSearch.set({
                catId : catId,
                keywords : keyword,
                page : 1
            });
            callSearch();
        }
    }
})

function callSearch(){
    var params = paramsSearch.get();
    $('#hasPagination').html('');
    if(params){
        searchResult.set({
            isSearching : true
        });
        Meteor.call('scrapy_searchAmazon',params.catId,params.keywords,params.page,function(err,rs){
            console.log(rs);
            searchResult.set({
                isFound : (rs.resultCount !== 'NOTFOUND'),
                data : rs
            });
            if(rs.totalPages > 0){
                $('#hasPagination').html('');
                Blaze.renderWithData(Template.pagination,{totalPages : rs.totalPages},$('#hasPagination')[0]);
            }
        });

    }
}

Template.s_grid_view.helpers({
    searchResult : function(){
        return Template.instance().data;
    }
});

Template.s_list_view.helpers({
    searchResult : function(){
        return Template.instance().data;
    }
})

Template.pagination.helpers({
    pages : function(){
        var data = Template.instance().data;
        if(data.totalPages && data.totalPages > 0){
            var p = [];
            for(var i = 1; i<=data.totalPages;i++){
                p.push({
                    text : i,
                    value : i
                });
            }
            return p;
        }
    }
});

Template.pagination.events({
    'change #sltPages' : function(e,t){
        e.preventDefault();
        var params = paramsSearch.get(),
            page = $('#sltPages').val();
        if(page !== params.page){
            paramsSearch.set(_.extend(params,{page : page}));
            callSearch();
        }
    }
});

Template.pagination.rendered = function(){
    $(document).ready(function(){
        Meteor.setTimeout(function(){
            $('#sltPages').val(paramsSearch.get().page);
        },1000)
    })
}