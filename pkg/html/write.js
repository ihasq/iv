const h = ({ raw }, ...val) => [raw, val];

const hTempRefMap = new WeakMap();

const hTempMap = {};

let strixRequestId = '';

const writeLoopProcess = () => {
    strixRequestId = window.requestAnimationFrame(writeLoopProcess);
};

const write = (container, template) => {
};
