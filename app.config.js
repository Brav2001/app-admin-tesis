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
        googleMapsApiKey: "AIzaSyA4dh2L9NbnjEyPEMqhnZpM23OmCEwucSY",
      },
      infoplist: {
        NSCameraUsageDescription: "This app uses the camera to scan QR codes.",
        NSLocationWhenInUseUsageDescription:
          "This app uses your location to show nearby places.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app uses your location to show nearby places.",
        NSMicrophoneUsageDescription:
          "This app uses the microphone to record audio.",
      },
    },
    android: {
      config: {
        googleMaps: {
          apiKey: "AIzaSyA4dh2L9NbnjEyPEMqhnZpM23OmCEwucSY",
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
      MAP_API_KEY: "AIzaSyA4dh2L9NbnjEyPEMqhnZpM23OmCEwucSY",
    },
  },
};
