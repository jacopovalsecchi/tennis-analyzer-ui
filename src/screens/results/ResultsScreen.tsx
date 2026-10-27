import { Text, View } from 'react-native';
import { styles } from './styles';

/** Stroke count, type, and judgment. */
export function ResultsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Results</Text>
      <Text style={styles.body}>
        Stroke count, type, and a judgment for each stroke.
      </Text>
    </View>
  );
}
