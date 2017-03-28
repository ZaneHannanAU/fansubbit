const translate = require('./translate');

module.exports = (options, file, i) => res => {
	const {
		statusCode, headers: {'content-type': contentType}
	} = res
	res.on('data', data => translate(Object.assign({},
		options,
		{ text: data, it: i, filename: file.split(/\//g).pop() }
	)))
}
