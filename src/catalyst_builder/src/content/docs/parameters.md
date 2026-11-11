---
title: Parameters
description: Resolve constructor arguments from the container parameters map.
group: Guides
order: 7
---

The service container will try to lookup values for non-existent services in the parameters map. By default, the lookup
is done based on the name of the parameter. For example:

```dart
@Service()
class MyService {
  String username;

  MyService(this.username);
}

void main() {
  final container = ServiceContainer();
  container['username'] = 'Test';
  container.boot();

  var myService = container.resolve<MyService>();

  print(myService.username); // Test 
}
```

In many cases you've generic terms like 'key' or 'name'. If you've many services with the same name, you'll get in
trouble.

You can use the `@Inject(parameter: 'name')` annotation to solve this problem:

```dart
@Service()
class MyService {
  String username;

  MyService(@Inject(parameter: 'senderUserName') this.username);
}

void main() {
  final container = ServiceContainer();
  container['senderUserName'] = 'Test 2';
  container.boot();

  var myService = container.resolve<MyService>();

  print(myService.username); // Test 2 
}
```
