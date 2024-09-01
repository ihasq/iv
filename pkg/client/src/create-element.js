import { random } from 'jsr:@ihasq/random@0.1.6';

const BASE_DF = document.createDocumentFragment(),
    CMD_ASSIGN_DIRECT = Symbol('CMD'),
    CMD_ASSIGN_OBJECT = Symbol('CMD'),
    CMD_ASSIGN_PTR = Symbol('CMD'),
    CMD_ASSIGN_RAW = Symbol('CMD');

const resolveFragment = (
    [TemplateStringsArray, TemplateValuesArray, STRIX_HTML_FRAGMENT],
    commandBuffer,
) => {
    commandBuffer.push([
        CMD_ASSIGN_DIRECT,
        TemplateStringsArray[0],
    ]);

    TemplateValuesArray.forEach((x, i) => {
        if (Array.isArray(x) && x[2] === STRIX_HTML_FRAGMENT) {
            resolveFragment(x, commandBuffer);
            commandBuffer.push([
                CMD_ASSIGN_DIRECT,
                TemplateStringsArray[i + 1],
            ]);
        } else {
            commandBuffer.push([
                typeof x == 'object'
                    ? x[Symbol.for('PTR_IDENTIFIER')] ? CMD_ASSIGN_PTR : CMD_ASSIGN_OBJECT
                    : CMD_ASSIGN_RAW,
                TemplateStringsArray[i + 1],
                x,
            ]);
        }
    });
};

/**
 * @param { any[] } template
 * @returns { any[] }
 */

const resolveFragmentRoot = (template) => {
    const CMD_BUFFER = [];
    resolveFragment(template, CMD_BUFFER);
    return CMD_BUFFER;
};

/**
 * @param { any[] } fragment
 * @returns { NodeList }
 */

export const createElement = (fragment) => {
    const CMD_BUFFER = resolveFragmentRoot(fragment),
        BASE_TEMP = document.createElement('div'),
        PARSER_UUID = `strix-${random(32)}`,
        PARSER_TOKEN_ATTR = `${PARSER_UUID}-attr`,
        PARSER_TOKEN_PTR = `${PARSER_UUID}-ptr`,
        CONCATTED_TEMPLATE = CMD_BUFFER
            .map(
                ([CMD, TEMP_STR, TEMP_VAL], i) =>
                    CMD == CMD_ASSIGN_DIRECT
                        ? TEMP_STR
                        : CMD == CMD_ASSIGN_OBJECT
                        ? ` ${PARSER_TOKEN_ATTR}="${i}"${TEMP_STR}`
                        : CMD == CMD_ASSIGN_PTR
                        ? `<${PARSER_UUID} ${PARSER_TOKEN_PTR}="${i}"></${PARSER_UUID}>${TEMP_STR}`
                        : TEMP_VAL + TEMP_STR,
            )
            .join('');

    BASE_DF.appendChild(BASE_TEMP);
    BASE_TEMP.innerHTML = CONCATTED_TEMPLATE;
    BASE_TEMP.querySelectorAll(`[${PARSER_TOKEN_ATTR}], [${PARSER_TOKEN_PTR}]`).forEach((targetRef) => {
        if (targetRef.hasAttribute(PARSER_TOKEN_ATTR)) {
            const ATTR_BUFFER = CMD_BUFFER[Number(targetRef.getAttribute(PARSER_TOKEN_ATTR))][2];

            Reflect.ownKeys(ATTR_BUFFER).forEach((attrIndex) => {
                const ATTR_BUFFER_VALUE = ATTR_BUFFER[attrIndex];

                if (typeof attrIndex == 'symbol') {
                    window[attrIndex.toString()]?.(attrIndex)?.$(
                        ATTR_BUFFER[attrIndex],
                        targetRef,
                    );
                } else {
                    if (ATTR_BUFFER_VALUE?.[Symbol.for('PTR_IDENTIFIER')]) {
                        ATTR_BUFFER_VALUE.watch((newValue) => targetRef[attrIndex] = newValue);
                    } else {
                        targetRef[attrIndex] = ATTR_BUFFER_VALUE;
                    }
                }
            });
            targetRef.removeAttribute(PARSER_TOKEN_ATTR);
        } else {
            const PTR_BUFFER = CMD_BUFFER[Number(targetRef.getAttribute(PARSER_TOKEN_PTR))][2],
                TEXT_BUF = new Text();

            targetRef.replaceWith(TEXT_BUF);
            PTR_BUFFER.watch((newValue) => TEXT_BUF.textContent = newValue);
        }
    });

    return BASE_TEMP.childNodes;
};
