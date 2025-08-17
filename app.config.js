import "dotenv/config";

export default {
  expo: {
    scheme: "laCosecha",
    newArchEnabled: true,
    name: "Entrego",
    slug: "app-admin-tesis",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    owner: "brayanacosta",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
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
        NSLocationAlwaysUsageDescription:
          "Necesitamos acceso a tu ubicación incluso cuando la app está en segundo plano para poder detectar tu ubicación.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app uses your location to show nearby places.",
        NSMicrophoneUsageDescription:
          "This app uses the microphone to record audio.",
        UIBackgroundModes: ["location", "fetch"],
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
      permissions: [
        "android.permission.INTERNET",
        "ACCESS_BACKGROUND_LOCATION",
        "android.permission.CAMERA",
      ],
      package: "com.entrego.app",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
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
      [
        "expo-notifications",
        {
          icon: "./assets/adaptive-icon.png",
        },
      ],
    ],
    extra: {
      MAP_API_KEY: "AIzaSyA4dh2L9NbnjEyPEMqhnZpM23OmCEwucSY",
      eas: {
        projectId: "d702fd05-1c6e-4bd6-b096-a394437d3d77",
      },
    },
  },
};
