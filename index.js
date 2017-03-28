#!/bin/env node
var fs = require('mz/fs'),
    options = { from: 'ja', to: 'en' },
    http = require('http'),
    https = require('https'),
    url = require('url'),
    getExt = require('./get-external'),
    translate = require('./translate')

process.argv.slice(2).forEach(dosub)

function dosub(file, i) {
	try {
		if (/^{.*}$/i.test(file))
			return options = Object.assign({},
				options,
				JSON.parse(file)
			)
		if (/\.json$/i.test(file))
			return options = Object.assign({},
				options,
				require(file)
			)
		if (/^https:/i.test(file))
			return https.get(file, getExt(options, file, i))
		if (/^http:/i.test(file))
			return http.get(file, getExt(options, file, i))
	} catch (e) {}
	return fs.readFile(file, 'utf8')
		.then()
		.then(text => translate(Object.assign({},
			options,
			{ text: data, it: i, filename: file }
		)))
		.catch(console.error)
}
