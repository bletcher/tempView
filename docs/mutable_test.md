---
title: zMutable test
toc: true
---

```js
//import {Mutable} from "npm:@observablehq/stdlib";
```

```js

```

```js
const count = Mutable(0);
const increment = () => ++count.value;
const reset = () => count.value = 0;
```

```js
Inputs.button([["Increment", increment], ["Reset", reset]])
```

Count is: ${html`<span class="flash">${count}</span>`}.




