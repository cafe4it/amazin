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
        amazon_BrowseNodeLookup: function (searchIndex, browseNodeId, ResponseGroup) {
            var ResponseGroup = ResponseGroup || 'BrowseNodeInfo';
            check(browseNodeId, Number);
            check(searchIndex, String);
            var node = BrowseNodes.findOne({searchIndex: searchIndex});
            if (opHelper && node) {
                try {
                    var rs = Async.runSync(function (done) {
                        opHelper.execute('BrowseNodeLookup', {
                            BrowseNodeId: browseNodeId,
                            ResponseGroup: ResponseGroup
                        }, function (error, results) {
                            if (error) console.log(error);
                            var obj = {},
                                browseNodes = results.BrowseNodeLookupResponse.BrowseNodes[0];
                            if (browseNodes.Request[0].IsValid[0] == "True" && !_.has(browseNodes.Request[0], 'Errors')) {
                                var nodes = _.map(browseNodes.BrowseNode[0].Children[0].BrowseNode, function (n) {
                                    return _.extend(n, {searchIndex: node.searchIndex});
                                });
                                obj = {
                                    isValid: true,
                                    data: nodes
                                }
                            } else {
                                obj = {
                                    isValid: false,
                                    data: []
                                }
                            }
                            done(null, obj);
                        })
                    });
                    return rs.result;
                } catch (Ex) {
                    console.log('Exception : ', Ex)
                }
            }
        },
        amazon_ItemSearchAndNodes: function (BrowseNodeId, searchIndex) {
            check(BrowseNodeId, Number);
            check(searchIndex, String);
            var node = BrowseNodes.findOne({searchIndex: searchIndex});
            if (opHelper && node) {
                try {
                    var rs = Async.runSync(function (done) {
                        opHelper.execute('ItemSearch', {
                            BrowseNode: BrowseNodeId,
                            SearchIndex: node.searchIndex,
                            ResponseGroup: 'Images,ItemAttributes,Offers'
                        }, function (error, results) {
                            //console.log(JSON.stringify(results));
                            var obj = {},
                                ItemSearchResponse = results.ItemSearchResponse.Items[0],
                                Request = ItemSearchResponse.Request[0];
                            obj.IsValid = (Request.IsValid[0] == "True") ? true : false;
                            if (obj.IsValid && !_.has(Request, 'Errors')) {
                                obj.TotalResults = ItemSearchResponse.TotalResults[0];
                                obj.Items = _.map(ItemSearchResponse.Item, function (i) {
                                    var ItemAttributes = i.ItemAttributes[0];
                                    var item = {
                                        ASIN: i.ASIN[0],
                                        Title: ItemAttributes.Title[0],
                                        Thumbnail: i.MediumImage[0].URL[0],
                                        Brand: (_.has(ItemAttributes, 'Brand')) ? ItemAttributes.Brand[0] : ''
                                    }
                                    if (_.has(i, 'Offers') && _.has(i.Offers[0],'Offer')) {
                                        var Offers = i.Offers[0].Offer[0],
                                            Offer = {
                                                Condition: Offers.OfferAttributes[0].Condition[0],
                                                Price: Offers.OfferListing[0].Price[0].FormattedPrice[0],
                                                AmountSaved: (_.has(Offers.OfferListing[0], 'AmountSaved')) ? Offers.OfferListing[0].AmountSaved[0].FormattedPrice[0] : 0,
                                                Availability: (_.has(Offers.OfferListing[0], 'Availability')) ? Offers.OfferListing[0].Availability[0] : ''
                                            }
                                        item = _.extend(item,{Offer : Offer});
                                    }
                                    return item;
                                })
                            }
                            done(error, obj);
                        })
                    });
                    return rs.result;
                } catch (Ex) {
                    console.log('Exception : ', Ex)
                }
            }
        }
    })
}