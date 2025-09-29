import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handlePress = (value: string) => {
    if (value === '=') {
      calculateResult();
    } else if (value === 'C') {
      clear();
    } else if (value === 'DEL') {
      deleteLastChar();
    } else if (value === '(' || value === ')') {
      setExpression(prev => prev + value);
      setResult('');
    } else {
      setExpression(prev => prev + value);
      setResult('');
    }
  };

  const clear = () => {
    setExpression('');
    setResult('');
  };

  const deleteLastChar = () => {
    setExpression(prev => prev.slice(0, -1));
    setResult('');
  };

  const calculateResult = () => {
    try {
      if (!expression) return;
      
      // Replace × with * for calculation
      let processedExpression = expression.replace(/×/g, '*');
      processedExpression = processedExpression.replace(/÷/g, '/');
      
      // Evaluate the expression
      const calculatedResult = eval(processedExpression);
      
      // Format result
      const formattedResult = Number.isInteger(calculatedResult) 
        ? calculatedResult.toString() 
        : calculatedResult.toFixed(8).replace(/\.?0+$/, '');
      
      setResult(formattedResult);
    } catch (error) {
      setResult('Error');
    }
  };

  const Button = ({ value, onPress, type = 'number' }: { value: string, onPress: () => void, type?: 'number' | 'operator' | 'special' | 'equals' | 'brace' }) => {
    const getButtonStyle = () => {
      switch (type) {
        case 'operator':
          return [styles.button, styles.operatorButton];
        case 'special':
          return [styles.button, styles.specialButton];
        case 'equals':
          return [styles.button, styles.equalsButton];
        case 'brace':
          return [styles.button, styles.braceButton];
        default:
          return styles.button;
      }
    };

    const getTextStyle = () => {
      switch (type) {
        case 'operator':
        case 'special':
        case 'equals':
        case 'brace':
          return [styles.buttonText, styles.operatorText];
        default:
          return styles.buttonText;
      }
    };

    return (
      <TouchableOpacity 
        style={getButtonStyle()} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {value === 'DEL' ? (
          <Ionicons name="backspace-outline" size={24} color="#FFFFFF" />
        ) : (
          <Text style={getTextStyle()}>{value}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#1E293B"
        style="light"
        translucent={false}
      />
      {/* Display Area */}
      <View style={styles.displayContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.expression} numberOfLines={1}>
            {expression || '0'}
          </Text>
        </ScrollView>
        <Text style={styles.result} numberOfLines={1}>
          {result}
        </Text>
      </View>

      {/* Buttons Grid */}
      <View style={styles.buttonsContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          <Button value="C" onPress={() => handlePress('C')} type="special" />
          <Button value="(" onPress={() => handlePress('(')} type="brace" />
          <Button value=")" onPress={() => handlePress(')')} type="brace" />
          <Button value="÷" onPress={() => handlePress('÷')} type="operator" />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <Button value="7" onPress={() => handlePress('7')} />
          <Button value="8" onPress={() => handlePress('8')} />
          <Button value="9" onPress={() => handlePress('9')} />
          <Button value="×" onPress={() => handlePress('×')} type="operator" />
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <Button value="4" onPress={() => handlePress('4')} />
          <Button value="5" onPress={() => handlePress('5')} />
          <Button value="6" onPress={() => handlePress('6')} />
          <Button value="-" onPress={() => handlePress('-')} type="operator" />
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <Button value="1" onPress={() => handlePress('1')} />
          <Button value="2" onPress={() => handlePress('2')} />
          <Button value="3" onPress={() => handlePress('3')} />
          <Button value="+" onPress={() => handlePress('+')} type="operator" />
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          <Button value="00" onPress={() => handlePress('00')} />
          <Button value="0" onPress={() => handlePress('0')} />
          <Button value="." onPress={() => handlePress('.')} />
          <Button value="DEL" onPress={() => handlePress('DEL')} type="special" />
        </View>

        {/* Row 6 - Equals Button (3/4 size) */}
        <View style={styles.row}>
          <Button value="%" onPress={() => handlePress('%')} type="operator" />
          <TouchableOpacity 
            style={styles.equalsButtonThreeQuarter} 
            onPress={() => handlePress('=')}
            activeOpacity={0.7}
          >
            <Text style={styles.equalsButtonText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Calculator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  expression: {
    fontSize: 36,
    color: '#94A3B8',
    textAlign: 'right',
    marginBottom: 8,
    fontWeight: '400',
  },
  result: {
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'right',
    fontWeight: '700',
    minHeight: 60,
  },
  buttonsContainer: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#334155',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  operatorButton: {
    backgroundColor: '#6366F1',
  },
  braceButton: {
    backgroundColor: '#8B5CF6',
  },
  specialButton: {
    backgroundColor: '#EF4444',
  },
  equalsButton: {
    backgroundColor: '#10B981',
  },
  operatorText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  equalsButtonThreeQuarter: {
    flex: 3,
    backgroundColor: '#10B981',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  equalsButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
})