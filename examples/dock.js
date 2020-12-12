const { ConsoleDockTransport, colorFormatter, MasterLogger } = require('../build');

const dock = new ConsoleDockTransport({
	formatter: colorFormatter
});

const logger = new MasterLogger({
	transports: [ dock ]
});

logger.debug('lorem');
logger.info('ipsum');
logger.warn('dolor');
logger.error('sit amet');

dock.createRow();
dock.createRow();
dock.createRow();

setInterval(() => {
	for (let i = 0; i < dock.rows.length; ++i) {
		dock.rows[i].content = Math.random();
	}
}, 500);

let counter = 0;
setInterval(() => {
	logger.info(++counter);
}, 1000);
