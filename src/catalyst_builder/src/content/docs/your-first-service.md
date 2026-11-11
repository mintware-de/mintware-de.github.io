---
title: Your first service
description: Register a class as a service and resolve it from the container.
group: Guides
order: 3
---

A service container is useless without services. In the [quickstart](docs:quickstart) you created the following minimal example to set up
the service container.

As you can see, there is the `MainApp` class that is initialized in the `runApp` call.

```dart
import 'package:catalyst_builder/catalyst_builder.dart';
import 'package:catalyst_builder_contracts/catalyst_builder_contracts.dart';
import 'package:catalyst_builder_demo/main.catalyst_builder.plugin.g.dart';
import 'package:flutter/material.dart';

@GenerateServiceContainerPlugin(pluginClassName: 'AppPlugin')
void main() {
  final container = ServiceContainer();
  container.useAppPlugin();
  container.boot();

  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(body: Center(child: Text('Hello World!'))),
    );
  }
}

```
In this guide, you will learn how to register the `MainApp` as a service and load it from the container instead of initializing it by yourself.

## Service registration

To mark classes for registration as services, you need to decorate them with `@Service`.
So in the code above you have to add it to `MainApp`:

```dart
@Service() // Add this annotation
class MainApp extends StatelessWidget {
  // ...
}
```

After that, you need to run `dart run build_runner build` to update the service container plugin.
That's all! The widget is now registered as a service inside the container.

## Service resolving

Now you need to load the instance from the service container instead of initializing it by yourself.
To do this, just use the `resolve<T>()` method of the service container.

```dart
// ...

void main() {
  final container = ServiceContainer();
  container.useAppPlugin();
  container.boot();

  // Resolve the instance from the service container
  runApp(container.resolve<MainApp>());
}

// ...
```
