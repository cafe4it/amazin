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
                    var items = {locale : locale},
                        items = _.extend(items, {items : obj});
                    done(err,items);
                });
            });
            return rs.result;
        }
    })
}