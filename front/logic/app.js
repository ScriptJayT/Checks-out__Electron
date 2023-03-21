import { page_loader } from "./classes/loader.js";

console.log(E_system.mode);
console.log(E_system.platform);

//? Load Pager
{
	const page = new page_loader();
	if (page.is_ready()) {
		D$(console.log, "Page Loader: Ready");
		page.activate();
	} else D$(console.warn, "Page Loader not Ready");
}