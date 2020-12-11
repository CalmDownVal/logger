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

dock.addRows(3);
setInterval(() => {
	for (let i = 0; i < 3; ++i) {
		dock.setRow(i, '' + Math.random());
	}
}, 500);

let counter = 0;
setInterval(() => {
	logger.info('' + (++counter));
}, 1000);
