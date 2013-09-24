var CssbeautifyCli = require('../lib/cssbeautify-cli'),
    filename = 'test.css',
    cssbeautifyCli,
    config = {
        indent: '123',
        autosemicolon: true,
        openbrace: "end-of-line"
    },
    fs = require('fs'),
    configFileName = './' + (new Date()).getTime() + '.json';

exports.missingValue = function (test) {
    ['-c', '-c=', '--config', '--config='].forEach(function (param) {

        process.argv = ['node', 'lol', '-f', filename, param];

        cssbeautifyCli = CssbeautifyCli()
            .parse()
            .process();

        test.strictEqual(typeof cssbeautifyCli.exit, 'object', 'bad exit object');
        test.strictEqual(cssbeautifyCli.exit.code, 1, 'bad exit code');

    });

    test.done();
};

exports.missingFile = function (test) {
    fs.writeFileSync(configFileName, JSON.stringify(config));

    ['-c', '-c=', '--config', '--config='].forEach(function (param) {
        process.argv = ['node', 'lol', '-f', filename, param, 'someNonexistingFile'];

        cssbeautifyCli = CssbeautifyCli()
            .parse()
            .process();

        test.strictEqual(typeof cssbeautifyCli.exit, 'object', 'bad exit object');
        test.strictEqual(cssbeautifyCli.exit.code, 1, 'bad exit code');
    });

    fs.unlinkSync(configFileName);

    test.done();
};

exports.correctlyRead = function (test) {
    fs.writeFileSync(configFileName, JSON.stringify(config));

    process.argv = ['node', 'lol', '-f', filename, '-c', configFileName];

    cssbeautifyCli = CssbeautifyCli()
        .parse()
        .process();

    test.strictEqual(typeof cssbeautifyCli.exit, 'undefined', 'bad exit object: ' + JSON.stringify(cssbeautifyCli.exit));
    test.equal(cssbeautifyCli.options.indent.length, config.indent);
    test.ok(/\ +/.test(cssbeautifyCli.options.indent));
    test.equal(cssbeautifyCli.options.autosemicolon, config.autosemicolon);
    test.equal(cssbeautifyCli.options.openbrace, config.openbrace);

    fs.unlinkSync(configFileName);

    test.done();
};

exports.commandLineOverrides = function (test) {
    var config = {
        indent: 4,
        autosemicolon: 'false',
        openbrace: 'separate-line'
    };

    fs.writeFileSync(configFileName, JSON.stringify(config));

    process.argv = ['node', 'lol',
        '-f', filename,
        '-c', configFileName,
        '-i', config.indent,
        '-a', config.autosemicolon,
        '-o', config.openbrace
    ];
console.log('local config: ', config);
    cssbeautifyCli = CssbeautifyCli()
        .parse()
        .process();

    test.strictEqual(typeof cssbeautifyCli.exit, 'undefined', 'bad exit object: ' + JSON.stringify(cssbeautifyCli.exit));
    test.equal(cssbeautifyCli.options.indent.length, config.indent);
    test.ok(/\ +/.test(cssbeautifyCli.options.indent));
    test.equal(cssbeautifyCli.options.autosemicolon, config.autosemicolon);
    test.equal(cssbeautifyCli.options.openbrace, config.openbrace);


    fs.unlinkSync(configFileName);

    test.done();
};