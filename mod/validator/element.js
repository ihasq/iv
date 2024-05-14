import { Error, TypeError } from "../global"

export const validateStrixHTMLElement = (STRIX_HTML_ELEMENT) => {

	const CHARCODE_CACHE = STRIX_HTML_ELEMENT.name?.[0]?.charCodeAt(0);

	switch(false) {

		// StrixHTMLElementは関数です
		case (typeof STRIX_HTML_ELEMENT === "function"): {
			throw new TypeError("Element must be defined with function");
		}

		// StrixHTMLElementは名前を持つ関数です
		case (CHARCODE_CACHE): {
			throw new Error("Element name invalid: must have name property");
		}
		
		// StrixHTMLElementとして当てはめる関数は、nameプロパティの一文字目がアルファベットの大文字（A~Z）です
		case (65 <= CHARCODE_CACHE && CHARCODE_CACHE <= 90): {
			throw new Error("Element name invalid: must be started with uppercase");
		}

		default: {
			return true;
		}
	}
}