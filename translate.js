const gta = require('google-translate-api'),
      fs = require('mz/fs')

const unsafe = /^(\d+(?::\d+:\d+[\.,]\d+ --> \d+:\d+:\d+[\.,]\d+)?)$/gm
// Lines that are not safe to translate.
// In this case, if it only has numbers or a time stamp it's unsafe, so remove and add back later.


const translate = module.exports = (
	o = {from: 'ja', to: 'en', text: 'ばか！'.repeat(3), }
) => {
	o.unsafeTranslate = []
	o.text.replace(unsafe, (match, line) => {
		o.unsafeTranslate.push(line)
		return '\uFFFC'
	})

	gta(o.text, o)
		.then(res => res.text
			.replace(/\uFFFC/g, () => o.unsafeTranslate.shift())
			// adds back the text we just removed lol
		)
		// .then(console.log)
		.then(text => fs.writeFile(
			`${o.path}.${o.from}_${o.to}`,
			text,
			o.filename
		))
		.catch(console.error)
}
