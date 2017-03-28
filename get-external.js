const translate = require('./translate');

module.exports = (options, file, i) => res => {
	const {
		statusCode, headers: {'content-type': contentType}
	} = res
	var data = ""
	res.on('data', chunk => data += chunk)
	res.on('end', () => translate(Object.assign({},
		options,
		{ text: data, it: i, filename: file.split(/\//g).pop() }
	)))
	res.on('error', console.error)
}
