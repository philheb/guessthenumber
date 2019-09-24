import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ScrollView,
  FlatList,
  Dimensions
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import NumberContainer from "../components/NumberContainer";
import TitleText from "../components/TitleText";
import Card from "../components/Card";
import MainButton from "../components/MainButton";
import BodyText from "../components/BodyText";

const generateRandom = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;
  if (rndNum === exclude) {
    return generateRandom(min, max, exclude);
  } else {
    return rndNum;
  }
};

const renderListItem = (listLength, itemData) => {
  return (
    <View style={styles.listItem}>
      <BodyText>#{listLength - itemData.index}</BodyText>
      <BodyText>{itemData.item}</BodyText>
    </View>
  );
};

const GameScreen = props => {
  const initialGuess = generateRandom(1, 100, props.userChoice);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props;

  useEffect(() => {
    if (currentGuess === userChoice) {
      onGameOver(pastGuesses.length);
    }
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = direction => {
    if (
      (direction === "lower" && currentGuess < props.userChoice) ||
      (direction === "greater" && currentGuess > props.userChoice)
    ) {
      Alert.alert("Don't lie!", "You know that this is wrong...", [
        { text: "Sorry!", style: "cancel" }
      ]);
      return;
    }
    if (direction === "lower") {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }
    const nextNumber = generateRandom(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );
    setCurrentGuess(nextNumber);
    // setRounds(curRounds => curRounds + 1);
    setPastGuesses(curPastGuesses => [
      nextNumber.toString(),
      ...curPastGuesses
    ]);
  };

  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };
    Dimensions.addEventListener("change", updateLayout);
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

  if (Dimensions.get("window").height < 500) {
    return (
      <View style={styles.screen}>
        <TitleText>Opponent's Guess</TitleText>

        <View style={styles.controls}>
          <MainButton onPress={nextGuessHandler.bind(this, "lower")}>
            <Ionicons name="md-remove" size={24} color="white" />
          </MainButton>
          <NumberContainer>{currentGuess}</NumberContainer>
          <MainButton onPress={nextGuessHandler.bind(this, "greater")}>
            <Ionicons name="md-add" size={24} color="white" />
          </MainButton>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            keyExtractor={item => item}
            data={pastGuesses}
            renderItem={renderListItem.bind(this, pastGuesses.length)}
            contentContainerStyle={styles.list}
          ></FlatList>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TitleText>Opponent's Guess</TitleText>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={styles.buttonContainer}>
        <MainButton onPress={nextGuessHandler.bind(this, "lower")}>
          <Ionicons name="md-remove" size={24} color="white" />
        </MainButton>
        <MainButton onPress={nextGuessHandler.bind(this, "greater")}>
          <Ionicons name="md-add" size={24} color="white" />
        </MainButton>
      </Card>
      <View style={styles.listContainer}>
        <FlatList
          keyExtractor={item => item}
          data={pastGuesses}
          renderItem={renderListItem.bind(this, pastGuesses.length)}
          contentContainerStyle={styles.list}
        ></FlatList>
        {/* <ScrollView contentContainerStyle={styles.list}>
          {pastGuesses.map((guess, index) =>
            renderListItem(guess, pastGuesses.length - index)
          )}
        </ScrollView> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginVertical: 20,
    marginTop: Dimensions.get("window").height > 600 ? 20 : 5,
    width: 400,
    maxWidth: "90%"
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%"
  },
  listContainer: {
    flex: 1,
    width: Dimensions.get("window").width > 350 ? "60%" : "80%"
  },
  list: {
    flexGrow: 1,
    // alignItems: "center",
    justifyContent: "flex-end"
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    width: "100%"
  }
});

export default GameScreen;
