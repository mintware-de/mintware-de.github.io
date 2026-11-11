---
title: Service registration at runtime
description: Register a service with a factory while the app is running.
group: Guides
order: 9
---

Sometimes you need to register services at runtime. For this, you can use the `register` method:

```dart
void main() {
  var container = ServiceContainer();

  container.register(
        (container) => MySelfRegisteredService(container.resolve()),
  );

  var selfRegistered = container.resolve<MySelfRegisteredService>();
  selfRegistered.sayHello();
}
```
