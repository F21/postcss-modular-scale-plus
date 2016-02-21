# PostCSS Modular Scale Plus [![wercker status](https://app.wercker.com/status/f5dd6c0c8e435440fbf4dfad1cab7193/s "wercker status")](https://app.wercker.com/project/bykey/f5dd6c0c8e435440fbf4dfad1cab7193)

[PostCSS] plugin that calculates modular scale in a unit agnostic manner and supports cases where the input to the `ms()` function contains values calculated at compile time..

[PostCSS]: https://github.com/postcss/postcss

```css
:root {
  --ms-bases: 1, 0.75;
  --ms-ratios: 2;
}

.header {
  font-size: ms(4)rem;
}
```

```css
:root {
  --ms-bases: 1, 0.75;
  --ms-ratios: 2;
}

.header {
  font-size: 3rem;
}


```

## Usage

```js
postcss([ require('postcss-modular-scale-plus') ])
```

See [PostCSS] docs for examples for your environment.
