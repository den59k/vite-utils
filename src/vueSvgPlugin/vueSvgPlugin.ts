import { readFileSync } from 'fs'
import { compileTemplate } from '@vue/compiler-sfc';
import { Plugin } from 'vite';

export function vueSvgPlugin(): Plugin {

  return {
    name: 'svg-component',
    transform(_code, id) {
      const [path, query] = id.split('?');
      if (!path.endsWith(".svg") || query != 'svg-component')
          return;

      const text = readFileSync(path, "utf-8");
      const parsedText = text
        .replace(/"#[0-9A-Za-z]+"/g, '"currentColor"')
        .replace(/"white"/g, '"currentColor"')
        .replace(/"black"/g, '"currentColor"')
        .replace(/fill-opacity=".+?"/g, "")
        .trim()

      let { code } = compileTemplate({
        id: path,
        source: parsedText,
        transformAssetUrls: false,
        filename: path
      })

      code = code.replace('export function render', 'function render');
      code += `\nexport default { render };`;

      return code
    }
  }
};
