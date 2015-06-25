Package.describe({
    name: 'cafe4it:apac',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({'amazon-product-api' : '0.2.3'});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.addFiles('apac.js','server');

    if('undefined' === typeof amazon){
        api.export('amazon');
    }
});