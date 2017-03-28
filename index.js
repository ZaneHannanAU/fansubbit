#!/bin/env node
var fs = require('mz/fs'),
    options = { from: 'ja', to: 'en' },
    http = require('http'),
    https = require('https'),
    url = require('url'),
    getExt = require('./get-external'),
    translate = require('./translate')

if (process.argv.length > 2)
	process.argv.slice(2).forEach(dosub)
else translate()
function dosub(file, i) {
	try {
		if (/^{.*}$/i.test(file))
			return options = Object.assign({},
				options,
				JSON.parse(file)
			)
		else if (/\.json$/i.test(file))
			return options = Object.assign({},
				options,
				require(file)
			)
		else if (/^https:/i.test(file))
			return https.get(file, getExt(options, file, i))
		else if (/^http:/i.test(file))
			return http.get(file, getExt(options, file, i))
		else return fs.readFile(file, 'utf8')
			.then()
			.then(text => translate(Object.assign({},
				options,
				{ text: data, it: i, filename: file }
			)))
			.catch(console.error)
	} catch (e) {}
}
