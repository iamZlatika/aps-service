# Project Rules for Claude

## Import Aliases

Always use `@/` for internal project imports. Never use `src/` as a path prefix.

```ts
// ✅ correct
import { Foo } from "@/features/bar/Foo"

// ❌ wrong
import { Foo } from "src/features/bar/Foo"
```

`@` is configured as a TypeScript path alias pointing to `src/`.
