export function getSingleDOM(id: string) {
  let dom: HTMLDivElement;
  const old = document.getElementById(id) as HTMLDivElement;
  if (old) {
    dom = old;
  } else {
    dom = document.createElement("div");
    dom.id = id;
    document.body.appendChild(dom);
  }
  return dom;
}
