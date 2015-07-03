Template.admin_browsenodes.rendered = function(){
    document.title = 'Quản trị Browse Nodes | Amazin';
}

Template.admin_browsenodes.events({
    'click #btnQueryNodes' : function (e, t) {
        e.preventDefault();
        Meteor.call('updateBrowseNodes',function(err,rs){
            if(err) console.log('Err : ', err);
            Materialize.toast('Cập nhật thành công ' + rs + ' nodes',5000);
        })
    }
})