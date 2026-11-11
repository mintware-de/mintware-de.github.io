// Non-translated constants: identifiers, numbers, URLs, code snippets.
// Everything a translator should touch lives in src/i18n/*.json instead.

export const version = '6.2.1';
export const brand = 'mintware.de';
export const brandUrl = 'https://mintware.de';
export const packageName = 'catalyst_builder';
export const contractsName = 'catalyst_builder_contracts';

export const urls = {
  github: 'https://github.com/mintware-de/catalyst_builder',
  wiki: 'https://github.com/mintware-de/catalyst_builder/wiki',
  wikiQuickstart: 'https://github.com/mintware-de/catalyst_builder/wiki/Quickstart-App',
  issues: 'https://github.com/mintware-de/catalyst_builder/issues',
  pubBuilder: 'https://pub.dev/packages/catalyst_builder',
  pubContracts: 'https://pub.dev/packages/catalyst_builder_contracts',
  pubChangelog: 'https://pub.dev/packages/catalyst_builder/changelog',
  pubDocs: 'https://pub.dev/documentation/catalyst_builder/latest/',
};

export const packages = [
  { name: packageName, url: urls.pubBuilder, accent: true },
  { name: contractsName, url: urls.pubContracts, accent: false },
];

// Facts strip: the values stay fixed, the labels are translated (i18n facts[*].label).
export const facts: { value: string; suffix?: string }[] = [
  { value: version },
  { value: '150', suffix: '/150' },
  { value: '6' },
  { value: 'MIT' },
  { value: '✓' },
];

// Hero "add" pill and step/quickstart snippets. `shell` snippets are rendered
// as plain text with an accent `$` prompt (exactly as in the original);
// `dart` snippets go through Shiki with the catalyst-dark theme.
export const snippets = {
  addCommand: `dart pub add ${packageName} ${contractsName}`,
  heroDart: `import 'package:catalyst_builder/catalyst_builder.dart';
import 'main.catalyst_builder.plugin.g.dart';

@Service()
class ApiClient {
  ApiClient(this.config);
  final AppConfig config;
}

@GenerateServiceContainerPlugin(
  pluginClassName: 'AppPlugin',
)
void main() {
  final container = ServiceContainer()
    ..useAppPlugin()
    ..boot();

  // Fully wired – no manual factories.
  final api = container.resolve<ApiClient>();
}`,
  stepDart: `@Service()
class UserRepository { … }`,
  stepShell: 'dart run build_runner build',
  stepBootDart: `container.useAppPlugin();
container.boot();`,
  qsInstallShell: `dart pub add dev:build_runner \\
    ${packageName} ${contractsName}`,
  qsAnnotateDart: `import 'package:catalyst_builder_contracts/catalyst_builder_contracts.dart';

@GenerateServiceContainerPlugin(pluginClassName: 'AppPlugin')
void main() { … }`,
  qsGenerateShell: 'dart run build_runner build',
  qsBootDart: `final container = ServiceContainer();
container.useAppPlugin();
container.boot();
runApp(const MainApp());`,
};
