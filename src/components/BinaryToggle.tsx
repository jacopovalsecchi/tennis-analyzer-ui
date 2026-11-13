import { useLayoutEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type BinaryToggleOption<T extends string> = {
  label: string;
  value: T;
};

type BinaryToggleProps<T extends string> = {
  label: string;
  value: T | '';
  options: readonly [BinaryToggleOption<T>, BinaryToggleOption<T>];
  onChange: (value: T) => void;
  disabled?: boolean;
  testID?: string;
};

const THUMB_INSET = 3;

/** Two-option control. A pill slides between the choices. */
export function BinaryToggle<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  testID,
}: BinaryToggleProps<T>) {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const placedIndex = useRef<number | null>(null);
  const reduceMotion = useRef(false);
  const selectedIndex = options.findIndex(option => option.value === value);
  const thumbWidth =
    trackWidth > THUMB_INSET * 2 ? (trackWidth - THUMB_INSET * 2) / 2 : 0;

  useLayoutEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      if (active) {
        reduceMotion.current = enabled;
      }
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      enabled => {
        reduceMotion.current = enabled;
      },
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useLayoutEffect(() => {
    if (thumbWidth <= 0 || selectedIndex < 0) {
      return;
    }
    const toValue = selectedIndex * thumbWidth;
    const firstPlacement = placedIndex.current === null;
    const indexChanged = placedIndex.current !== selectedIndex;
    placedIndex.current = selectedIndex;
    if (firstPlacement || !indexChanged) {
      translateX.setValue(toValue);
      return;
    }
    const animation = Animated.timing(translateX, {
      toValue,
      duration: reduceMotion.current ? 0 : 200,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [selectedIndex, thumbWidth, translateX]);

  return (
    <View style={styles.field} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <View
        accessibilityRole="radiogroup"
        style={[styles.track, disabled ? styles.trackDisabled : null]}
        onLayout={event => setTrackWidth(event.nativeEvent.layout.width)}
      >
        {thumbWidth > 0 && selectedIndex >= 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.thumb,
              { width: thumbWidth, transform: [{ translateX }] },
            ]}
          />
        ) : null}
        {options.map(option => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              testID={testID ? `${testID}-${option.value}` : undefined}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled }}
              style={styles.option}
              onPress={() => onChange(option.value)}
            >
              <Text
                style={selected ? styles.optionSelected : styles.optionText}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D5DEE8',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#6D7C8E',
    marginBottom: 8,
  },
  track: {
    height: 44,
    padding: THUMB_INSET,
    borderRadius: 14,
    backgroundColor: '#DEE5ED',
    flexDirection: 'row',
  },
  trackDisabled: {
    opacity: 0.55,
  },
  thumb: {
    position: 'absolute',
    top: THUMB_INSET,
    bottom: THUMB_INSET,
    left: THUMB_INSET,
    borderRadius: 11,
    backgroundColor: '#3A6B9C',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#556678',
  },
  optionSelected: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
