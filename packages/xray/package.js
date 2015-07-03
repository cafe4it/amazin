Package.describe({
    name: 'cafe4it:xray',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: ' The next web scraper. See through the <html> noise.http://lapwinglabs.com',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/lapwinglabs/x-ray',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({'x-ray':'2.0.1'});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.addFiles('xray.js', 'server');
    api.export('Xray', 'server');
});