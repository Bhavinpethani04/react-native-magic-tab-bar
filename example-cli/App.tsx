/**
 * react-native-magic-tab-bar — bare React Native (CLI) example.
 *
 * Demonstrates the `MagicTabBarNavigation` binding for
 * `@react-navigation/bottom-tabs`. See src/navigation/RootTabs.tsx for the
 * actual tab bar wiring.
 */
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootTabs } from './src/navigation/RootTabs';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={DarkTheme}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <RootTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
