---
title: Service lifetime
description: The singleton and transient lifetimes, and when to reach for each.
group: Guides
order: 4
---

You can specify the lifetime of the service in the annotation.

```dart
@Service(
  lifetime: ServiceLifetime.singleton, // default
)
class SingletonService {}

@Service(
  lifetime: ServiceLifetime.transient,
)
class TransientService {}
```

| Lifetime  | Description                                                                       |
|-----------|-----------------------------------------------------------------------------------|
| Singleton | The instance is stored in the container. You'll always receive the same instance. | 
| Transient | Everytime you call `resolve` or `tryResolve` you'll receive a fresh instance.     |
