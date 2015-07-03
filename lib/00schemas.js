BrowseNodes = new Meteor.Collection('browsenodes');

var Schemas = {};

Schemas.BrowseNode = new SimpleSchema({
    locale : {
        type : String
    },
    text1 : {
        type : String
    },
    text2 : {
        type : String
    },
    nodeId : {
        type : Number
    }
});

BrowseNodes.attachSchema(Schemas.BrowseNode);

