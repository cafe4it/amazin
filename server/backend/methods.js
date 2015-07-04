if(Meteor.isServer){
    Meteor.methods({
        updateBrowseNodes : function(){
            var nodes = Meteor.call('xRay_getBrowseNodes');
            if(nodes){
                try{
                    var rs = 0;
                    _.each(nodes.items, function(i){
                        BrowseNodes.upsert({text1 : i.name, locale:nodes.locale},{
                            $set : {
                                locale : nodes.locale,
                                nodeId : i.id,
                                icon : 'label',
                                searchIndex : i.searchIndex,
                                text1 : i.name,
                                text2 : i.name
                            }
                        });
                        rs++;
                    });

                    return rs;
                }catch(ex){
                    console.log('Ex : ',ex);
                }
            }
        }
    })
}