export const href = ({ ref }, url) => ref.addEventListener("click", () => open(url, "_blank", "noopenner norefferer"), { passive: true });