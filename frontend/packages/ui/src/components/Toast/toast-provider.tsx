import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';

type ToastType = 'success' | 'error' | 'info' | 'subtle';

type ToastConfig = {
  message: string;
  type: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
};

type ToastContextType = {
  showToast: (config: ToastConfig) => void;
};

// Create a singleton to manage toast outside of React components
type ToastServiceType = {
  showToast: ((config: ToastConfig) => void) | null;
};

// Toast service for static access
export const ToastService: ToastServiceType = {
  showToast: null,
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toastConfig, setToastConfig] = useState<ToastConfig | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | number>();
  const insets = useSafeAreaInsets();

  const showToast = useCallback(
    (config: ToastConfig) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const position = config.position || 'bottom';
      const initialTranslateY = position === 'top' ? -100 : 20;
      const targetTranslateY = 0;

      setToastConfig(config);
      translateY.setValue(initialTranslateY);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: targetTranslateY,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      timeoutRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: initialTranslateY,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setToastConfig(null));
      }, config.duration || 3000);
    },
    [fadeAnim, translateY],
  );

  useEffect(() => {
    ToastService.showToast = showToast;

    return () => {
      ToastService.showToast = null;
    };
  }, [showToast]);

  const getToastStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'info':
        return styles.info;
      case 'subtle':
        return styles.subtle;
      default:
        return styles.subtle;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastConfig && (
        <Animated.View
          style={[
            styles.container,
            getToastStyle(toastConfig.type),
            toastConfig.position === 'top'
              ? { top: insets.top + 16 }
              : { bottom: insets.bottom + 16 },
            { opacity: fadeAnim, transform: [{ translateY }] },
          ]}
        >
          <Text
            style={[
              styles.message,
              toastConfig.type === 'subtle' && styles.subtleMessage,
            ]}
          >
            {toastConfig.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 99999999,
    position: 'absolute',
    left: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#111827',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  success: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
    borderWidth: 1,
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderColor: '#D1FAE5',
    borderWidth: 1,
  },
  info: {
    backgroundColor: '#EFF8FF',
    borderColor: '#D1E9FF',
    borderWidth: 1,
  },
  subtle: {
    backgroundColor: '#111827',
  },
  iconContainer: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  subtleMessage: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

// Component with static methods that use the ToastService
export const Toast = {
  success: (
    message: string,
    duration?: number,
    position?: 'top' | 'bottom',
  ) => {
    if (ToastService.showToast) {
      ToastService.showToast({ message, type: 'success', duration, position });
    } else {
      console.warn(
        'Toast service not initialized. Make sure ToastProvider is mounted.',
      );
    }
  },
  error: (
    message: string,
    duration?: number,
    position?: 'top' | 'bottom',
  ) => {
    if (ToastService.showToast) {
      ToastService.showToast({ message, type: 'error', duration, position });
    } else {
      console.warn(
        'Toast service not initialized. Make sure ToastProvider is mounted.',
      );
    }
  },
  info: (
    message: string,
    duration?: number,
    position?: 'top' | 'bottom',
  ) => {
    if (ToastService.showToast) {
      ToastService.showToast({ message, type: 'info', duration, position });
    } else {
      console.warn(
        'Toast service not initialized. Make sure ToastProvider is mounted.',
      );
    }
  },
  subtle: (
    message: string,
    duration?: number,
    position?: 'top' | 'bottom',
  ) => {
    if (ToastService.showToast) {
      ToastService.showToast({ message, type: 'subtle', duration, position });
    } else {
      console.warn(
        'Toast service not initialized. Make sure ToastProvider is mounted.',
      );
    }
  },
};
// const getToastIcon = (type: ToastType) => {
//     switch (type) {
//       case 'success':
//         return <Check size={20} color={'#059669'} />;
//       case 'error':
//         return <AlertCircle size={20} color={'#DC2626'} />;
//       case 'info':
//         return <Info size={20} color={'#0B6BCF'} />;
//       default:
//         return null;
//     }
//   };
//
// {toastConfig.type !== 'subtle' && (
//   <View style={styles.iconContainer}>
//     {getToastIcon(toastConfig.type)}
//   </View>
// )}
