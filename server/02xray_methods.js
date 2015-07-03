if(Meteor.isServer){
    Meteor.methods({
        'xRay_getBrowseNodes' : function(locale,url){
            var locale = locale || 'us',
                url = url || 'http://www.findbrowsenodes.com/us';

            var rs = Async.runSync(function(done){
                var xr = Xray();
                xr(url,{
                    items : xr('div.hn',[{
                        name : '.c_name@text',
                        id : '.label.label-info.a2-node@text'
                    }])
                })(function(err,obj){
                    var nodes = {locale : locale},
                        nodes = _.extend(nodes, {items : obj.items});
                    done(err,nodes);
                });
            });
            return rs.result;
        }
    })
}