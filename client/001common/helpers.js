Template.registerHelper('isReady',function(sub){
    if(sub){
        return FlowRouter.subsReady(sub)
    }else{
        return FlowRouter.subsReady();
    }
});

Template.registerHelper('truncateCategory',function(str){
    return (_.isNull(str) || _.isUndefined(str) || _.isEmpty(str)) ? '' : str.substring(0,str.length-1);
});

Template.registerHelper('noEmptyOrNull',function(str){
    return (_.isNull(str) || _.isUndefined(str) || _.isEmpty(str)) ? '' : str
});