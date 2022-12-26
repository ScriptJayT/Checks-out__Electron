const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("E_system", {
	platform: process.platform,
	mode: process.env.NODE !== "production",
});
