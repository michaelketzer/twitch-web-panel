const Discord = require('discord.js');
var api = require('twitch-api-v5');

const hook = new Discord.WebhookClient('640853129495314443', 'fProAs9FQehJ46LsnuD79QSMpfGRchjz2pdiQ1HQmkM4TxAbIGNyuHd-qe7rtJ5Z_6c8');
api.clientID = 'qmvupoh0dlw4kc0il1uvp7kynatftd';
const knownSlugs = []

function fetchClips() {
	api.clips.top({channel: 'shokztv', period: 'day'}, (err, res) => {
	        if(err) {
               		console.error(err);
		} else {
        		const newClips = res.clips.filter(({views, slug}) => !knownSlugs.includes(slug) && views >= 5);
			newClips.forEach(({title, url}) => hook.send(title + ': ' + url ));
		}
	});
}

setTimeout(fetchClips, 60000);
fetchClips();
