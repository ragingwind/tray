import * as $ from 'nodobjc';

class MacTray {
	private pool: any;
	private app: any;
	private delegate: any;
	private statusBar: any;
	private statusMenu: any;
	private handlers: any = {};

	constructor() {
		$.import('Cocoa');

		this.pool = $.NSAutoreleasePool('alloc')('init');
		this.app = $.NSApplication('sharedApplication');
		this.delegate = $.NSObject.extend('AppDelegate');
		this.statusBar = $.NSStatusBar('systemStatusBar')('statusItemWithLength', -1);
		this.statusMenu = $.NSMenu('alloc')('init');
		this.handleCallback = this.handleCallback.bind(this);

		this.delegate.addMethod('handleCallback:', 'v@:@', this.handleCallback);
		this.delegate.addMethod('applicationDidFinishLaunching:', 'v@:@', (_, _cmd, _notif) => {
			this.statusBar('setTitle', $.NSString('stringWithUTF8String', '⚪'));
			this.statusBar('setMenu', this.statusMenu);
		});
		this.delegate.register();

		this.app('setDelegate', this.delegate('alloc')('init'));
		this.app('activateIgnoringOtherApps', true);
	}

	addMenuItem(title: string, tag: number, handler) {
		const m = $.NSMenuItem('alloc')(
			'initWithTitle', $.NSString('stringWithUTF8String', title),
			'action', 'handleCallback:',
			'keyEquivalent', $.NSString('stringWithUTF8String', '')
		)
		m('setTag', tag);

		this.statusMenu('addItem', m);
		this.handlers[tag] = handler;

		return m;
	}

	handleCallback(_self, _cmd, sender) {
		const tag = sender('tag');
		if (this.handlers[tag]) {
			this.handlers[tag]();
		}
	}

	run() {
		this.app('run');
	}

	stop() {
		this.statusMenu('removeAllItems')
		this.statusMenu('release');
		this.statusBar('setMenu', null);
		$.NSStatusBar('systemStatusBar')('removeStatusItem', this.statusBar)
		this.statusBar('release');
	}
}

let macTray: MacTray;

export function launch() {
	return new Promise<MacTray>(resolve => {
		if (!macTray) {
			macTray = new MacTray;
		}

		resolve(macTray);
	});
}
