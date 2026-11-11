---
title: Quickstart
description: Add the packages, generate the service container plugin and boot your first container.
group: Guides
order: 1
---

## 1. Install dependencies
First of all, you need to add the required dependencies.
- [`build_runner`](https://pub.dev/packages/build_runner) is required for running the code generator
- [`catalyst_builder`](https://pub.dev/packages/catalyst_builder) is the code generator that is used to generate a service container plugin at build-time
- [`catalyst_builder_contracts`](https://pub.dev/packages/catalyst_builder_contracts) is the contracts package that contains abstraction stuff.

To add the dependencies, simply run this command inside your dart project:
```bash
dart pub add dev:build_runner catalyst_builder catalyst_builder_contracts
```

## 2. Setting up the code generator
The code builder checks at build-time your code for specific annotations.

To generate the service container plugin you need to add the `@GenerateServiceContainerPlugin` to your `main` function.

```dart
// add this import
import 'package:catalyst_builder_contracts/catalyst_builder_contracts.dart';
import 'package:flutter/material.dart';

// add this line
@GenerateServiceContainerPlugin(pluginClassName: 'AppPlugin')
void main() {
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

## 3. Generate the plugin
To generate the plugin for the service container that contains your services, you need to run the build runner

```bash
dart run build_runner build
```

After the command has been completed, you should see a `*.catalyst_builder.plugin.g.dart` file beneath the file
you added the annotation.

## 4. Setting up the service container

After the plugin was generated, we can use it to set up the service container.

```dart
// add this import
import 'package:catalyst_builder/catalyst_builder.dart';
import 'package:catalyst_builder_contracts/catalyst_builder_contracts.dart';
import 'package:catalyst_builder_demo/main.catalyst_builder.plugin.g.dart';
import 'package:flutter/material.dart';

@GenerateServiceContainerPlugin(pluginClassName: 'AppPlugin')
void main() {
  // Create a new instance of the service container
  final container = ServiceContainer();
  // Register the services from our app
  container.useAppPlugin();
  // Boot the container
  container.boot();

  runApp(const MainApp());
}

// ...
```

Your project is now ready to use the service container. Head over to [Your first service](docs:your-first-service)
to learn more about service registration and loading.
