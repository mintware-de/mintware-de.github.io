---
title: Service maps
description: Register services that live in a third party package you cannot annotate.
group: Guides
order: 8
---

If you depend on a third party package, you can not easily add the `@Service` to classes inside the package.
For this, there is a `@ServiceMap` annotation, that accepts a map of services.

```dart
@ServiceMap(services: {
  ManuallyWiredServiceImplementation: Service(
    lifetime: ServiceLifetime.transient, // optional
    exposeAs: ManuallyWiredService, // optional
  ),
})
void main() {}
```
