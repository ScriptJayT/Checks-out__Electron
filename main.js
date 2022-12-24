const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

const is_mac = process.platform == "darwin";
const is_windows = process.platform == "win32";
const is_linux = process.platform == "linux";

const is_dev = process.env.NODE !== "production";

const my_main_menu = [
	{
		label: "App",
		submenu: [
			{
				label: "Quit",
				role: "quit",
				accelerator: is_mac ? "Cmd+W" : "Ctrl+W",
			},
			{
				label: "Reload",
				role: "forceReload",
				accelerator: is_mac ? "Cmd+R" : "Ctrl+R",
			},
		],
	},
];

function create_window(_name) {
	const my_window = new BrowserWindow({
		title: "My Lab",
		width: 1000,
		height: 750,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	my_window.loadFile(path.join(__dirname, `./front/${_name}.html`));

	if (!is_dev) return;
	const dev = new BrowserWindow();
	my_window.webContents.setDevToolsWebContents(dev.webContents);
	my_window.webContents.openDevTools({ mode: "detach" });
}

function set_menu(_menu) {
	const M = Menu.buildFromTemplate(_menu);
	Menu.setApplicationMenu(M);
}

app.on("ready", () => {
	create_window("index");

	set_menu(my_main_menu);

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) create_window("index");
	});
});

app.on("window-all-closed", () => {
	if (!is_mac) {
		app.quit();
	}
});
