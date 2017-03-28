const gta = require('google-translate-api'),
      fs = require('mz/fs')

const unsafe = /^(\d+(?::\d+:\d+[\.,]\d+ --> \d+:\d+:\d+[\.,]\d+)?)$/gm
// Lines that are not safe to translate.
// In this case, if it only has numbers or a time stamp it's unsafe, so remove and add back later.


const translator = module.exports = (
	o = {from: 'ja', to: 'en', text: 'ばか！'.repeat(3), }
) => {
	console.warn(`Translating ${o.filename}.${o.from}_${o.to}...`);
	var unsafeTranslate = []
	var translate = o.text.replace(unsafe, (match, line) => {
		unsafeTranslate.push(line)
		console.log(
			"Unsafe to translate:", unsafeTranslate[ unsafeTranslate.length-1 ]
		);
		return '\uFFFC'
	}).split(/(?:\r?\n){2,}/g)
	var translated = []
	function writeFile(done) {
		const fullyTranslated = done
			.join('\r\n\r\n')
			.replace(/\uFFFC/g, () => unsafeTranslate.shift())
		return fs.writeFile(
			`${o.filename}.${o.from}_${o.to}`,
			fullyTranslated,
			'utf8',
			err => {
				if (err) throw err
				else console.log('Saved %s;\r\n\r\n', `${o.filename}.${o.from}_${o.to}`, fullyTranslated);
			})
	}
	console.warn(`${ " "
		// + JSON.stringify(unsafeTranslate.concat(translate), null, ' ')
	}\r\nMaking ${translate.length} requests${
		translate.length > 10 ? ', hold TIGHT!' : '.'
	}\r\n`);
	var ntranslated = 0
	translate.forEach((phrase, i) => {
		gta(phrase, o)
			.then(res => res.text)
			.then(text => {
				translated[i] = text
				console.log('  %d complete:\r\n%s\r\n------\r\n', i, text)
			})
			.then(() => translated.length === ++ntranslated ? writeFile( translated ) : null)
			.catch(console.error)
	})
}
