/**
 * Remark plugins for the docs markdown pipeline.
 *
 * Both are exported as *factories*, not transformers: unified treats every
 * `remarkPlugins` entry as a plugin and invokes it to obtain the transformer.
 * Registering an already-built transformer (`[docsLinks({prefix})]`) makes
 * unified call the transformer itself with `tree === undefined`. Register them
 * as `[docsLinks, {prefix}]` / `[mermaidBlocks]`.
 */
import { visit } from 'unist-util-visit';

/**
 * Rewrites `docs:<slug>` link targets — the form authors use inside markdown,
 * where the active locale is unknown — into locale-correct absolute URLs.
 * Operates on the mdast tree, so it is a `link` node with `url`, not an
 * `element` with `properties.href`.
 */
export function docsLinks(options = {}) {
  const { prefix = '' } = options;
  return function transformer(tree) {
    visit(tree, 'link', (node) => {
      if (typeof node.url === 'string' && node.url.startsWith('docs:')) {
        node.url = `${prefix}${node.url.slice('docs:'.length)}/`;
      }
    });
  };
}

/**
 * Turns ```mermaid fences into the `<pre class="mermaid">` shape that
 * astro-mermaid's client script picks up and renders.
 *
 * The node must be `type: 'html'`, not `type: 'raw'`: rehype-raw only honours
 * nodes remark-parse produced for literal HTML, so a `raw` node reaches the
 * output HTML-escaped (`&#x3C;pre …>`) and never renders. Escaping the diagram
 * source is what astro-mermaid does too — it reads `textContent`, which
 * unescapes it again.
 */
export function mermaidBlocks() {
  return function transformer(tree) {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || node.lang !== 'mermaid') return;
      const escaped = node.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      parent.children[index] = { type: 'html', value: `<pre class="mermaid">${escaped}</pre>` };
    });
  };
}
