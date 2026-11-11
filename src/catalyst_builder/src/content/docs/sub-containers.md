---
title: Sub containers with additional services
description: Scope services and parameters to a single derived container with enhance.
group: Guides
order: 10
---

In some cases, you want to register services or parameters only for a specific service.
The services or parameters should not be placed inside the global service container.
To solve this problem, you can use the `enhance` method, which accepts an array of additional services and
a map of additional parameters. These are only available in the returned ServiceContainer.

```dart
void main() {
  var container = ServiceContainer();

  var newContainer = container.enhance(
    parameters: {
      'foo': 'overwritten',
    },
    services: [
      // Important: Specify the type explicitly or cast the outer array to dynamic. Otherwise dart can not infer the
      // correct return type!
      LazyServiceDescriptor<MySelfRegisteredService>(
            (p) => MySelfRegisteredService(p.resolve(), p.parameters['foo']),
        const Service(exposeAs: SelfRegisteredService),
      ),
    ],
  );

  var mySvc = newContainer.resolve<SelfRegisteredService>();
  expect(mySvc.foo, equals('overwritten'));
}
```
