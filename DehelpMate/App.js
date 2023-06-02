import  React,{useEffect, useState, useRef} from 'react';
import { WebView } from 'react-native-webview';
import {ActivityIndicator, BackHandler, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const [isConnected, setIsConnected] = useState(true);


  const initialPageUri = 'https://example.com';
  const cachedPagePath = `${FileSystem.cacheDirectory}cachedPage.html`;

  useEffect(() => {
    cacheInitialPage();
    checkNetworkConnectivity();
  }, []);

  const cacheInitialPage = async () => {
    const { exists } = await FileSystem.getInfoAsync(cachedPagePath);
    if (!exists) {
      const { uri: downloadedUri } = await FileSystem.downloadAsync(
        initialPageUri,
        cachedPagePath
      );
      console.log('Page cached:', downloadedUri);
    }
  };

  const checkNetworkConnectivity = () => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });
  };

  const handleWebViewError = () => {
    setIsConnected(false);
  };

  const handleRefresh = () => {
    setIsConnected(true);
    webViewRef.current.reload();
  };





  const onNavigationStateChange = async (navState) => {

    setCanGoBack(navState.canGoBack);
 };
 useEffect(() => {
 const handleBackButton = () => {
   if (webViewRef.current && canGoBack) {
     webViewRef.current.goBack();
     return true;
   }
   return false;
  };
 
  BackHandler.addEventListener('hardwareBackPress', handleBackButton);
 
  return () => {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      handleBackButton
    );
  };
 }, [canGoBack]);
 
  return (
    <View style={styles.container}>
     {isLoading && <ActivityIndicator style={styles.containers} size="large" color="blue" animating={true}/>}
     {!isConnected ? (
        <ErrorPage onRefresh={handleRefresh} />
      ) : ( <WebView
      
      source={{ uri: 'https://dehelpmate.com.ng/home/' }}
      ref={webViewRef}
      onNavigationStateChange={onNavigationStateChange}
      onLoadStart={() => setIsLoading(true)}
      onLoadEnd={() => setIsLoading(false)}
    /> )}
    </View>
  );
}
const ErrorPage = ({ onRefresh }) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Network Error</Text>
      <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  containers: {
    position: 'absolute',    
    top: 0,    
    bottom: 0,    
    left: 0,    
    right: 0,
    zIndex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: '#fffff',
  },
});
