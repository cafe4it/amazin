Template.registerHelper('isReady',function(sub){
    if(sub){
        return FlowRouter.subsReady(sub)
    }else{
        return FlowRouter.subsReady();
    }
});

Template.registerHelper('shortTitle',function(Title){
    return (Title.length <= 100) ? Title : Title.substring(0,97) + '...';
})