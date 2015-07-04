if (Meteor.isServer) {
    Meteor.methods({
        amazon_ItemSearch: function (keywords) {
            if (keywords && AmazonClient) {
                console.log('begin')
                var rs = Async.runSync(function (done) {
                    AmazonClient.itemSearch({
                        keywords: keywords,
                        searchIndex: 'HomeGarden',
                        responseGroup: 'TopSellers'
                    }, function (err, results) {
                        console.log(JSON.stringify(err))
                        done(err, results);
                    })
                })
                return {
                    code: '200',
                    data: rs.result
                }
            }
            return {
                code: '404',
                data: {}
            }
        },
        amazon_BrowseNodeLookup: function (browseNodeId, ResponseGroup) {
            var ResponseGroup = ResponseGroup || 'BrowseNodeInfo';
            check(browseNodeId, Number);
            var node = BrowseNodes.findOne({nodeId : browseNodeId});
            if (opHelper && node) {
                var rs = Async.runSync(function (done) {
                    opHelper.execute('BrowseNodeLookup',{
                        BrowseNodeId : node.nodeId,
                        ResponseGroup : ResponseGroup
                    },function(error, results){
                        done(error, results);
                    })
                });
                return rs.result;
            }
        },
        amazon_ItemSearchAndNodes : function(BrowseNodeId){
            check(BrowseNodeId,Number);
            var node = BrowseNodes.findOne({nodeId : BrowseNodeId});
            if(opHelper && node){
                var rs = Async.runSync(function(done){
                    opHelper.execute('ItemSearch',{
                        BrowseNode : node.nodeId,
                        SearchIndex : node.searchIndex
                    },function(error ,results){
                        done(error, results);
                    })
                });
                return rs.result;
            }
        }
    })
}