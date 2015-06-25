frontRoutes.route('/',{
    action : function(params, query){
        FlowLayout.render('frontLayout',{main : 'home'});
    }
})