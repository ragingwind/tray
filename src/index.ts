import * as opn from 'opn';
import * as tray from './tray';

(async () => {
	const app = await tray.launch();

	app.addMenuItem('Open Google', 1, async () => {
		opn('https://google.com');
	});

	app.addMenuItem('Quit', 2, () => {
		app.stop();
		process.exit(0);
	});

	app.run();
})();
