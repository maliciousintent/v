#!/usr/bin/env node
/*jshint node:true, indent:2, eqnull:true, laxcomma:true */

/**
 * Small script to automatically increment or set package version
 * Usage:
 *  $ v.js --help
 */
 
'use strict';

var program = require('commander')
  , coolog = require('coolog')
  , fs = require('fs')
  , readline = require('readline')
  ;


coolog.addChannel({ name: 'root', level: 'debug', appenders: ['console'] });

var logger = coolog.logger('cli')
  , data
  , version
  , mode = ''
  , rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  ;


program
  .option('-x, --print', 'Only print current version')
  .option('-i, --noinput', 'No input required from user (i.e.: not interactive)')
  .option('-p, --patch', 'Auto increment patch')
  .option('-m, --minor', 'Auto increment minor version and reset patch')
  .option('-M, --major', 'Auto increment mayor version and reset minor/patch')
  .option('-s, --set <M>.<m>.<p>', 'Manaully set version')
  .parse(process.argv);


if (fs.existsSync('package.json')) {
  mode = 'package.json';
  data = JSON.parse(fs.readFileSync('package.json'));
  
} else if (fs.existsSync('version.txt')) {
  mode = 'version.txt';
  data = {
    version: fs.readFileSync('version.txt', { encoding: 'utf8' })
  };
  
} else {
  logger.warn('ERROR: Either a valid package.json or version.txt file are required.');
  process.exit(1);
}


logger.log('Current version is', data.version);

if (program.print != null) {
  process.exit(0);
  return;
}
  
if (program.set != null) {
  data.version = program.set;
  logger.log('Version set to', data.version);
  
} else {
  if (data.version == null) {
    logger.warn('Error: please set an initial version using --set');
    process.exit(1);
    
  } else {
    
    version = data.version.split('.');
    
    if (program.major != null) {
      version[0] = parseInt(version[0], 10) + 1;
      version[1] = 0;
      version[2] = 0;
    } else {
      if (program.minor != null) {
        version[1] = parseInt(version[1], 10) + 1;
        version[2] = 0;
      } else {
        version[2] = parseInt(version[2], 10) + 1;
      }
    }
    
    
    data.version = version.join('.');
    logger.log('Version set to', data.version);
  }
}


if (program.noinput) {
  process.nextTick(_done);
  
} else {
  rl.question('What changed? ', function (line) {
    fs.appendFile('CHANGELOG.md', '* ' + new Date().toISOString() + ' ' + line + '\n');
    _done();
    rl.close();
  });
}


function _done() {
  if (mode === 'package.json') {
    fs.writeFileSync('package.json', JSON.stringify(data, null, 2));
  } else {
    fs.writeFileSync('version.txt', data.version);
  }
}

