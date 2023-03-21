import { D$ } from "../fn/dev.js";
import { S$, SA$ } from "../fn/dom.js";

/**
 * @description get the sheet-attribute off of buttons
 * @param {HTMLButtonElement} _btn
 * @returns {string} - Sheet
 */
const get_sheet = (_btn) => {
	return _btn.getAttribute("sheet") || "";
};
/**
 * @description fetch sheet and return its data
 * @param {string} _sheet
 * @returns {response} - string
 */
async function find_sheet(_sheet) {
	const path = `./sheets/${_sheet}.html`;
	const F = await fetch(path, {
		method: "GET",
	})
		.then((response) => {
			// D$(console.log, response);
			return response.text();
		})
		.then((data) => {
			return data;
		})
		.catch((error) => {
			D$(console.log, error);
			return "";
		});
	return F;
}

/**
 * @description convert string to html of header-main-footer
 * @param {*} _html
 * @returns {array} - object of header_data, main_data, footer_data
 */
const data_to_html = (_html) => {
	var parser = new DOMParser();
	var doc = parser.parseFromString(_html, "text/html");
	const header_data = S$("header-content", doc)?.innerHTML.trim() || "";
	const main_data = S$("main-content", doc)?.innerHTML.trim() || "";
	const footer_data = S$("footer-content", doc)?.innerHTML.trim() || "";
	return [header_data, main_data, footer_data];
};

export class page_loader {
	#header_slot;
	#main_slot;
	#footer_slot;

	#all_nav_btns;

	constructor() {
		this.#get_targets();
		this.#get_nav();
	}

	// query native elements
	#get_targets() {
		this.#header_slot = S$("#app-header content-slot");
		this.#main_slot = S$("#app-content content-slot");
		this.#footer_slot = S$("#app-footer content-slot");
	}
	#get_nav() {
		this.#all_nav_btns = SA$("#feature-nav [sheet]");
	}

	/**
	 * Fetch given sheet and render the data in the app
	 * @param {string} _sheet - sheet of data to fetch
	 * @param {HTMLButtonElement} _btn - button to turn on in the nav
	 * @returns {void}
	 */
	async #render(_sheet, _btn) {
		const data = await find_sheet(_sheet);
		// D$(console.log, data);
		if (!data) return;
		const [header_data, main_data, footer_data] = data_to_html(data);

		this.#header_slot.innerHTML = header_data;
		this.#main_slot.innerHTML = main_data;
		this.#footer_slot.innerHTML = footer_data;
	}

	/**
	 * @description checks to see if the loader has succesfully retrieved all nav btns and the content slots
	 * @returns {boolean}
	 */
	is_ready() {
		if (
			this.#all_nav_btns &&
			this.#header_slot &&
			this.#main_slot &&
			this.#footer_slot
		)
			return true;
		return false;
	}

	/**
	 * @description function to activate click events on nav-btns
	 */
	activate() {
		this.#all_nav_btns.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const sheet = get_sheet(btn);
				this.#render(sheet, btn);
			});
		});
	}
}