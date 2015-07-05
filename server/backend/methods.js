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
        },
        updateAmazonCategories : function(){
            var categories = Meteor.call('xRay_getAmazonCategories');
            var rs = 0;
            _.each(categories,function(cat){
                AmazonCategories.upsert({value : cat.value},{
                    $set : {
                        text : cat.text,
                        vietnamese : cat.text,
                        value : cat.value
                    }
                });
                rs++;
            });
            return rs;
        }
    })
}