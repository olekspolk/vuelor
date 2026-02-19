# ColorPicker Ultra

::: demo ColorPickerWithGradient.vue
:::

Add a drop shadow styles in `index.css` (TailwindCSS 4)

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
