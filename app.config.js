import "dotenv/config";

export default {
  expo: {
    scheme: "laCosecha",
    newArchEnabled: true,
    name: "app-admin-tesis",
    slug: "app-admin-tesis",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#00000",
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: "process.env.IOS_MAP_API_KEY",
      },
    },
    android: {
      config: {
        googleMaps: {
          apiKey: "process.env.ANDROID_MAP_API_KEY",
        },
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["android.permission.INTERNET"],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-font",
        {
          fonts: ["src/assets/fonts/Courier-Prime.ttf"],
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      "expo-secure-store",
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
    ],
    extra: {
      MAP_API_KEY: process.env.EXPO_MAP_API_KEY,
    },
  },
};
