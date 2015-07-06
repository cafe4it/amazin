if (Meteor.isServer) {
    Meteor.methods({
        'xRay_getBrowseNodes': function (locale, url) {
            var locale = locale || 'us',
                url = url || 'http://www.findbrowsenodes.com/us';

            var rs = Async.runSync(function (done) {
                var xr = Xray();
                xr(url, {
                    items: xr('div.hn', [{
                        name: '.c_name@text',
                        href: '.c_name@href',
                        id: '.label.label-info.a2-node@text'
                    }])
                })(function (err, obj) {
                    var nodes = {locale: locale, items: []};
                    nodes.items = _.map(obj.items, function (i) {
                        var a = i.href,
                            a = a.substring(a.indexOf(nodes.locale) + 3, a.lastIndexOf('/'));
                        return _.extend(i, {searchIndex: a});
                    })
                    done(err, nodes);
                });
            });
            return rs.result;
        },
        'xRay_getAmazonCategories': function () {
            var url = 'http://www.amazon.com',
                userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:38.0) Gecko/20100101 Firefox/38.0';
            var rs = Async.runSync(function (done) {
                var xr = Xray();
                xr(url, {
                    items: xr('select#searchDropdownBox option', [{
                        text: '@text',
                        value: '@value'
                    }])
                })(function (err, obj) {
                    if (err) console.log(err);
                    var items = _.map(obj.items, function (i) {
                        return _.extend(i, {text: encodeURI(i.text)});
                    })
                    done(null, items)
                })
            })
            return rs.result;
        },
        xRay_searchAmazon: function (catId, keyword,page) {
            check(catId, String);
            check(keyword, String);
            check(page,Number);
            var page = page || 1;
            var templateUrl = _.template('http://www.amazon.com/s/ref=ref=sr_pg_<%=page%>?url=<%=category%>&field-keywords=<%=keyword%>');
            var cat = AmazonCategories.findOne({_id: catId});
            if (cat) {

                var rs = Async.runSync(function (done) {
                    var xr = Xray(),
                        url = encodeURI(templateUrl({category: cat.value, keyword: keyword,page : page}));

                    xr(url, {
                        title: 'title',
                        items: '#s-results-list-atf@html'
                    })
                    (function (err, obj) {
                        if (err)console.log(err);
                        done(null, obj);
                    })
                })
                return rs.result;
            }
        },
        scrapy_searchAmazon: function (catId, keywords) {
            this.unblock();
            check(catId, String);
            check(keywords, String);
            var templateUrl = _.template('http://www.amazon.com/s/ref=nb_sb_ss_ime_i_1_5?url=<%=category%>&field-keywords=<%=keywords%>');
            var cat = AmazonCategories.findOne({_id: catId});
            if (cat) {
                var rs = Async.runSync(function (done) {
                    var url = encodeURI(templateUrl({category: cat.value, keywords: keywords})),
                        model = {
                            title: 'title',
                            resultCount: '#s-result-count',
                            totalPages : 'span.pagnDisabled',
                            display: {
                                selector: 'ul#s-results-list-atf',
                                get: 'class'
                            },
                            items: {
                                ASIN: {
                                    selector: 'li.s-result-item',
                                    get: 'data-asin'
                                },
                                Title: {
                                    selector: '.a-link-normal.s-access-detail-page.a-text-normal',
                                    get: 'title'
                                },
                                ShortTitle: '.a-link-normal.s-access-detail-page.a-text-normal',
                                Thumbnail: {
                                    selector: '.s-access-image.cfMarker',
                                    get: 'src'
                                },
                                Price: {
                                    selector: 'span.s-price',
                                    get: 'text'
                                },
                                Category: {
                                    selector: 'div.a-span5 a.a-size-small.a-link-normal.a-text-normal span.a-text-bold',
                                    get: 'text'
                                }
                            }
                        }
                    ScrapyApi.scrape(url, model, function (err, result) {
                        if (err) console.log(err);
                        if (_.isNull(result.resultCount)) {
                            done(null, _.extend(result,{resultCount : 'NOTFOUND',totalPages : -1}));
                        } else {
                            var keys = ['asin', 'title', 'shortTitle', 'thumbnail', 'price', 'category'];
                            if (_.isArray(result.items.ASIN) && _.isArray(result.items.Title)) {
                                var values = _.zip(result.items.ASIN, result.items.Title, result.items.ShortTitle, result.items.Thumbnail, result.items.Price, result.items.Category);
                                var items = _.map(values, function (v) {
                                    return _.object(keys, v);
                                });
                                result = _.extend(result, {items: items})
                            } else {
                                if (_.isObject(result.items)) {
                                    var values = _.values(result.items),
                                        item = _.object(keys, values);
                                    result = _.extend(result, {items: [item]});
                                }
                            }
                            var display = (result.display.indexOf('s-grid-view') > 0) ? 's_grid_view' : 's_list_view',
                                result = _.extend(result, {display: display});
                            done(null, result);
                        }
                    })
                });
                return rs.result;
            }
        }
    })
}