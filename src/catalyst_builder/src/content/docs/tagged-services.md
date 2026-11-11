---
title: Tagged services
description: Group services under a symbol and resolve them all at once.
group: Guides
order: 11
---

You can tag services using the `tags` property on the `Service` annotation. This is useful if you need to group services
and load all services with a certain tag at once.

```dart
@Service(tags: [#groupTag, #anotherTag])
class MyService1 {}

@Service(tags: [#groupTag, #anotherDifferentTag])
class MyService2 {}

void main() {
  var container = ServiceContainer();
  container.boot();

  var groupTagServices = container.resolveByTag(#groupTag);
  // groupTagServices = [MyService1, MyService2]

  var anotherTagServices = container.resolveByTag(#anotherTag);
  // anotherTagServices = [MyService1]

  var anotherDifferentTagServices = container.resolveByTag(#anotherDifferentTag);
  // anotherDifferentTag = [MyService2]

  var nonExistingTagServices = container.resolveByTag(#nonExistingTag);
  // servicesWithUnknownTag = []
}

```

Starting from v3.2.0 the `@Inject` annotation allows you to inject a list of services tagged with a certain tag.

```dart
abstract class MyServiceBase {}

@Service(tags: [#groupTag, #anotherTag])
class MyService1 extends MyServiceBase {}

@Service(tags: [#groupTag, #anotherDifferentTag])
class MyService2 extends MyServiceBase {}

@Service()
class ServiceWithDeps {

  ServiceWithDeps(@Inject(tag: #groupTag) List<MyServiceBase> services,) {
    // services includes MyService1 and MyService2
  }
}

```
