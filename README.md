v.js
====

Increase / set [version numbers](http://semver.org/) in package.json.


### Install ###

```bash
$ npm -g install v.js
```

### Use ###

```bash
v -h   # Help

v -p   # Increment Patch number (default if no option is provided)
v -m   # Increment Minor version and reset Patch number
v -M    # Increment Major version and reset Minor and Patch number
v --set 1.2.3 # Manually set version
```
