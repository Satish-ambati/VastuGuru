import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import * as Updates from "expo-updates";
export default function TabsLayout() {
  const [language, setLanguage] = useState<string>("telugu");
  const [modalVisible, setModalVisible] = useState(false);
  const [languageUpdated, setLanguageUpdated] = useState(0);

  // Load saved language
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem("appLanguage");
        if (savedLang) {
          setLanguage(savedLang);
        } else {
          setLanguage("telugu");
          await AsyncStorage.setItem("appLanguage", "telugu");
        }
      } catch (error) {
        console.error("Failed to load language:", error);
        setLanguage("telugu");
      }
    };
    loadLanguage();
  }, []);

  async function saveLanguage(lang: string) {
  try {
    await AsyncStorage.setItem("appLanguage", lang);
    setLanguage(lang);
    setLanguageUpdated(prev => prev + 1);
    setModalVisible(false);
    // Optional: Show a success message
    console.log("Language saved successfully:", lang);
    // Remove or comment out the reload for now to test
    // await Updates.reloadAsync();
  } catch (error) {
    console.error("Failed to save language:", error);
  }
}


  // Pass language as a parameter to all screens
  const screenOptions = {
    language: language,
    languageUpdated: languageUpdated
  };

  return (
    <>
      {/* Tabs Layout */}
      <Tabs
        screenOptions={{
          header: () => (
            <SafeAreaView style={styles.header}>
              <Text style={styles.title}>
                {language === 'telugu' ? 'వాస్తుగురు' : 'VastuGuru'} 
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                style={styles.languageButtonHeader}
              >
                <Ionicons name="language-outline" size={26} color="#8B0000" />
                <Text style={styles.languageTextSmall}>
                  {language === 'telugu' ? 'తెలుగు' : 'English'}
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          ),
          tabBarActiveTintColor: "#8B0000",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="vastuCalculation"
          options={{
            tabBarLabel: language === 'telugu' ? 'వాస్తు లెక్కలు' : 'Vastu Calc',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="compass-outline"
                size={size}
                color={color}
              />
            ),
          }}
          initialParams={screenOptions}
        />

          <Tabs.Screen
          name="vastuShow"
          options={{
            tabBarLabel: language === 'telugu' ? 'వాస్తు ప్రదర్శన' : 'Vastu Show',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
          initialParams={screenOptions}
        />
        <Tabs.Screen
          name="ExtraCalc"
          options={{
            tabBarLabel: language === 'telugu' ? 'అదనపు లెక్కలు' : 'Extra Calc',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="function-variant"
                size={size}
                color={color}
              />
            ),
          }}
          initialParams={screenOptions}
        />

        <Tabs.Screen
          name="simha"
          options={{
            tabBarLabel: language === 'telugu' ? 'సింహ ద్వారం' : 'Simha Dwara',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calculator-outline" size={size} color={color} />
            ),
          }}
          initialParams={screenOptions}
        />
        <Tabs.Screen
  name="history"
  options={{
    tabBarLabel: language === 'telugu' ? 'చరిత్ర' : 'History',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="time-outline" size={size} color={color} />
    ),
  }}
  initialParams={screenOptions}
/>

        
        
      </Tabs>

      {/* Language Selection Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {language === 'telugu' ? '🌐 భాషను ఎంచుకోండి' : '🌐 Select Language'}
            </Text>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === "english" && styles.selectedButton,
              ]}
              onPress={() => saveLanguage("english")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "english" && styles.selectedText,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                language === "telugu" && styles.selectedButton,
              ]}
              onPress={() => saveLanguage("telugu")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "telugu" && styles.selectedText,
                ]}
              >
                తెలుగు
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>
                {language === 'telugu' ? 'రద్దు చేయి' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff8e7",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#8B0000",
  },
  languageButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  languageTextSmall: {
    fontSize: 14,
    color: "#8B0000",
    marginLeft: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  languageButton: {
    width: "100%",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#8B0000",
  },
  languageText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 15,
    padding: 12,
  },
  cancelText: {
    fontSize: 16,
    color: "gray",
  },
});