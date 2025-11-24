import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // ✅ added
import {
  Person,
  createTable,
  getAllPersons,
  deletePersonByName,
} from "@/DataBase/database"; // 👈 adjust path

type Language = "english" | "telugu";

const LANGUAGE_KEY = "language"; // not used now, but ok to keep

const HistoryTab: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>("english");

  const navigation = useNavigation<any>(); // ✅ navigation hook

  // Load language from AsyncStorage
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const value = await AsyncStorage.getItem("appLanguage");
        if (value === "telugu" || value === "english") {
          setLanguage(value);
        }
      } catch (e) {
        console.log("Failed to load language from storage", e);
      }
    };

    loadLanguage();
  }, []);

  // Load table + data once
  useEffect(() => {
    createTable();
    loadPersons();
  }, []);

  const loadPersons = () => {
    setLoading(true);
    getAllPersons(
      (rows) => {
        setPersons(rows);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
        Alert.alert(language === "telugu" ? "లోపం" : "Error", error);
      }
    );
  };

  // Translations based on language
  const isTelugu = language === "telugu";

  const labels = {
    historyTitle: isTelugu ? "చరిత్ర" : "History",
    subtitle: isTelugu
      ? "సేవ్ చేసిన అన్ని వ్యక్తుల కొలతలు"
      : "Saved dimensions of all persons",
    searchPlaceholder: isTelugu ? "పేరుతో వెతకండి..." : "Search by name...",
    height: isTelugu ? "ఎత్తు" : "Height",
    width: isTelugu ? "వెడల్పు" : "Width",
    noPersonsTitle: isTelugu ? "ఎలాంటి వ్యక్తుల డేటా లేదు" : "No persons found",
    noPersonsSubtitle: isTelugu
      ? "ఇక్కడ చూడడానికి ముందు కొంత డేటా సేవ్ చేయండి."
      : "Add some entries to see them here.",
    confirmDeleteTitle: isTelugu ? "డిలీట్ చేయాలా?" : "Confirm Delete",
    confirmDeleteMessage: (name: string) =>
      isTelugu
        ? `${name} వివరాలను డిలీట్ చేయాలనుకుంటున్నారా?`
        : `Are you sure you want to delete ${name}?`,
    deletedTitle: isTelugu ? "డిలీట్ అయింది" : "Deleted",
    deletedMessage: isTelugu
      ? "వ్యక్తి వివరాలు విజయవంతంగా డిలీట్ చేయబడ్డాయి"
      : "Person deleted successfully",
    errorTitle: isTelugu ? "లోపం" : "Error",
  };

  const handleDelete = (name: string) => {
    Alert.alert(
      labels.confirmDeleteTitle,
      labels.confirmDeleteMessage(name),
      [
        { text: isTelugu ? "రద్దు" : "Cancel", style: "cancel" },
        {
          text: isTelugu ? "డిలీట్" : "Delete",
          style: "destructive",
          onPress: () => {
            deletePersonByName(
              name,
              () => {
                Alert.alert(labels.deletedTitle, labels.deletedMessage);
                loadPersons();
              },
              (error) => {
                Alert.alert(labels.errorTitle, error);
              }
            );
          },
        },
      ]
    );
  };

  // 👉 when clicking on a person card, navigate to vastuShow
  const handlePersonPress = (item: Person) => {
    const data = {
      height: {
        feet: item.heightInFeets,
        inches: item.heightInInches,
      },
      width: {
        feet: item.widthInFeets,
        inches: item.widthInInches,
      },
    };

    navigation.navigate("vastuShow", data);
  };

  // Filter persons by search text
  const filteredPersons = useMemo(() => {
    if (!searchText.trim()) return persons;
    const lower = searchText.toLowerCase();
    return persons.filter((p) => p.name.toLowerCase().includes(lower));
  }, [searchText, persons]);

  const renderItem = ({ item }: { item: Person }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handlePersonPress(item)} // ✅ navigate on card press
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          onPress={(e: GestureResponderEvent) => {
            // prevent card onPress when delete is clicked
            e.stopPropagation();
            handleDelete(item.name);
          }}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.dimensionsRow}>
        <View style={styles.dimensionBox}>
          <Text style={styles.dimensionLabel}>{labels.height}</Text>
          <Text style={styles.dimensionValue}>
            {item.heightInFeets}' {item.heightInInches}"
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.dimensionBox}>
          <Text style={styles.dimensionLabel}>{labels.width}</Text>
          <Text style={styles.dimensionValue}>
            {item.widthInFeets}' {item.widthInInches}"
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>{labels.historyTitle}</Text>
      <Text style={styles.subtitle}>{labels.subtitle}</Text>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} style={styles.searchIcon} />
        <TextInput
          placeholder={labels.searchPlaceholder}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={loadPersons}>
          <Ionicons name="refresh-outline" size={20} />
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      )}

      {/* Empty state */}
      {!loading && filteredPersons.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="albums-outline" size={40} />
          <Text style={styles.emptyText}>{labels.noPersonsTitle}</Text>
          <Text style={styles.emptySubText}>{labels.noPersonsSubtitle}</Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredPersons}
        keyExtractor={(item) => String(item.id ?? item.name)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HistoryTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#f5f5f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 12,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: {
    marginRight: 6,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  loadingContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubText: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 4,
    borderRadius: 999,
  },
  dimensionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dimensionBox: {
    flex: 1,
    alignItems: "center",
  },
  dimensionLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  dimensionValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#ececec",
  },
});
