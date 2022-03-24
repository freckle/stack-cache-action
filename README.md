# Stack Cache Action

Cache step for Stack-based Haskell projects on GitHub Actions.

## Usage

```yml
uses: freckle/stack-cache-action@main
```

## Behavior

1. Restores/saves `~/.stack` and _all_ `.stack-work` directories, as determined
   by the location of `.cabal` and `package.yaml` files

1. Includes a hash of all source files in the cache key, so a new cache will be
   saved even if the dependencies haven't changed. This prevents re-compilation
   of un-changed modules in later builds.

1. Falls back to same resolver/dependencies, then same resolver (but no further)

## Inputs

- `stack-yaml`: Path to your `stack.yaml` file
- `working-directory`: Useful in monorepositories
- `prefix`: A prefix to include on keys; useful for cache busting or versioning
- `always-store`: (Optional: defaults `true`) If true, will execute the post-run cache action whether or not prior steps are successful

## Outputs

- `cache-hit`: indicates a full cache hit on the primary key

## Acknowledgements

The idea and initial repository skeleton was taken from [gha-yarn-cache][].

[gha-yarn-cache]: https://github.com/c-hive/gha-yarn-cache

---

[LICENSE](./LICENSE) | [CHANGELOG](./CHANGELOG.md)
