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
        },
        'xRay_getAmazonCategories' : function(){
            var url = 'http://www.amazon.com',
                userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:38.0) Gecko/20100101 Firefox/38.0';
            var rs = Async.runSync(function(done){
                var xr = Xray();
                xr(url,{
                    items : xr('select#searchDropdownBox option',[{
                        text : '@text',
                        value : '@value'
                    }])
                })(function(err,obj){
                    if(err) console.log(err);
                    var items = _.map(obj.items, function(i){
                        return _.extend(i,{text : encodeURI(i.text)});
                    })
                    done(null,items)
                })
            })
            return rs.result;
        }
    })
}