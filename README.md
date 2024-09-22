# Utils for vite projects

This package contains scripts for Vite projects

## VueSvgPlugin - import svg as Vue component

Using:
```
import { vueSvgPlugin } from '@den59k/vite-utils'

export default defineConfig({
  plugins: [ vueSvgPlugin() ]
})

```

Then you can import the svg as Vue component:
```
import burgerIcon from './assets/burger.svg'
```

##  ViteRunner - run the backend and frontend app together

Use npm run fastifyRunner command to run dev-server with frontend and backend app. This use two configs, so you need to create 
`vite.backend.config.ts` and `vite.frontend.config.ts` files