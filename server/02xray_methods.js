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
                        href : '.c_name@href',
                        id : '.label.label-info.a2-node@text'
                    }])
                })(function(err,obj){
                    var nodes = {locale : locale,items : []};
                    nodes.items = _.map(obj.items, function(i){
                        var a = i.href,
                            a = a.substring(a.indexOf(nodes.locale)+3,a.lastIndexOf('/'));
                        return _.extend(i,{searchIndex : a});
                    })
                    done(err,nodes);
                });
            });
            return rs.result;
        }
    })
}