# Stack Cache Action

## Usage

```yml
uses: freckle/stack-cache-action@main
```

Is equivalent to:

```yml
- uses: actions/cache@v1
  with:
    path: |
      ~/.stack
      ./.stack-work
    key: ${{ runner.os }}-${{ hashFiles('stack.yaml') }}-${{ hashFiles('*.cabal') }}
    restore-keys: |
      ${{ runner.os }}-${{ hashFiles('stack.yaml') }}-
      ${{ runner.os }}-
```

## Inputs

_TODO_

## Outputs

- `cache-hit`: indicates a full cache hit on the primary key

## Acknowledgements

The idea and initial repository skeleton was taken from [gha-yarn-cache][].

[gha-yarn-cache]: https://github.com/c-hive/gha-yarn-cache

---

[LICENSE](./LICENSE) | [CHANGELOG](./CHANGELOG.md)
