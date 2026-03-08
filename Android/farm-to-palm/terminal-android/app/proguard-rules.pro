# FarmToPalm Terminal
-keepattributes *Annotation*
-keep class com.farmtopalm.terminal.** { *; }
-dontwarn okhttp3.**
-dontwarn javax.annotation.**

# Vendor palm / Veinshine SDK (reflection + JNI)
-keep class com.api.stream.** { *; }
-keep class com.palm.** { *; }
-keep class com.veinshine.** { *; }
-keepclasseswithmembers class * {
    native <methods>;
}
