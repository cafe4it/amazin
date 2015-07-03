if(Meteor.isServer){
    Meteor.methods({
        amazon_ItemSearch : function(keywords){
            if(keywords && AmazonClient){
                console.log('begin')
                var rs = Async.runSync(function(done){
                    AmazonClient.itemSearch({
                        keywords: keywords,
                        searchIndex: 'HomeGarden',
                        responseGroup: 'TopSellers'
                    },function(err,results){
                        console.log(JSON.stringify(err))
                        done(err, results);
                    })
                })
                return {
                    code : '200',
                    data : rs.result
                }
            }
            return {
                code : '404',
                data : {}
            }
        }
    })
}