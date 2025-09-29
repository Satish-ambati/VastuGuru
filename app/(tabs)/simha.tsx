import { StyleSheet, Text, useWindowDimensions, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Simha = () => {
  const [language, setLanguage] = useState('telugu');
  const {width, height} = useWindowDimensions();
  const isLandscape = width > height;
  
  const content = {
    english:{
        title: 'Simha Dwaram Direction Decision',
      headers: [
        'First Letter',
        'Category',
        'Good Directions',
        'Bad Directions',
        'Good Ayam',
        'Bad Ayam'
      ],
      data: [
        {
          letters: 'From అ to అః',
          category: 'అ',
          goodDirections: 'North, West, South',
          badDirections: 'East',
          goodAyam: 'Dhwaja, Simha, Gaja',
          badAyam: 'Vrishabham'
        },
        {
          letters: 'క ఖ గ ఘ ఙ',
          category: 'క',
          goodDirections: 'South, West',
          badDirections: 'East, North',
          goodAyam: 'Gajayam',
          badAyam: 'Simha, Vrishabha, Dhwaja'
        },
        {
          letters: 'చ ఛ జ ఝ ఞ',
          category: 'చ',
          goodDirections: 'East, North, West',
          badDirections: 'South',
          goodAyam: 'Dhwaja, Simha, Vrishabha',
          badAyam: 'Gajayam'
        },
        {
          letters: 'ట ఠ డ ఢ ణ',
          category: 'ట',
          goodDirections: 'East, North, West',
          badDirections: 'South',
          goodAyam: 'Dhwajayam',
          badAyam: 'Simha, Vrishabha, Gaja'
        },
        {
          letters: 'త థ ద ధ న',
          category: 'త',
          goodDirections: 'East, North',
          badDirections: 'South, West',
          goodAyam: 'Simha, Gaja, Vrishabha',
          badAyam: 'Dhwaja'
        },
        {
          letters: 'ప ఫ బ భ మ',
          category: 'ప',
          goodDirections: 'East, North',
          badDirections: 'South, West',
          goodAyam: 'Simha, Dhwaja',
          badAyam: 'Gaja, Vrishabha'
        },
        {
          letters: 'య ర ల వ',
          category: 'య',
          goodDirections: 'East, South, West',
          badDirections: 'North',
          goodAyam: 'Dhwaja, Vrishabha',
          badAyam: 'Simha'
        },
        {
          letters: 'శ ష స హ',
          category: 'శ',
          goodDirections: 'East, South',
          badDirections: 'North, West',
          goodAyam: 'Gaja, Vrishabha',
          badAyam: 'Simha, Dhwaja'
        }
      ]
    },
    telugu:{
        title: 'సింహ ద్వారం దిశా నిర్ణయం',
      headers: [
        'మొదటి అక్షరం',
        'వర్గం',
        'మంచి దిశలు',
        'చెడు దిశలు',
        'మంచి ఆయం',
        'చెడు ఆయం'
      ],
      data: [
        {
          letters: 'అ నుండి అః వరకు',
          category: 'అ',
          goodDirections: 'ఉత్తర, పడమర, దక్షిణ',
          badDirections: 'తూర్పు',
          goodAyam: 'ద్వజ, సింహ, గజ',
          badAyam: 'వృషభం'
        },
        {
          letters: 'క ఖ గ ఘ ఙ',
          category: 'క',
          goodDirections: 'దక్షిణ, పడమర',
          badDirections: 'తూర్పు, ఉత్తరం',
          goodAyam: 'గజాయం',
          badAyam: 'సింహ, వృషభ, ద్వజ'
        },
        {
          letters: 'చ ఛ జ ఝ ఞ',
          category: 'చ',
          goodDirections: 'తూర్పు, ఉత్తరం, పడమర',
          badDirections: 'దక్షిణ',
          goodAyam: 'ద్వజ, సింహ, వృషభ',
          badAyam: 'గజాయం'
        },
        {
          letters: 'ట ఠ డ ఢ ణ',
          category: 'ట',
          goodDirections: 'తూర్పు, ఉత్తరం, పడమర',
          badDirections: 'దక్షిణ',
          goodAyam: 'ద్వజాయం',
          badAyam: 'సింహ, వృషభ, గజ'
        },
        {
          letters: 'త థ ద ధ న',
          category: 'త',
          goodDirections: 'తూర్పు, ఉత్తరం',
          badDirections: 'దక్షిణ, పడమర',
          goodAyam: 'సింహ, గజ, వృషభ',
          badAyam: 'ద్వజ'
        },
        {
          letters: 'ప ఫ బ భ మ',
          category: 'ప',
          goodDirections: 'తూర్పు, ఉత్తరం',
          badDirections: 'దక్షిణ, పడమర',
          goodAyam: 'సింహ, ద్వజ',
          badAyam: 'గజ, వృషభ'
        },
        {
          letters: 'య ర ల వ',
          category: 'య',
          goodDirections: 'తూర్పు, దక్షిణ, పడమర',
          badDirections: 'ఉత్తరం',
          goodAyam: 'ద్వజ, వృషభ',
          badAyam: 'సింహ'
        },
        {
          letters: 'శ ష స హ',
          category: 'శ',
          goodDirections: 'తూర్పు, దక్షిణ',
          badDirections: 'ఉత్తరం, పడమర',
          goodAyam: 'గజ, వృషభ',
          badAyam: 'సింహ, ద్వజ'
        }
      ]
    }
  }

  useEffect(() => {
    getAppLanguage()
  }, [])

  // Listen for language changes when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getAppLanguage()
    }, [])
  )

  async function getAppLanguage() {
    try {
      const saved = await AsyncStorage.getItem("appLanguage");
      if (saved != null) {
        setLanguage(saved);
      } else {
        setLanguage('telugu');
        await AsyncStorage.setItem('appLanguage', 'telugu');
      }
    } catch (e) {
      setLanguage('telugu');
    }
  }

  const currentContent = content[language as keyof typeof content];
  
  // Responsive calculations for landscape
  const getCellWidth = () => {
    if (isLandscape) {
      return width < 800 ? 140 : 160;
    }
    return width < 400 ? 120 : 140;
  };

  const getCategoryWidth = () => {
    return isLandscape ? 60 : 80;
  };

  const getFontSize = () => {
    if (isLandscape) {
      return width < 800 ? 10 : 12;
    }
    return width < 400 ? 10 : 12;
  };

  const getHeaderFontSize = () => {
    if (isLandscape) {
      return width < 800 ? 11 : 13;
    }
    return width < 400 ? 11 : 13;
  };

  const getTitleFontSize = () => {
    if (isLandscape) {
      return width < 800 ? 20 : 24;
    }
    return width < 400 ? 18 : 22;
  };

  return (
    <View style={[styles.container, isLandscape && styles.landscapeContainer]}>
      <View style={[styles.header, isLandscape && styles.landscapeHeader]}>
        <Text style={[styles.title, { fontSize: getTitleFontSize() }]}>
          {currentContent.title}
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.scrollView}
      >
        <View style={[styles.tableContainer, isLandscape && styles.landscapeTable]}>
          {/* Table Headers */}
          <View style={styles.headerRow}>
            <View style={[styles.cell, styles.headerCell, { width: getCellWidth() }]}>
              <Text style={[styles.headerText, { fontSize: getHeaderFontSize() }]}>
                {currentContent.headers[0]}
              </Text>
            </View>
            <View style={[styles.cell, styles.headerCell, { width: getCategoryWidth() }]}>
              <Text style={[styles.headerText, { fontSize: getHeaderFontSize() }]}>
                {currentContent.headers[1]}
              </Text>
            </View>
            <View style={[styles.cell, styles.headerCell, { width: getCellWidth() }]}>
              <Text style={[styles.headerText, { fontSize: getHeaderFontSize() }]}>
                {currentContent.headers[2]}
              </Text>
            </View>
            <View style={[styles.cell, styles.headerCell, { width: getCellWidth() }]}>
              <Text style={[styles.headerText, { fontSize: getHeaderFontSize() }]}>
                {currentContent.headers[3]}
              </Text>
            </View>
            <View style={[styles.cell, styles.headerCell, { width: getCellWidth() }]}>
              <Text style={[styles.headerText, { fontSize: getHeaderFontSize() }]}>
                {currentContent.headers[4]}
              </Text>
            </View>
            <View style={[styles.cell, styles.headerCell, { width: getCellWidth() }]}>
              <Text style={[styles.headerText, { fontSize: getHeaderFontSize() }]}>
                {currentContent.headers[5]}
              </Text>
            </View>
          </View>

          {/* Table Rows */}
          {currentContent.data.map((item, index) => (
            <View key={index} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
              <View style={[styles.cell, { width: getCellWidth() }]}>
                <Text style={[styles.cellText, { fontSize: getFontSize() }]}>
                  {item.letters}
                </Text>
              </View>
              <View style={[styles.cell, { width: getCategoryWidth() }]}>
                <Text style={[styles.cellText, styles.categoryText, { fontSize: getFontSize() + 4 }]}>
                  {item.category}
                </Text>
              </View>
              <View style={[styles.cell, { width: getCellWidth() }]}>
                <Text style={[styles.cellText, styles.goodText, { fontSize: getFontSize() }]}>
                  {item.goodDirections}
                </Text>
              </View>
              <View style={[styles.cell, { width: getCellWidth() }]}>
                <Text style={[styles.cellText, styles.badText, { fontSize: getFontSize() }]}>
                  {item.badDirections}
                </Text>
              </View>
              <View style={[styles.cell, { width: getCellWidth() }]}>
                <Text style={[styles.cellText, styles.goodText, { fontSize: getFontSize() }]}>
                  {item.goodAyam}
                </Text>
              </View>
              <View style={[styles.cell, { width: getCellWidth() }]}>
                <Text style={[styles.cellText, styles.badText, { fontSize: getFontSize() }]}>
                  {item.badAyam}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default Simha

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  landscapeContainer: {
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: '#8B0000',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  landscapeHeader: {
    marginBottom: 12,
    paddingVertical: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#8B0000',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  landscapeTable: {
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#8B0000',
  },
  row: {
    flexDirection: 'row',
    minHeight: 50,
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f8f8f8',
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    padding: 8,
    justifyContent: 'center',
    minHeight: 50,
  },
  headerCell: {
    backgroundColor: '#8B0000',
    borderRightColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
  },
  cellText: {
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#8B0000',
  },
  goodText: {
    color: '#2e7d32',
    fontWeight: '600',
    backgroundColor: '#e8f5e8',
    borderRadius: 4,
    padding: 4,
    overflow: 'hidden',
  },
  badText: {
    color: '#d32f2f',
    fontWeight: '600',
    backgroundColor: '#ffebee',
    borderRadius: 4,
    padding: 4,
    overflow: 'hidden',
  },
})