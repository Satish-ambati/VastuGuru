import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageType = 'telugu' | 'english';

const ExtraCalc = () => {
  const [hypotenuse, setHypotenuse] = useState<boolean>(false);
  const [area, setArea] = useState<boolean>(false);
  const [perimeter, setPerimeter] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageType>('telugu');
  
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [hypotenuseResult, setHypotenuseResult] = useState<string | null>(null);
  const [areaResult, setAreaResult] = useState<string | null>(null);
  const [perimeterResult, setPerimeterResult] = useState<string | null>(null);

  const navigation = useNavigation();

  // Language content
  const content = {
    telugu: {
      title: "అదనపు లెక్కలు",
      hypotenuse: "కర్ణం",
      area: "వైశాల్యం", 
      perimeter: "చుట్టుకొలత",
      length: "పొడవు",
      breadth: "వెడల్పు",
      calculate: "లెక్కించు",
      result: "ఫలితం",
      hypotenuseFormula: "కర్ణం = √(పొడవు² + వెడల్పు²)",
      areaFormula: "వైశాల్యం = పొడవు × వెడల్పు",
      perimeterFormula: "చుట్టుకొలత = 2 × (పొడవు + వెడల్పు)",
      enterValues: "దయచేసి విలువలను నమోదు చేయండి",
      invalidInput: "దయచేసి సరైన సంఖ్యలను నమోదు చేయండి"
    },
    english: {
      title: "Extra Calculations",
      hypotenuse: "Hypotenuse",
      area: "Area",
      perimeter: "Perimeter",
      length: "Length",
      breadth: "Breadth",
      calculate: "Calculate",
      result: "Result",
      hypotenuseFormula: "Hypotenuse = √(Length² + Breadth²)",
      areaFormula: "Area = Length × Breadth",
      perimeterFormula: "Perimeter = 2 × (Length + Breadth)",
      enterValues: "Please enter values",
      invalidInput: "Please enter valid numbers"
    }
  };

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
      }
    } catch (err) {
      console.log("Error in getting language", err);
    }
  };

  const calculateHypotenuse = () => {
    if (!length || !breadth) {
      Alert.alert(content[language].enterValues);
      return;
    }

    const l = parseFloat(length);
    const b = parseFloat(breadth);

    if (isNaN(l) || isNaN(b)) {
      Alert.alert(content[language].invalidInput);
      return;
    }

    const hypotenuseValue = Math.sqrt(l * l + b * b);
    setHypotenuseResult(`${content[language].hypotenuse}: ${hypotenuseValue.toFixed(2)}`);
  };

  const calculateArea = () => {
    if (!length || !breadth) {
      Alert.alert(content[language].enterValues);
      return;
    }

    const l = parseFloat(length);
    const b = parseFloat(breadth);

    if (isNaN(l) || isNaN(b)) {
      Alert.alert(content[language].invalidInput);
      return;
    }

    const areaValue = l * b;
    setAreaResult(`${content[language].area}: ${areaValue.toFixed(2)}`);
  };

  const calculatePerimeter = () => {
    if (!length || !breadth) {
      Alert.alert(content[language].enterValues);
      return;
    }

    const l = parseFloat(length);
    const b = parseFloat(breadth);

    if (isNaN(l) || isNaN(b)) {
      Alert.alert(content[language].invalidInput);
      return;
    }

    const perimeterValue = 2 * (l + b);
    setPerimeterResult(`${content[language].perimeter}: ${perimeterValue.toFixed(2)}`);
  };

  const calculator = () => {
    navigation.navigate('calculator' as never);
  };

  const currentContent = content[language];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{currentContent.title}</Text>
        <TouchableOpacity onPress={calculator} style={styles.calculatorButton}>
          <Ionicons name='calculator' size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{currentContent.length}</Text>
          <TextInput
            style={styles.textInput}
            value={length}
            onChangeText={setLength}
            placeholder={`${currentContent.length}...`}
            keyboardType='numeric'
            placeholderTextColor="#94A3B8"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{currentContent.breadth}</Text>
          <TextInput
            style={styles.textInput}
            value={breadth}
            onChangeText={setBreadth}
            placeholder={`${currentContent.breadth}...`}
            keyboardType='numeric'
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Calculation Options */}
      <View style={styles.calculationSection}>
        {/* Hypotenuse */}
        <TouchableOpacity 
          style={[styles.optionCard, hypotenuse && styles.activeOption]}
          onPress={() => {
            setHypotenuse(!hypotenuse);
            setArea(false);
            setPerimeter(false);
            setHypotenuseResult(null);
          }}
        >
          <View style={styles.optionHeader}>
            <Text style={[styles.optionTitle, hypotenuse && styles.activeText]}>
              {currentContent.hypotenuse}
            </Text>
            <Ionicons 
              name={hypotenuse ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={hypotenuse ? "#6366F1" : "#64748B"} 
            />
          </View>
          <Text style={styles.formulaText}>{currentContent.hypotenuseFormula}</Text>
          
          {hypotenuse && (
            <View style={styles.calculationContent}>
              {!hypotenuseResult ? (
                <TouchableOpacity style={styles.calculateButton} onPress={calculateHypotenuse}>
                  <Text style={styles.calculateButtonText}>{currentContent.calculate}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.resultDisplay}>
                  <Text style={styles.resultText}>{hypotenuseResult}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Area
        <TouchableOpacity 
          style={[styles.optionCard, area && styles.activeOption]}
          onPress={() => {
            setArea(!area);
            setHypotenuse(false);
            setPerimeter(false);
            setAreaResult(null);
          }}
        >
          <View style={styles.optionHeader}>
            <Text style={[styles.optionTitle, area && styles.activeText]}>
              {currentContent.area}
            </Text>
            <Ionicons 
              name={area ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={area ? "#6366F1" : "#64748B"} 
            />
          </View>
          <Text style={styles.formulaText}>{currentContent.areaFormula}</Text>
          
          {area && (
            <View style={styles.calculationContent}>
              {!areaResult ? (
                <TouchableOpacity style={styles.calculateButton} onPress={calculateArea}>
                  <Text style={styles.calculateButtonText}>{currentContent.calculate}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.resultDisplay}>
                  <Text style={styles.resultText}>{areaResult}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity> */}

        {/* Perimeter */}
        {/* <TouchableOpacity 
          style={[styles.optionCard, perimeter && styles.activeOption]}
          onPress={() => {
            setPerimeter(!perimeter);
            setHypotenuse(false);
            setArea(false);
            setPerimeterResult(null);
          }}
        >
          <View style={styles.optionHeader}>
            <Text style={[styles.optionTitle, perimeter && styles.activeText]}>
              {currentContent.perimeter}
            </Text>
            <Ionicons 
              name={perimeter ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={perimeter ? "#6366F1" : "#64748B"} 
            />
          </View>
          <Text style={styles.formulaText}>{currentContent.perimeterFormula}</Text>
          
          {perimeter && (
            <View style={styles.calculationContent}>
              {!perimeterResult ? (
                <TouchableOpacity style={styles.calculateButton} onPress={calculatePerimeter}>
                  <Text style={styles.calculateButtonText}>{currentContent.calculate}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.resultDisplay}>
                  <Text style={styles.resultText}>{perimeterResult}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  calculatorButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  calculationSection: {
    gap: 16,
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  activeOption: {
    borderColor: '#6366F1',
    backgroundColor: '#F0F4FF',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
  },
  activeText: {
    color: '#6366F1',
  },
  formulaText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  calculationContent: {
    marginTop: 8,
  },
  calculateButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultDisplay: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoSection: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  infoText: {
    fontSize: 14,
    color: '#0369A1',
    fontWeight: '500',
    lineHeight: 20,
  },
});

export default ExtraCalc