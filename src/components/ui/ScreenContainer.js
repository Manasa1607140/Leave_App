import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../utils/theme';

const ScreenContainer = ({ children, style, contentStyle, padded = true, edges = ['top'] }) => (
  <SafeAreaView style={[styles.container, style]} edges={edges}>
    <View style={[styles.content, padded && styles.padded, contentStyle]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    flex: 1,
  },
  padded: {
    padding: spacing.lg,
  },
});

export default React.memo(ScreenContainer);
