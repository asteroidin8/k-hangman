export async function injectSVG(url, mountElement) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SVG load failed: ${url}`);
  }
  mountElement.innerHTML = await response.text();
}
