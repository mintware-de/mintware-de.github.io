---
title: Configure your project
description: How the code generator, the generated plugin and the service container fit together.
group: Guides
order: 2
---

After you installed the necessary packages you can start setting up the project.

Before we start you should understand the high level architecture of catalyst_builder
```mermaid
flowchart
    subgraph catalyst_builder
        CodeGenerator
        ServiceContainer
    end
    subgraph YourApp
        ServiceContainerPlugin
        main.dart
        main.catalyst_builder.plugin.g.dart
    end
    CodeGenerator -->|generates| main.catalyst_builder.plugin.g.dart
    ServiceContainerPlugin -->|is registered in| ServiceContainer
    main.dart -->|resolve services using| ServiceContainer
```

As you can see, there is a generated file in the graph.
