import { $ } from "jsr:@ihasq/esptr@0.1.2"

const REGISTER_FN = (prop, value, ref) => {
	return BUF_VALUE.PTR_IDENTIFIER in window
		? BUF_VALUE.watch(newValue => ref.setAttribute(prop, newValue))
		: ref.setAttribute(prop, newValue)
	;
};

export const on = new Proxy(
	{},
	{
		get: (t, prop) => prop == "toString"
			? () => $((value, ref) => Object.keys(value).forEach(x => ref.addEventListener(x, value[x], { passive: true })))
			: $((value, ref) => ref.addEventListener(prop, value, { passive: true }))
	}
)

