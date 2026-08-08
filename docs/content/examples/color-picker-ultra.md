# ColorPicker Ultra

::: demo ColorPickerWithGradient.vue
:::

This example is built on [`@vuelor/gradient`](https://www.npmjs.com/package/@vuelor/gradient), which provides the gradient parsing, the stops slider and the stop controls on top of `@vuelor/picker`.

Installed with the [shadcn-vue CLI](/guide/cli)? Both packages and the `--drop-shadow-vuelor-thumb` token are added for you automatically. For a manual install, add `@vuelor/gradient` alongside `@vuelor/picker`, make sure Tailwind scans both packages, and add the gradient thumb shadow in `index.css` (TailwindCSS 4):

```css
@import "tailwindcss";

@theme {
  /* Used for gradient picker slider thumbs only */
  --drop-shadow-vuelor-thumb: 0px 0px .5px #00000054, 0px 1px 3px #00000026;
}
```

or `tailwind.config.js` (TailwindCSS 3):

```js
export default {
  theme: {
    extend: {
      dropShadow: {
        /* Used for gradient picker slider thumbs only */
        'vuelor-thumb': ['0px 0px .5px #00000054', '0px 1px 3px #00000026']
      }
    },
  }
}
```
