---
title: Preloading services
description: Instantiate a singleton eagerly, right after the container boots.
group: Guides
order: 6
---

By default, a service will be instantiated when it's requested. In some cases you need to create an instance after
booting the service container. For example a database connection or a background service that checks the connectivity.

To preload services you can use the `@Preload` annotation. This annotation is only available for singleton services.
Example:

```dart
@Service()
@Preload()
class MyService {
  MyService() {
    print('Service was created');
  }
}

void main() {
  ServiceContainer container;
  container.boot(); // prints "Service was created" 
  container.resolve<MyService>(); // Nothing printed
}
```
