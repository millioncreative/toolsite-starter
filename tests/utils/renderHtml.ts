export function renderHtml(markup: string) {
  document.body.innerHTML = markup;
  return document.body;
}
