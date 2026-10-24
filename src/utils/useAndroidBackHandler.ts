import { useEffect } from 'react';
import { BackHandler, Alert, Platform } from 'react-native';

/**
 * Custom hook to handle Android physical/gesture back button on root screens.
 * Prompts user with a confirmation dialog before exiting the app.
 */
export const useAndroidBackHandler = (isFocused: boolean) => {
  useEffect(() => {
    if (Platform.OS !== 'android' || !isFocused) return;

    const onBackPress = () => {
      Alert.alert(
        'Exit WorkTrack',
        'Are you sure you want to exit the application?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true }
      );
      return true; // Prevents default back navigation
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isFocused]);
};
