# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep,includedescriptorclasses class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep our native methods
-keepclassmembers class * {
    native <methods>;
}

# Keep devsupport classes (even in release to avoid ClassNotFoundException)
-keep class com.facebook.react.devsupport.** { *; }
-keep class com.facebook.react.modules.debug.** { *; }

# Keep all JSI related classes
-keep class com.facebook.jsi.** { *; }

# AnimatedSplash
-keep class com.reactnativeanimatedsplashscreen.** { *; }

# React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Keep AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Fast Image
-keep class com.dylanvann.fastimage.** { *; }
