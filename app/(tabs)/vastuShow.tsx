import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type VastuParams = {
  height?: { feet: number; inches: number };
  width?: { feet: number; inches: number };
};

type LanguageType = 'telugu' | 'english';

const VastuShow = () => {
  const route = useRoute();
  
  const { height, width } = (route.params as VastuParams) || {};
  const [language, setLanguage] = useState<LanguageType>('telugu');
  const { width: screenWidth } = useWindowDimensions();

  // Calculation states
  const [uh, setUh] = useState<number | null>(null);
  const [uw, setUw] = useState<number | null>(null);
  const [yards, setYards] = useState<number | null>(null);
  const [feets, setFeets] = useState<number | null>(null);
  const [danam, setDanam] = useState<number | null>(null);
  const [runam, setRunam] = useState<number | null>(null);
  const [aayam, setAayam] = useState<string>("");
  const [years, setYears] = useState<number | null>(null);
  const [week, setWeek] = useState<string>("");
  const [tidhi, setTidhi] = useState<string>("");
  const [star, setStar] = useState<string>("");
  const [dikpathi, setDikpathi] = useState<string>("");
  const [amsha, setAmsha] = useState<string>("");
  const [yogam, setYogam] = useState<string>("");
  const [karanam, setKaranam] = useState<string | null>(null);
  const [graham, setGraham] = useState<string | null>(null);
  const [raasi, setRaasi] = useState<string | null>(null);
  const [tatwam, setTatwam] = useState<string | null>(null);
  const [jati, setJati] = useState<string | null>(null);
  const [yogini, setYogini] = useState<string | null>(null);
  const [kala, setKala] = useState<number | null>(null);

  // Language content - moved outside to avoid recreation
  const content = {
    telugu: {
      title: "వాస్తు లెక్కల ఫలితాలు",
      noData: "దయచేసి ముందు కొలతలను నమోదు చేయండి",
      download: "PDF డౌన్లోడ్",
      results: "లెక్కల ఫలితాలు",
      measurements: "కొలతలు",
      calculationResults: "లెక్కల ఫలితాలు",
      height: "పొడవు",
      width: "వెడల్పు",
      save: "సేవ్ చేయండి",
      fields: {
        aayam: "ఆయామం",
        yards: "స్క్వేర్ గజాలు",
        feets: "స్క్వేర్ అడుగులు",
        danam: "ధనం",
        runam: "ఋణం",
        years: "సంవత్సరం",
        week: "వారం",
        tidhi: "తిధి",
        star: "నక్షత్రం",
        dikpathi: "దిక్పతి",
        amsha: "అంశ",
        yogam: "యోగం",
        yogini: "యోగినీ",
        karanam: "కరణం",
        graham: "గ్రహం",
        raasi: "రాశి",
        tatwam: "తత్వం",
        jati: "జాతి",
        kala: "కళ"
      }
    },
    english: {
      title: "Vastu Calculation Results",
      noData: "Please enter measurements first",
      download: "Download PDF",
      results: "Calculation Results",
      measurements: "Measurements",
      calculationResults: "Calculation Results",
      height: "Height",
      width: "Width",
      save: "Save",
      fields: {
        aayam: "Aayam",
        yards: "Square Yards",
        feets: "Square Feet",
        danam: "Danam",
        runam: "Runam",
        years: "Year",
        week: "Week",
        tidhi: "Tidhi",
        star: "Star",
        dikpathi: "Dikpathi",
        amsha: "Amsha",
        yogam: "Yogam",
        yogini: "Yogini",
        karanam: "Karanam",
        graham: "Graham",
        raasi: "Raasi",
        tatwam: "Tatwam",
        jati: "Jati",
        kala: "Kala"
      }
    }
  };

  // Data mappings as functions that take language as parameter
  const getAm = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "ద్వాజాయం (తూర్పు-E)" : "Dhwajayam (East-E)",
    2: lang === 'telugu' ? "ధూమాయం (ఆగ్నేయం-SE)" : "Dhumayam (SouthEast-SE)",
    3: lang === 'telugu' ? "సింహాయం (దక్షిణం-S)" : "Simhayam (South-S)",
    4: lang === 'telugu' ? "శ్వానాయం (నైరుతి-SW)" : "Shwanayam (SouthWest-SW)",
    5: lang === 'telugu' ? "వృషభాయం (పశ్చిమం-W)" : "Vrishabhayam (West-W)",
    6: lang === 'telugu' ? "కారాయం (వాయువ్యం-NW)" : "Karayam (NorthWest-NW)",
    7: lang === 'telugu' ? "గజాయం (ఉత్తరం-N)" : "Gajayam (North-N)",
    8: lang === 'telugu' ? "శాఖాయం (ఈశాన్యం-NE)" : "Shakhayam (NorthEast-NE)"
  });

  const getWk = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "ఆదివారం" : "Sunday",
    2: lang === 'telugu' ? "సోమవారం" : "Monday",
    3: lang === 'telugu' ? "మంగళవారం" : "Tuesday",
    4: lang === 'telugu' ? "బుధవారం" : "Wednesday",
    5: lang === 'telugu' ? "గురువారం" : "Thursday",
    6: lang === 'telugu' ? "శుక్రవారం" : "Friday",
    7: lang === 'telugu' ? "శనివారం" : "Saturday"
  });

  const getTd = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "పాడ్యమి" : "Padhyami",
    2: lang === 'telugu' ? "విదియ" : "Vidiya",
    3: lang === 'telugu' ? "తదియ" : "Thadiya",
    4: lang === 'telugu' ? "చవితి" : "Chaviti",
    5: lang === 'telugu' ? "పంచమి" : "Panchami",
    6: lang === 'telugu' ? "షష్ఠి" : "Shashti",
    7: lang === 'telugu' ? "సప్తమి" : "Saptami",
    8: lang === 'telugu' ? "అష్టమి" : "Ashtami",
    9: lang === 'telugu' ? "నవమి" : "Navami",
    10: lang === 'telugu' ? "దశమి" : "Dasami",
    11: lang === 'telugu' ? "ఏకాదశి" : "Ekadashi",
    12: lang === 'telugu' ? "ద్వాదశి" : "Dwadashi",
    13: lang === 'telugu' ? "త్రయోదశి" : "Trayodashi",
    14: lang === 'telugu' ? "చతుర్దశి" : "Chaturdashi",
    15: lang === 'telugu' ? "పౌర్ణమి" : "Pournami",
    16: lang === 'telugu' ? "పాడ్యమి" : "Padhyami",
    17: lang === 'telugu' ? "విదియ" : "Vidiya",
    18: lang === 'telugu' ? "తదియ" : "Thadiya",
    19: lang === 'telugu' ? "చవితి" : "Chaviti",
    20: lang === 'telugu' ? "పంచమి" : "Panchami",
    21: lang === 'telugu' ? "షష్ఠి" : "Shashti",
    22: lang === 'telugu' ? "సప్తమి" : "Saptami",
    23: lang === 'telugu' ? "అష్టమి" : "Ashtami",
    24: lang === 'telugu' ? "నవమి" : "Navami",
    25: lang === 'telugu' ? "దశమి" : "Dasami",
    26: lang === 'telugu' ? "ఏకాదశి" : "Ekadashi",
    27: lang === 'telugu' ? "ద్వాదశి" : "Dwadashi",
    28: lang === 'telugu' ? "త్రయోదశి" : "Trayodashi",
    29: lang === 'telugu' ? "చతుర్దశి" : "Chaturdashi",
    30: lang === 'telugu' ? "అమావాస్య" : "Amavasya"
  });

  const getDp = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "ఇంద్ర దిక్పతి - సౌఖ్యం" : "Indra Dikpati - Comfort",
    2: lang === 'telugu' ? "అగ్ని దిక్పతి - గృహదహనం" : "Agni Dikpati - House Fire",
    3: lang === 'telugu' ? "యమ దిక్పతి - ధర్మగుణము" : "Yama Dikpati - Righteousness",
    4: lang === 'telugu' ? "నైరృతి దిక్పతి - శత్రుభయం" : "Nairuti Dikpati - Fear of Enemies",
    5: lang === 'telugu' ? "వరుణ దిక్పతి - పశు, ధనవృద్ధి" : "Varuna Dikpati - Cattle & Wealth Growth",
    6: lang === 'telugu' ? "వాయు దిక్పతి - చలనా గుణము" : "Vayu Dikpati - Mobility",
    7: lang === 'telugu' ? "కుబేర దిక్పతి - ధనవృద్ధి" : "Kubera Dikpati - Wealth Growth",
    8: lang === 'telugu' ? "ఈశాన్య దిక్పతి - అమంగళకారణము" : "Eeshanya Dikpati - Inauspiciousness"
  });

  const getYg = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "విష్కంభ యోగం - అశుభం" : "Vishkambha Yoga - Inauspicious",
    2: lang === 'telugu' ? "ప్రీతి యోగం - శుభం" : "Preeti Yoga - Auspicious",
    3: lang === 'telugu' ? "ఆయుష్మాన్ యోగం - శుభం" : "Ayushman Yoga - Auspicious",
    4: lang === 'telugu' ? "సౌభాగ్య యోగం - శుభం" : "Saubhagya Yoga - Auspicious",
    5: lang === 'telugu' ? "శోభన యోగం - శుభం" : "Shobhana Yoga - Auspicious",
    6: lang === 'telugu' ? "అతిగండ యోగం - అశుభం" : "Atiganda Yoga - Inauspicious",
    7: lang === 'telugu' ? "సుకర్మ యోగం - శుభం" : "Sukarma Yoga - Auspicious",
    8: lang === 'telugu' ? "ధృతి యోగం - శుభం" : "Dhriti Yoga - Auspicious",
    9: lang === 'telugu' ? "శూల యోగం - అశుభం" : "Shoola Yoga - Inauspicious",
    10: lang === 'telugu' ? "గండ యోగం - అశుభం" : "Ganda Yoga - Inauspicious",
    11: lang === 'telugu' ? "వృద్ధి యోగం - శుభం" : "Vriddhi Yoga - Auspicious",
    12: lang === 'telugu' ? "ధ్రువ యోగం - శుభం" : "Dhruva Yoga - Auspicious",
    13: lang === 'telugu' ? "వ్యాఘాత యోగం - అశుభం" : "Vyaghata Yoga - Inauspicious",
    14: lang === 'telugu' ? "హర్షణ యోగం - శుభం" : "Harshana Yoga - Auspicious",
    15: lang === 'telugu' ? "వజ్ర యోగం - అశుభం" : "Vajra Yoga - Inauspicious",
    16: lang === 'telugu' ? "సిద్ధి యోగం - శుభం" : "Siddhi Yoga - Auspicious",
    17: lang === 'telugu' ? "వ్యాతిపాత యోగం - అశుభం" : "Vyatipata Yoga - Inauspicious",
    18: lang === 'telugu' ? "వరీయాన్ యోగం - శుభం" : "Variyan Yoga - Auspicious",
    19: lang === 'telugu' ? "పరిఘ యోగం - అశుభం" : "Parigha Yoga - Inauspicious",
    20: lang === 'telugu' ? "శివ యోగం - శుభం" : "Shiva Yoga - Auspicious",
    21: lang === 'telugu' ? "సిద్ధ యోగం - శుభం" : "Siddha Yoga - Auspicious",
    22: lang === 'telugu' ? "సాధ్య యోగం - శుభం" : "Sadhya Yoga - Auspicious",
    23: lang === 'telugu' ? "శుభ యోగం - శుభం" : "Shubha Yoga - Auspicious",
    24: lang === 'telugu' ? "శుక్ల యోగం - శుభం" : "Shukla Yoga - Auspicious",
    25: lang === 'telugu' ? "బ్రహ్మ యోగం - శుభం" : "Brahma Yoga - Auspicious",
    26: lang === 'telugu' ? "ఇంద్ర యోగం - శుభం" : "Indra Yoga - Auspicious",
    27: lang === 'telugu' ? "వైదృత్య యోగం - అశుభం" : "Vaidhrti Yoga - Inauspicious"
  });

  const getAs = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "నష్టాంశ - ధన నష్టం" : "Nashtamsha - Loss of Wealth",
    2: lang === 'telugu' ? "వృద్ధాంశ - అభివృద్ధి" : "Vriddhamsha - Progress",
    3: lang === 'telugu' ? "స్త్రీ ఆంశ - సౌభాగ్యం" : "Stri Amsha - Prosperity through Women",
    4: lang === 'telugu' ? "మృత్యుఆంశ - రోగభయం" : "Mrityu Amsha - Fear of Disease / Death",
    5: lang === 'telugu' ? "ధనాంశ - అగ్నిభయం" : "Dhanamsha - Fear of Fire",
    6: lang === 'telugu' ? "చోరాంశ - చోరభయం" : "Choramsha - Fear of Theft",
    7: lang === 'telugu' ? "పుత్రాంశ - పుత్రవృద్ధి" : "Putramsha - Growth of Children",
    8: lang === 'telugu' ? "గోదానాంశ - పశు ధన వృద్ధి" : "Godanamsha - Cattle & Wealth Growth",
    9: lang === 'telugu' ? "కీర్తిఆంశ - కీర్తి" : "Keertiamsha - Fame"
  });

  const getNk = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "అశ్విని" : "Ashwini",
    2: lang === 'telugu' ? "భరణి" : "Bharani",
    3: lang === 'telugu' ? "కృత్తిక" : "Krittika",
    4: lang === 'telugu' ? "రోహిణి" : "Rohini",
    5: lang === 'telugu' ? "మృగశిర" : "Mrigashira",
    6: lang === 'telugu' ? "ఆరుద్ర" : "Arudra",
    7: lang === 'telugu' ? "పునర్వసు" : "Punarvasu",
    8: lang === 'telugu' ? "పుష్యము" : "Pushyami",
    9: lang === 'telugu' ? "ఆశ్లేష" : "Ashlesha",
    10: lang === 'telugu' ? "మఖ" : "Magha",
    11: lang === 'telugu' ? "పుబ్బ" : "Pubba",
    12: lang === 'telugu' ? "ఉత్తర" : "Uttara",
    13: lang === 'telugu' ? "హస్త" : "Hasta",
    14: lang === 'telugu' ? "చిత్త" : "Chitta",
    15: lang === 'telugu' ? "స్వాతి" : "Swati",
    16: lang === 'telugu' ? "విశాఖ" : "Vishakha",
    17: lang === 'telugu' ? "అనూరాధ" : "Anuradha",
    18: lang === 'telugu' ? "జ్యేష్ఠ" : "Jyeshtha",
    19: lang === 'telugu' ? "మూల" : "Moola",
    20: lang === 'telugu' ? "పూర్వాషాఢ" : "Purvashada",
    21: lang === 'telugu' ? "ఉత్తరాషాఢ" : "Uttarashada",
    22: lang === 'telugu' ? "శ్రవణ" : "Shravana",
    23: lang === 'telugu' ? "ధనిష్ఠ" : "Dhanishta",
    24: lang === 'telugu' ? "శతభిష" : "Shatabhisha",
    25: lang === 'telugu' ? "పూర్వాభాద్ర" : "Purvabhadra",
    26: lang === 'telugu' ? "ఉత్తరాభాద్ర" : "Uttarabhadra",
    27: lang === 'telugu' ? "రేవతి" : "Revati"
  });

  const getKm = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "బవ - మంచిది" : "Bava - Good",
    2: lang === 'telugu' ? "బాల - మంచిది" : "Bala - Good",
    3: lang === 'telugu' ? "కౌలవ - మంచిది" : "Kaulava - Good",
    4: lang === 'telugu' ? "తైతుల - మంచిది" : "Taitula - Good",
    5: lang === 'telugu' ? "గర - మంచిది" : "Gara - Good",
    6: lang === 'telugu' ? "వాణిజ - మంచిది" : "Vanija - Good",
    7: lang === 'telugu' ? "విష్టి (భద్ర) - చెడు" : "Vishti (Bhadra) - Bad",
    8: lang === 'telugu' ? "శకుని - చెడు" : "Shakuni - Bad",
    9: lang === 'telugu' ? "చతుష్పద - చెడు" : "Chatushpada - Bad",
    10: lang === 'telugu' ? "నాగ - చెడు" : "Naga - Bad",
    11: lang === 'telugu' ? "కింస్తుగ్న - చెడు" : "Kimstughna - Bad"
  });

  const getGh = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "రవి (సూర్యుడు) - చెడ్డది" : "Ravi (Sun) - Bad",
    2: lang === 'telugu' ? "చంద్ర (చంద్రుడు) - మంచిది" : "Chandra (Moon) - Good",
    3: lang === 'telugu' ? "కుజ (అంగారకుడు) - మిశ్రమం" : "Kuja (Mars) - Mixed",
    4: lang === 'telugu' ? "బుధ (బుధుడు) - మంచిది" : "Budha (Mercury) - Good",
    5: lang === 'telugu' ? "గురు (బృహస్పతి) - మంచిది" : "Guru (Jupiter) - Good",
    6: lang === 'telugu' ? "శుక్ర (శుక్రుడు) - మంచిది" : "Shukra (Venus) - Good",
    7: lang === 'telugu' ? "శని (శనేశ్వరుడు) - చెడ్డది" : "Shani (Saturn) - Bad",
    8: lang === 'telugu' ? "రాహు (రాహు) - చెడ్డది" : "Rahu - Bad",
    9: lang === 'telugu' ? "కేతు (కేతు) - చెడ్డది" : "Ketu - Bad"
  });

  const getRs = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "మేషం" : "Mesha (Aries)",
    2: lang === 'telugu' ? "వృషభం" : "Vrishabha (Taurus)",
    3: lang === 'telugu' ? "మిథునం" : "Mithuna (Gemini)",
    4: lang === 'telugu' ? "కర్కాటకం" : "Karkataka (Cancer)",
    5: lang === 'telugu' ? "సింహం" : "Simha (Leo)",
    6: lang === 'telugu' ? "కన్యా" : "Kanya (Virgo)",
    7: lang === 'telugu' ? "తులా" : "Tula (Libra)",
    8: lang === 'telugu' ? "వృశ్చికం" : "Vrischika (Scorpio)",
    9: lang === 'telugu' ? "ధనుస్సు" : "Dhanus (Sagittarius)",
    10: lang === 'telugu' ? "మకరం" : "Makara (Capricorn)",
    11: lang === 'telugu' ? "కుంభం" : "Kumbha (Aquarius)",
    12: lang === 'telugu' ? "మీనం" : "Meena (Pisces)"
  });

  const getTt = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "భూత తత్త్వం - మంచిది" : "Bhoota Tattva (Earth Element) - Good",
    2: lang === 'telugu' ? "జల తత్త్వం - మంచిది" : "Jala Tattva (Water Element) - Good",
    3: lang === 'telugu' ? "అగ్ని తత్త్వం - చెడ్డది" : "Agni Tattva (Fire Element) - Bad",
    4: lang === 'telugu' ? "వాయు తత్త్వం - మంచిది" : "Vayu Tattva (Air Element) - Good",
    5: lang === 'telugu' ? "ఆకాశ తత్త్వం - చెడ్డది" : "Akasha Tattva (Space Element) - Bad"
  });

  const getJt = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "బ్రహ్మచారి - మంచిది" : "Brahmachari - Good",
    2: lang === 'telugu' ? "క్షత్రియ - మంచిది" : "Kshatriya - Good",
    3: lang === 'telugu' ? "వైశ్య - మంచిది" : "Vaishya - Good",
    4: lang === 'telugu' ? "శూద్ర - చెడ్డది" : "Shudra - Bad"
  });

  const getYgm = (lang: LanguageType) => ({
    1: lang === 'telugu' ? "మంచిది - ధన లాభం" : "Good - Gain in Wealth",
    2: lang === 'telugu' ? "చెడ్డది - ధన నాశనం" : "Bad - Loss of Wealth",
    3: lang === 'telugu' ? "మంచిది - ధాన్య లాభం" : "Good - Gain in Grains",
    4: lang === 'telugu' ? "చెడ్డది - ధన హాని" : "Bad - Loss of Wealth",
    5: lang === 'telugu' ? "మంచిది - పుత్ర లాభం" : "Good - Gain of Children",
    6: lang === 'telugu' ? "చెడ్డది - పుత్ర నాశనం" : "Bad - Loss of Children",
    7: lang === 'telugu' ? "మంచిది - ఐశ్వర్య ప్రదం" : "Good - Bestows Prosperity",
    8: lang === 'telugu' ? "చెడ్డది - మరణ భయం" : "Bad - Fear of Death"
  });

  useEffect(() => {
    getLanguage();
  }, []);

  useEffect(() => {
    if (height && width) {
      performCalculations();
    }
  }, [height, width, language]);

  const getLanguage = async () => {
    try {
      const curr = await AsyncStorage.getItem("appLanguage");
      if (curr === 'telugu' || curr === 'english') {
        setLanguage(curr);
      } else {
        setLanguage('telugu'); // Set default to telugu
      }
    } catch (err) {
      console.log("Error in getting language", err);
      setLanguage('telugu'); // Set default to telugu on error
    }
  };

  const conversion = (feet: number, inches: number): number => {
    if (isNaN(feet) || isNaN(inches)) return 0;
    if (inches >= 12) return 0; // Invalid input
    return parseFloat((feet + inches / 12).toFixed(2));
  };

  const performCalculations = () => {
    if (!height || !width) return;

    const newHeight = conversion(height.feet, height.inches);
    const newWidth = conversion(width.feet, width.inches);
    
    if (newHeight === 0 || newWidth === 0) {
      Alert.alert(
        language === 'telugu' ? 'లోపం' : 'Error',
        language === 'telugu' ? 'దయచేసి వాస్తు లెక్కింపు లో సరైన కొలతలను నమోదు చేయండి' : 'Please enter valid measurements in vastCalculation'
      );
      return;
    }

    setUh(newHeight);
    setUw(newWidth);
    
    const area = newHeight * newWidth;
    setFeets(parseFloat(area.toFixed(2)));
    
    const yardsValue = Math.floor(area / 9);
    setYards(yardsValue);
    calculateDetailedResults(yardsValue, area);
  };

  const calculateDetailedResults = (yardsValue: number, feetsValue: number) => {
    // Get current mappings based on language
    const currentAm = getAm(language);
    const currentTd = getTd(language);
    const currentWk = getWk(language);
    const currentNk = getNk(language);
    const currentDp = getDp(language);
    const currentAs = getAs(language);
    const currentGh = getGh(language);
    const currentYg = getYg(language);
    const currentYgm = getYgm(language);
    const currentKm = getKm(language);
    const currentRs = getRs(language);
    const currentTt = getTt(language);
    const currentJt = getJt(language);

    // Calculate all the values based on your algorithm
    let num = (yardsValue * 8) % 12;
    if (num === 0) num = 12;
    setDanam(num);
    
    num = (yardsValue * 3) % 8;
    if (num === 0) num = 8;
    setRunam(num);
    
    let num1 = (yardsValue * 9) % 8;
    if (num1 === 0) num1 = 8;
    setAayam(currentAm[num1 as keyof typeof currentAm]);
    
    let num2 = (yardsValue * 9) % 120;
    if (num2 === 0) num2 = 120;
    setYears(num2);
    
    let num3 = (yardsValue * 6) % 30;
    if (num3 === 0) num3 = 30;
    setTidhi(currentTd[num3 as keyof typeof currentTd]);
    
    let num4 = (yardsValue * 9) % 7;
    if (num4 === 0) num4 = 7;
    setWeek(currentWk[num4 as keyof typeof currentWk]);
    
    let num5 = (yardsValue * 8) % 27;
    if (num5 === 0) num5 = 27;
    setStar(currentNk[num5 as keyof typeof currentNk]);
    
    let num6 = (yardsValue * 9) % 8;
    if (num6 === 0) num6 = 8;
    setDikpathi(currentDp[num6 as keyof typeof currentDp]);
    
    let num7 = (yardsValue * 6) % 9;
    if (num7 === 0) num7 = 9;
    setAmsha(currentAs[num7 as keyof typeof currentAs]);
    setGraham(currentGh[num7 as keyof typeof currentGh]);
    
    let num8 = (yardsValue * 4) % 27;
    if (num8 === 0) num8 = 27;
    setYogam(currentYg[num8 as keyof typeof currentYg]);
    
    let num9 = (yardsValue * 3) % 8;
    if (num9 === 0) num9 = 8;
    setYogini(currentYgm[num9 as keyof typeof currentYgm]);
    
    let num10 = (yardsValue * 5) % 7;
    if (num10 === 0) num10 = 7;
    setKaranam(currentKm[num10 as keyof typeof currentKm]);
    
    let num11 = (yardsValue * 9) % 12;
    if (num11 === 0) num11 = 12;
    setRaasi(currentRs[num11 as keyof typeof currentRs]);
    
    let num12 = (yardsValue * 3) % 5;
    if (num12 === 0) num12 = 5;
    setTatwam(currentTt[num12 as keyof typeof currentTt]);
    
    let num13 = (yardsValue * 9) % 4;
    if (num13 === 0) num13 = 4; 
    setJati(currentJt[num13 as keyof typeof currentJt]);
    
    let num14 = (yardsValue * 12) % 16;
    if (num14 === 0) num14 = 16;
    setKala(num14);
  };
  
  const generateHTMLContent = () => {
    const currentLang = content[language];
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vastu Calculation Results</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
    body { background: #f8f9fa; color: #333; padding: 20px; }
    .container { max-width: 900px; margin: auto; background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 25px; }
    .title { font-size: 28px; font-weight: 700; color: #2c3e50; margin-bottom: 8px; }
    .date { font-size: 14px; color: #7f8c8d; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 20px; font-weight: 600; margin-bottom: 15px; border-bottom: 2px solid #3498db; display: inline-block; padding-bottom: 5px; color: #2980b9; }
    .result-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ecf0f1; }
    .result-label { font-weight: 600; color: #34495e; }
    .result-value { color: #2c3e50; }
    .footer { margin-top: 30px; text-align: center; font-size: 13px; color: #95a5a6; }
    @media (max-width: 600px) {
      .result-item { flex-direction: column; align-items: flex-start; }
      .result-label { margin-bottom: 3px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">${currentLang.title}</div>
      <div class="date">${new Date().toLocaleDateString()}</div>
    </div>

    <div class="section">
      <div class="section-title">${currentLang.measurements}</div>
      <div class="result-item">
        <span class="result-label">${currentLang.height}:</span>
        <span class="result-value">${height ? `${height.feet} ${language === 'telugu' ? 'అడుగులు' : 'Feet'}, ${height.inches} ${language === 'telugu' ? 'అంగుళాలు' : 'Inches'}` : 'N/A'}</span>
      </div>
      <div class="result-item">
        <span class="result-label">${currentLang.width}:</span>
        <span class="result-value">${width ? `${width.feet} ${language === 'telugu' ? 'అడుగులు' : 'Feet'}, ${width.inches} ${language === 'telugu' ? 'అంగుళాలు' : 'Inches'}` : 'N/A'}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">${currentLang.calculationResults}</div>
      ${aayam ? `<div class="result-item"><span class="result-label">${currentLang.fields.aayam}:</span><span class="result-value">${aayam}</span></div>` : ''}
      ${yards ? `<div class="result-item"><span class="result-label">${currentLang.fields.yards}:</span><span class="result-value">${yards}</span></div>` : ''}
      ${feets ? `<div class="result-item"><span class="result-label">${currentLang.fields.feets}:</span><span class="result-value">${feets}</span></div>` : ''}
      ${danam ? `<div class="result-item"><span class="result-label">${currentLang.fields.danam}:</span><span class="result-value">${danam}</span></div>` : ''}
      ${runam ? `<div class="result-item"><span class="result-label">${currentLang.fields.runam}:</span><span class="result-value">${runam}</span></div>` : ''}
      ${years ? `<div class="result-item"><span class="result-label">${currentLang.fields.years}:</span><span class="result-value">${years}</span></div>` : ''}
      ${week ? `<div class="result-item"><span class="result-label">${currentLang.fields.week}:</span><span class="result-value">${week}</span></div>` : ''}
      ${tidhi ? `<div class="result-item"><span class="result-label">${currentLang.fields.tidhi}:</span><span class="result-value">${tidhi}</span></div>` : ''}
      ${star ? `<div class="result-item"><span class="result-label">${currentLang.fields.star}:</span><span class="result-value">${star}</span></div>` : ''}
      ${dikpathi ? `<div class="result-item"><span class="result-label">${currentLang.fields.dikpathi}:</span><span class="result-value">${dikpathi}</span></div>` : ''}
      ${amsha ? `<div class="result-item"><span class="result-label">${currentLang.fields.amsha}:</span><span class="result-value">${amsha}</span></div>` : ''}
      ${yogam ? `<div class="result-item"><span class="result-label">${currentLang.fields.yogam}:</span><span class="result-value">${yogam}</span></div>` : ''}
      ${yogini ? `<div class="result-item"><span class="result-label">${currentLang.fields.yogini}:</span><span class="result-value">${yogini}</span></div>` : ''}
      ${karanam ? `<div class="result-item"><span class="result-label">${currentLang.fields.karanam}:</span><span class="result-value">${karanam}</span></div>` : ''}
      ${graham ? `<div class="result-item"><span class="result-label">${currentLang.fields.graham}:</span><span class="result-value">${graham}</span></div>` : ''}
      ${raasi ? `<div class="result-item"><span class="result-label">${currentLang.fields.raasi}:</span><span class="result-value">${raasi}</span></div>` : ''}
      ${tatwam ? `<div class="result-item"><span class="result-label">${currentLang.fields.tatwam}:</span><span class="result-value">${tatwam}</span></div>` : ''}
      ${jati ? `<div class="result-item"><span class="result-label">${currentLang.fields.jati}:</span><span class="result-value">${jati}</span></div>` : ''}
      ${kala ? `<div class="result-item"><span class="result-label">${currentLang.fields.kala}:</span><span class="result-value">${kala}</span></div>` : ''}
    </div>

    <div class="footer">
      ${language === 'telugu' ? 'వాస్తుగురు అప్లికేషన్ ద్వారా రూపొందించబడింది' : 'Generated by VastuGuru App'}
    </div>
  </div>
</body>
</html>
`;
  };
// function handleSave(){
//   console.log("Save functionality is not implemented yet.");
//   Alert.alert(
//     language === 'telugu' ? 'సేవ్ చేయడం లేదు' : 'Save Not Implemented',
//     language === 'telugu' ? 'ఈ ఫీచర్ ప్రస్తుతం అందుబాటులో లేదు.' : 'This feature is currently not available.'
//   );
// }
  const downloadPDF = async () => {
    try {
      const html = generateHTMLContent();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert(
        language === 'telugu' ? 'లోపం' : 'Error',
        language === 'telugu' ? 'PDF డౌన్లోడ్ చేయడంలో లోపం' : 'Error downloading PDF'
      );
    }
  };

  if (!height || !width) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>{content[language].noData}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Download Button */}
      <View style={styles.header}>
        <Text style={styles.title}>{content[language].title}</Text>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadPDF}>
          <Ionicons name="download-outline" size={24} color="#FFFFFF" />
          <Text style={styles.downloadButtonText}>{content[language].download}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Measurements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{content[language].measurements}</Text>
          <View style={styles.measurementRow}>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>{content[language].height}</Text>
              <Text style={styles.measurementValue}>
                {height.feet} {language === 'telugu' ? 'అడుగులు' : 'Feet'}, {height.inches} {language === 'telugu' ? 'అంగుళాలు' : 'Inches'}
              </Text>
            </View>
            <View style={styles.measurementItem}>
              <Text style={styles.measurementLabel}>{content[language].width}</Text>
              <Text style={styles.measurementValue}>
                {width.feet} {language === 'telugu' ? 'అడుగులు' : 'Feet'}, {width.inches} {language === 'telugu' ? 'అంగుళాలు' : 'Inches'}
              </Text>
            </View>
          </View>
        </View>

        {/* Results Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{content[language].calculationResults}</Text>
          
          {/* Basic Calculations */}
          <View style={styles.resultsGrid}>
            {yards && (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{content[language].fields.yards}</Text>
                <Text style={styles.resultValue}>{yards}</Text>
              </View>
            )}
            {feets && (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{content[language].fields.feets}</Text>
                <Text style={styles.resultValue}>{feets}</Text>
              </View>
            )}
            {danam && (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{content[language].fields.danam}</Text>
                <Text style={styles.resultValue}>{danam}</Text>
              </View>
            )}
            {runam && (
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>{content[language].fields.runam}</Text>
                <Text style={styles.resultValue}>{runam}</Text>
              </View>
            )}
          </View>

          {/* Astrological Results */}
          <View style={styles.resultsList}>
            {aayam ? <ResultItem label={content[language].fields.aayam} value={aayam} /> : null}
            {years ? <ResultItem label={content[language].fields.years} value={years.toString()} /> : null}
            {week ? <ResultItem label={content[language].fields.week} value={week} /> : null}
            {tidhi ? <ResultItem label={content[language].fields.tidhi} value={tidhi} /> : null}
            {star ? <ResultItem label={content[language].fields.star} value={star} /> : null}
            {dikpathi ? <ResultItem label={content[language].fields.dikpathi} value={dikpathi} /> : null}
            {amsha ? <ResultItem label={content[language].fields.amsha} value={amsha} /> : null}
            {yogam ? <ResultItem label={content[language].fields.yogam} value={yogam} /> : null}
            {yogini ? <ResultItem label={content[language].fields.yogini} value={yogini} /> : null}
            {karanam ? <ResultItem label={content[language].fields.karanam} value={karanam} /> : null}
            {graham ? <ResultItem label={content[language].fields.graham} value={graham} /> : null}
            {raasi ? <ResultItem label={content[language].fields.raasi} value={raasi} /> : null}
            {tatwam ? <ResultItem label={content[language].fields.tatwam} value={tatwam} /> : null}
            {jati ? <ResultItem label={content[language].fields.jati} value={jati} /> : null}
            {kala ? <ResultItem label={content[language].fields.kala} value={kala.toString()} /> : null}
          </View>
        </View>
        {/* <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>{content[language].save}</Text>
            </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

const ResultItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.resultItem}>
    <Text style={styles.resultItemLabel}>{label}</Text>
    <Text style={styles.resultItemValue}>{value}</Text>
  </View>
);

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
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
  },
  downloadButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  measurementItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  measurementLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    minWidth: '48%',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  resultsList: {
    gap: 12,
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  resultItemValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    lineHeight: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 50,
    fontWeight: '500',
  },
  // saveButton: {
  //   backgroundColor: '#10B981',
  //   borderRadius: 16,
  //   paddingVertical: 16,
  //   paddingHorizontal: 40,
  //   alignSelf: 'stretch',
  //   shadowColor: '#10B981',
  //   shadowOffset: {
  //     width: 0,
  //     height: 4,
  //   },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 8,
  //   elevation: 6,
  // },
  // saveButtonText: {
  //   fontSize: 16,
  //   fontWeight: '700',
  //   color: '#FFFFFF',
  //   textAlign: 'center',
  //   letterSpacing: 0.5,
  // }
});

export default VastuShow;