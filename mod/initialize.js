/**
 * 
 * @param { StrixHTMLElement } StrixHTMLElement 
 * @param { object } propertyObject 
 * @param { WeakMap } TSAStructureKeyMap
 * @param { object } TSAStructureMap
 */

export const initializeStrixHTMLElement = (
	StrixHTMLElement,
	propertyObject,

	TSAStructureKeyMap,
	TSAStructureMap,
) => {

	let elementType = undefined;

	let resultBuffer = StrixHTMLElement(propertyObject);

	if(Array.isArray(resultBuffer)) {

		elementType = "raw" in resultBuffer? "fragment" : "instance";

		const [ TSARef, ValueRef ] = elementType === "fragment"
			? [ StrixHTMLElement(), resultBuffer ]
			: [ resultBuffer, StrixHTMLElement() ];
		
		// パース済のASTオブジェクトを取得
	}
}