---
title: Exposing services for abstractions
description: Register an implementation under the interface it implements.
group: Guides
order: 5
---

You can expose the service with another type in the service container. This is useful if you want to depend on an
interface instead of an implementation.

```dart

abstract class Transport {
  void transferData(String data);
}

@Service(exposeAs: Transport)
class ConsoleTransport implements Transport {
  @override
  void transferData(String data) {}
}

abstract class ChatProvider {
  Transport transport;

  Future<void> sendChatMessage(String message);
}

@Service(exposeAs: ChatProvider)
class CoolChatProvider implements ChatProvider {
  @override
  Transport transport;

  CoolChatProvider(this.transport);

  @override
  Future<void> sendChatMessage(String message) {}
}

void main() {
  var container = ServiceContainer();

  var chatService = container.resolve<ChatProvider>();

  print(chatService is CoolChatProvider); // true
  print(chatService.transport is ConsoleTransport); // true
}
```
