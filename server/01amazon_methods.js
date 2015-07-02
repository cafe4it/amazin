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
        },
        apac_ItemSearch : function (keywords) {
            var rs = Async.runSync(function(done){
                opHelper.execute('ItemSearch', {
                    'SearchIndex': 'Books',
                    'Keywords': keywords,
                    'ResponseGroup': 'ItemAttributes,Offers,Images'
                }, function(err, results) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
                    done(err,results);
                });
            })
            return rs.result;
        },
        amazon_SearchEngine : function (Operation,Parameters) {
            check(Operation,String);
            check(Parameters, Object);
            switch(Operation){
                default : //ItemSearch
                    var rs = Async.runSync(function(done){
                        opHelper.execute(Operation,Parameters,function(err,results){
                            done(err,results)
                        })
                    });
                    return rs.result;
                    break;
            }
        }
    })
}