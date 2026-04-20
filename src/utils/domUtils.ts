export function generateStableSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }

  const dataAttrs = Array.from(element.attributes).filter((a) =>
    a.name.startsWith("data-")
  );
  for (const attr of dataAttrs) {
    const selector = `${element.tagName.toLowerCase()}[${attr.name}="${CSS.escape(attr.value)}"]`;
    if (document.querySelectorAll(selector).length === 1) {
      return selector;
    }
  }

  if (element.classList.length > 0) {
    const classes = Array.from(element.classList)
      .map((c) => `.${CSS.escape(c)}`)
      .join("");
    const selector = `${element.tagName.toLowerCase()}${classes}`;
    if (document.querySelectorAll(selector).length === 1) {
      return selector;
    }
  }

  return buildDomPath(element);
}

function buildDomPath(element: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.documentElement) {
    let part = current.tagName.toLowerCase();

    if (current.id) {
      parts.unshift(`#${CSS.escape(current.id)}`);
      break;
    }

    if (current.classList.length > 0) {
      part += Array.from(current.classList)
        .map((c) => `.${CSS.escape(c)}`)
        .join("");
    }

    const parent: HTMLElement | null = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (s): s is HTMLElement => s.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        part += `:nth-of-type(${index})`;
      }
    }

    parts.unshift(part);
    current = parent;
  }

  return parts.join(" > ");
}

export function isElementVisible(el: HTMLElement): boolean {
  const style = getComputedStyle(el);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0"
  );
}
