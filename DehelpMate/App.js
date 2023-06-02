import  React,{useEffect, useState, useRef} from 'react';
import { WebView } from 'react-native-webview';
import {ActivityIndicator, BackHandler, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setOffline(!state.isConnected);
    });
  }, []);

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
       <View style={styles.errorContainer}>
       <Text style={styles.errorText}>Network Error</Text>
       <TouchableOpacity onPress={() => {
              NetInfo.fetch().then((state) => {
                setOffline(!state.isConnected);
                webViewRef.current.reload();
              });
             }} style={styles.refreshButton}>
         <Text style={styles.refreshButtonText}>Refresh</Text>
       </TouchableOpacity>
     </View>
      ) : ( <WebView
        onError={() => setIsConnected(true)} 
      source={{ uri: 'https://dehelpmate.com.ng/home/'}}
      ref={webViewRef}
      onNavigationStateChange={onNavigationStateChange}
      onLoadStart={() => setIsLoading(true)}
      onLoadEnd={() => setIsLoading(false)}
    /> )}
    </View>
  );
}

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
  errorContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',

  },
  refreshButton:{
    backgroundColor:'blue',
    paddingHorizontal: 20,
    paddingVertical:10,
    borderRadius:5
  },
  errorText:{
    fontSize:20,
    marginBottom:20
  },
  refreshButtonText:{
    color:'white',
    fontSize:16
  }
});
