if(Meteor.isServer){
    Meteor.startup(function(){
        Meteor.Configs = EJSON.parse(Assets.getText('config.json'));
        if(_.has(Meteor.Configs,'AMAZON')){
            var AmzConfig = Meteor.Configs.AMAZON;
            AmazonClient = AMAZON.createClient({
                awsId: AmzConfig.Id,
                awsSecret: AmzConfig.Secret,
                awsTag: AmzConfig.Tag
            });
            opHelper = new apac.OperationHelper({
                awsId:     AmzConfig.Id,
                awsSecret: AmzConfig.Secret,
                assocId:   AmzConfig.Tag
                // xml2jsOptions: an extra, optional, parameter for if you want to pass additional options for the xml2js module. (see https://github.com/Leonidas-from-XIV/node-xml2js#options)
            });
        }
        if(AmazonCategories.find().count() == 0){
            Meteor.call('updateAmazonCategories');
        }
    })
}