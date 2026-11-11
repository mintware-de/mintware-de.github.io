---
title: Upgrade from v3 to v4
description: Removed annotations, the new cache directory and build configuration for v4.
group: Upgrading
order: 2
---

## @Parameter annotation removed
The `@Parameter('name')` annotation was removed. You can use `@Inject(parameter: 'name')` instead.

A simple replace-all `@Parameter(` with `@Inject(parameter: ` should fix your code.

## Cache directory
We did a rework of the building system. In the previous versions we had some issues with the change detection on builds.
This problem was solved by replacing the build_runner cache handling with a custom caching mechanism.

For this, you should exclude the `.catalyst_builder_cache` directory from VCS.

## Relative dependencies
The previously created `relative_deps_exports.dart` is not required anymore. Feel free to delete it.

## Build configuration
We proudly announce that the initial setup of the catalyst_builder package is easier than before.

The package doesn't require you to have a custom build.yaml to customize the builder.
To achieve customization you just need to move the options to the `@GenerateServiceProvider` annotation.

### Before
```yaml
# build.yaml before
targets:
  $default:
    auto_apply_builders: true
    builders:
      
      catalyst_builder|preflight:
        # ...
      catalyst_builder|buildServiceProvider:
        options:
          providerClassName: 'ExampleProvider'
          includePackageDependencies: true
```

```dart
// Your dart file
@GenerateServiceProvider()
```

### After

```yaml
# build.yaml after 
# Delete this file if it looks like this:
targets:
  $default:
    auto_apply_builders: true
```
```dart
// Your dart file

@GenerateServiceProvider(
  providerClassName: 'ExampleProvider',
  includePackageDependencies: true,
)
```
