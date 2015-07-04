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
    icon : {
        type : String
    },
    nodeId : {
        type : Number,
        decimal : false
    },
    parentNodeId : {
        type : Number,
        decimal : false,
        optional : true
    },
    searchIndex : {
        type : String
    },
    updatedAt : {
        type : Date,
        autoValue : function(){
            return new Date;
        }
    }
});

BrowseNodes.attachSchema(Schemas.BrowseNode);

