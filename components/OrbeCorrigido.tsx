import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, Button } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const PLAYER_SIZE = 50;
const INITIAL_ORB_SIZE = 30;
const INITIAL_TIME = 30;
const SENSITIVITY = 10; 
const UPDATE_INTERVAL = 16; 

const START_COLOR_RGB = [44, 62, 80];
const END_COLOR_RGB = [192, 57, 43];

const interpolateColor = (time: number) => {
  const ratio = time / INITIAL_TIME;
  const r = Math.round(END_COLOR_RGB[0] + (START_COLOR_RGB[0] - END_COLOR_RGB[0]) * ratio);
  const g = Math.round(END_COLOR_RGB[1] + (START_COLOR_RGB[1] - END_COLOR_RGB[1]) * ratio);
  const b = Math.round(END_COLOR_RGB[2] + (START_COLOR_RGB[2] - END_COLOR_RGB[2]) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
};

type ScreenProps = {
  onStart?: () => void;
  onRestart?: () => void;
  score?: number;
  backgroundColor: string;
};

const StartScreen: React.FC<ScreenProps> = ({ onStart, backgroundColor }) => (
  <View style={[styles.overlay, { backgroundColor }]}>
    <Text style={styles.title}>Bem-vindo ao Jogo do Orbe!</Text>
    <Button title="Começar a Jogar" onPress={onStart} />
  </View>
);

const GameOverScreen: React.FC<ScreenProps> = ({ score, onRestart, backgroundColor }) => (
  <View style={[styles.overlay, { backgroundColor }]}>
    <Text style={styles.title}>Fim de Jogo!</Text>
    <Text style={styles.scoreText}>Seu placar: {score}</Text>
    <Button title="Jogar Novamente" onPress={onRestart} />
  </View>
);

export default function App() {
  const insets = useSafeAreaInsets();

  const [gameState, setGameState] = useState('start');
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [playerPosition, setPlayerPosition] = useState({ x: (width - PLAYER_SIZE) / 2, y: (height - PLAYER_SIZE) / 2 });
  const [orbPosition, setOrbPosition] = useState(() => generateRandomPosition(INITIAL_ORB_SIZE));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [orbSize, setOrbSize] = useState(INITIAL_ORB_SIZE);
  const [backgroundColor, setBackgroundColor] = useState(interpolateColor(INITIAL_TIME));

  function generateRandomPosition(currentOrbSize: number) {
    const minX = insets.left;
    const maxX = width - insets.right - currentOrbSize;
    const minY = insets.top;
    const maxY = height - insets.bottom - currentOrbSize;

    return {
      x: minX + (Math.random() * (maxX - minX)),
      y: minY + (Math.random() * (maxY - minY)),
    };
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setOrbSize(INITIAL_ORB_SIZE);
    setPlayerPosition({ x: (width - PLAYER_SIZE) / 2, y: (height - PLAYER_SIZE) / 2 });
    setOrbPosition(generateRandomPosition(INITIAL_ORB_SIZE));
    setGameState('playing');
  };
  
  useEffect(() => {
    Gyroscope.setUpdateInterval(UPDATE_INTERVAL);
    const subscription = Gyroscope.addListener(setData);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/collect.mp3'));
        setSound(sound);
      } catch (error) { console.log("Erro ao carregar o som: ", error); }
    }
    loadSound();
    return () => { sound?.unloadAsync(); };
  }, []);
  
  useEffect(() => {
    if (gameState !== 'playing') return;
    setPlayerPosition(pos => {
      let newX = pos.x + data.y * SENSITIVITY;
      let newY = pos.y + data.x * SENSITIVITY;

      const minX = insets.left;
      const maxX = width - insets.right - PLAYER_SIZE;
      const minY = insets.top;
      const maxY = height - insets.bottom - PLAYER_SIZE;

      if (newX < minX) newX = minX;
      if (newX > maxX) newX = maxX;
      if (newY < minY) newY = minY;
      if (newY > maxY) newY = maxY;
      
      return { x: newX, y: newY };
    });
  }, [data, gameState, insets]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;
    const orbCenterX = orbPosition.x + orbSize / 2;
    const orbCenterY = orbPosition.y + orbSize / 2;
    const dx = playerCenterX - orbCenterX;
    const dy = playerCenterY - orbCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (PLAYER_SIZE / 2) + (orbSize / 2)) {
      setScore(prev => prev + 1);
      sound?.replayAsync();
      const newOrbSize = Math.max(10, orbSize - 1);
      setOrbSize(newOrbSize);
      setOrbPosition(generateRandomPosition(newOrbSize));
    }
  }, [playerPosition, gameState, sound, orbSize]);

  useEffect(() => {
    setBackgroundColor(interpolateColor(timeLeft));
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      setGameState('gameOver');
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => Math.max(0, prevTime - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, gameState]);

  if (gameState === 'start') return <StartScreen onStart={startGame} backgroundColor={backgroundColor} />;
  if (gameState === 'gameOver') return <GameOverScreen score={score} onRestart={startGame} backgroundColor={backgroundColor} />;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.scoreText, { top: insets.top + 20 }]}>Placar: {score}</Text>
      <Text style={[styles.timerText, { top: insets.top + 20 }]}>Tempo: {timeLeft}</Text>
      <View style={[styles.orb, { left: orbPosition.x, top: orbPosition.y, width: orbSize, height: orbSize, borderRadius: orbSize / 2 }]} />
      <View style={[styles.player, { left: playerPosition.x, top: playerPosition.y }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  scoreText: { position: 'absolute', left: 20, fontSize: 20, color: '#fff', fontWeight: 'bold' },
  timerText: { position: 'absolute', right: 20, fontSize: 20, color: '#fff', fontWeight: 'bold' },
  player: { position: 'absolute', width: PLAYER_SIZE, height: PLAYER_SIZE, borderRadius: PLAYER_SIZE / 2, backgroundColor: 'coral', borderWidth: 2, borderColor: '#fff' },
  orb: { position: 'absolute', backgroundColor: '#3498db', borderWidth: 2, borderColor: '#fff' },
});