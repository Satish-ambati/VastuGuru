import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  vastuShow: {
    height: { feet: number; inches: number };
    width: { feet: number; inches: number };
  };
};
type LanguageType = 'telugu' | 'english';
const VastuCalculation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [feetHeight, setFeetHeight] = useState('');
  const [inchesHeight, setInchesHeight] = useState('');
  const [feetWidth, setFeetWidth] = useState('');
  const [inchesWidth, setInchesWidth] = useState('');
  
  const content: Record<LanguageType, {
    title: string;
    width: { label: string; feet: string; inches: string; };
    height: { label: string; feet: string; inches: string; };
    answer: string;
    error: string;
  }> = {
    telugu: {
      title: "వాస్తు లెక్కింపు",
      width: {
        label: "వెడల్పు",
        feet: "అడుగులు",
        inches: "అంగుళాలు"
      },
      height: {
        label: "పొడవు", 
        feet: "అడుగులు",
        inches: "అంగుళాలు"
      },
      answer: "లెక్కింపు",
      error: "దయచేసి అన్ని విలువలను నమోదు చేయండి"
    },
    english: {
      title: "Vastu Calculation",
      width: {
        label: "Width",
        feet: "Feet",  
        inches: "Inches"
      },
      height: {
        label: "Height",
        feet: "Feet",
        inches: "Inches"
      },
      answer: "Calculate",
      error: "Please enter all values"
    }
  }

  const [language, setLanguage] = useState<LanguageType>('telugu');

  useEffect(() => {
    getLanguage();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getLanguage();
    }, [])
  );

  const getLanguage = async () => {
    try {
      const curr = await AsyncStorage.getItem("appLanguage");
      if (curr === 'telugu' || curr === 'english') {
        setLanguage(curr);
      } else {
        setLanguage('telugu');
      }
    } catch (err) {
      console.log("Error in getting language", err);
    }
  };

  const handleCalculate = () => {
    if (!feetHeight || !inchesHeight || !feetWidth || !inchesWidth) {
      Alert.alert(
        language === 'telugu' ? 'లోపం' : 'Error',
        content[language].error
      );
      return;
    }

    const heightFeet = parseInt(feetHeight) || 0;
    const heightInches = parseInt(inchesHeight) || 0;
    const widthFeet = parseInt(feetWidth) || 0;
    const widthInches = parseInt(inchesWidth) || 0;

    if (heightFeet < 0 || heightInches < 0 || widthFeet < 0 || widthInches < 0) {
      Alert.alert(
        language === 'telugu' ? 'లోపం' : 'Error',
        language === 'telugu' ? 'దయచేసి సానుకూల సంఖ్యలను నమోదు చేయండి' : 'Please enter positive numbers'
      );
      return;
    }

    if (heightInches >= 12 || widthInches >= 12) {
      Alert.alert(
        language === 'telugu' ? 'లోపం' : 'Error',
        language === 'telugu' ? 'అంగుళాలు 11 కంటే తక్కువగా ఉండాలి' : 'Inches should be less than 12'
      );
      return;
    }

    const data = {
      height: {
        feet: heightFeet,
        inches: heightInches
      },
      width: {
        feet: widthFeet,
        inches: widthInches
      }
    };

    navigation.navigate('vastuShow', data);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>{content[language].title}</Text>
            <Text style={styles.subtitle}>
              {language === 'telugu' 
                ? 'శుభకరమైన కొలతలను కనుగొనండి' 
                : 'Discover auspicious measurements'
              }
            </Text>
          </View>

          {/* Input Sections */}
          <View style={styles.inputsContainer}>
            {/* Height Input Section */}
            <View style={styles.inputCard}>
              <Text style={styles.sectionLabel}>{content[language].height.label}</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{content[language].height.feet}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={feetHeight}
                    onChangeText={setFeetHeight}
                    placeholder="0"
                    keyboardType="number-pad"
                    placeholderTextColor="#94A3B8"
                    maxLength={2}
                    returnKeyType="next"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{content[language].height.inches}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={inchesHeight}
                    onChangeText={setInchesHeight}
                    placeholder="0"
                    keyboardType="number-pad"
                    placeholderTextColor="#94A3B8"
                    maxLength={2}
                    returnKeyType="next"
                  />
                </View>
              </View>
            </View>

            {/* Width Input Section */}
            <View style={styles.inputCard}>
              <Text style={styles.sectionLabel}>{content[language].width.label}</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{content[language].width.feet}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={feetWidth}
                    onChangeText={setFeetWidth}
                    placeholder="0"
                    keyboardType="number-pad"
                    placeholderTextColor="#94A3B8"
                    maxLength={2}
                    returnKeyType="next"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{content[language].width.inches}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={inchesWidth}
                    onChangeText={setInchesWidth}
                    placeholder="0"
                    keyboardType="number-pad"
                    placeholderTextColor="#94A3B8"
                    maxLength={2}
                    returnKeyType="done"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleCalculate}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{content[language].answer}</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default VastuCalculation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom:6,
  },
  inputsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    width: '100%',
    minHeight: 50,
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginBottom: 30,
    alignSelf: 'stretch',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
})