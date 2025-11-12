import { ReactNode, Ref, forwardRef, useState, useRef, useMemo } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type ScreenProps = {
  children: React.ReactNode;
  edges?: Edges;
  renderHeader?: () => ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const Screen = (
  {
    children,
    renderHeader,
    edges = renderHeader
      ? ['left', 'right', 'bottom']
      : ['top', 'left', 'right', 'bottom'],
    style,
    scrollable = true,
    onLayout = undefined,
  }: ScreenProps,
  _ref: Ref<ScrollView>,
) => {
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [scrollViewContentHeight, setScrollViewContentHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentScrollY = useRef(0);

  const scrollEnabled = useMemo(
    () => scrollViewContentHeight > scrollViewHeight,
    [scrollViewContentHeight, scrollViewHeight],
  );

  const handleContentSizeChange = (
    _contentWidth: number,
    contentHeight: number,
  ) => {
    setScrollViewContentHeight(contentHeight);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;

    currentScrollY.current = contentOffset.y;
  };

  return (
    <SafeAreaView style={styles.container} edges={edges} onLayout={onLayout}>
      {renderHeader && renderHeader()}
      {scrollable ? (
        <>
          <KeyboardAwareScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
            onScroll={handleScroll}
            scrollEnabled={scrollEnabled}
            scrollEventThrottle={16}
            contentContainerStyle={[styles.content, style]}
          >
            {children}
          </KeyboardAwareScrollView>
        </>
      ) : (
        <View style={[styles.content, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
});

export default forwardRef(Screen);
