import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

interface AIExtractionLoaderProps {
  visible: boolean;
}

export const AIExtractionLoader: React.FC<AIExtractionLoaderProps> = ({
  visible,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Individual dot animations
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  // Text sequence animations
  const textFade = useRef(new Animated.Value(0)).current;
  const [currentText, setCurrentText] = React.useState("Reading your recipe");

  useEffect(() => {
    if (visible) {
      // Reset all animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      rotateAnim.setValue(0);
      textFade.setValue(0);

      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Staggered dot animations
      const createDotAnimation = (dotAnim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dotAnim, {
              toValue: 1,
              duration: 600,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(dotAnim, {
              toValue: 0,
              duration: 600,
              easing: Easing.in(Easing.cubic),
              useNativeDriver: true,
            }),
          ])
        );
      };

      createDotAnimation(dot1Anim, 0).start();
      createDotAnimation(dot2Anim, 200).start();
      createDotAnimation(dot3Anim, 400).start();

      // Text sequence
      const textSequence = [
        "Reading your recipe",
        "Understanding ingredients",
        "Parsing instructions",
        "Almost there",
      ];

      let textIndex = 0;
      const textInterval = setInterval(() => {
        Animated.sequence([
          Animated.timing(textFade, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(textFade, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        textIndex = (textIndex + 1) % textSequence.length;
        setCurrentText(textSequence[textIndex]);
      }, 2000);

      return () => clearInterval(textInterval);
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const dot1TranslateY = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const dot2TranslateY = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const dot3TranslateY = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      animationType="none"
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Decorative background elements */}
          <View style={styles.backgroundPattern}>
            <View style={[styles.patternCircle, styles.circle1]} />
            <View style={[styles.patternCircle, styles.circle2]} />
            <View style={[styles.patternCircle, styles.circle3]} />
          </View>

          {/* Main content */}
          <View style={styles.content}>
            {/* Animated icon container */}
            <View style={styles.iconContainer}>
              <Animated.View
                style={[
                  styles.outerRing,
                  {
                    transform: [{ rotate: spin }, { scale: pulseAnim }],
                  },
                ]}
              >
                <View style={styles.ringSegment1} />
                <View style={styles.ringSegment2} />
                <View style={styles.ringSegment3} />
              </Animated.View>

              {/* Center icon */}
              <View style={styles.centerIcon}>
                <View style={styles.sparkleContainer}>
                  <View style={[styles.sparkle, styles.sparkle1]} />
                  <View style={[styles.sparkle, styles.sparkle2]} />
                </View>
                <Text style={styles.iconText}>✨</Text>
              </View>
            </View>

            {/* Text content with animated transition */}
            <Animated.View style={[styles.textContainer, { opacity: textFade }]}>
              <Text style={styles.mainText}>{currentText}</Text>
            </Animated.View>

            {/* Animated dots */}
            <View style={styles.dotsContainer}>
              <Animated.View
                style={[
                  styles.dot,
                  { transform: [{ translateY: dot1TranslateY }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  { transform: [{ translateY: dot2TranslateY }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  { transform: [{ translateY: dot3TranslateY }] },
                ]}
              />
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Our AI is crafting the perfect recipe for you
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(26, 25, 24, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.85,
    backgroundColor: "#FFFCF7",
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#1A1918",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
  backgroundPattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  patternCircle: {
    position: "absolute",
    backgroundColor: "rgba(246, 76, 32, 0.06)",
    borderRadius: 1000,
  },
  circle1: {
    width: 180,
    height: 180,
    top: -60,
    right: -40,
  },
  circle2: {
    width: 120,
    height: 120,
    bottom: -30,
    left: -20,
    backgroundColor: "rgba(139, 186, 139, 0.08)",
  },
  circle3: {
    width: 90,
    height: 90,
    top: "50%",
    left: -30,
    backgroundColor: "rgba(246, 76, 32, 0.04)",
  },
  content: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  outerRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  ringSegment1: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#F64C20",
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },
  ringSegment2: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: "#8BBA8B",
    borderStyle: "solid",
    borderRightColor: "transparent",
    borderTopColor: "transparent",
    transform: [{ rotate: "120deg" }],
  },
  ringSegment3: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#F4A460",
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderTopColor: "transparent",
    transform: [{ rotate: "-60deg" }],
  },
  centerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F64C20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  sparkleContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  sparkle: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#F64C20",
    borderRadius: 4,
  },
  sparkle1: {
    top: 8,
    right: 4,
    opacity: 0.6,
  },
  sparkle2: {
    bottom: 12,
    left: 6,
    opacity: 0.4,
  },
  iconText: {
    fontSize: RFValue(28),
  },
  textContainer: {
    marginBottom: 20,
  },
  mainText: {
    fontSize: RFValue(20),
    fontFamily: "PPBold",
    color: "#1A1918",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    height: 24,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F64C20",
  },
  subtitle: {
    fontSize: RFValue(13),
    fontFamily: "PPMedium",
    color: "#6B6866",
    textAlign: "center",
    lineHeight: RFValue(20),
    maxWidth: "80%",
  },
});
