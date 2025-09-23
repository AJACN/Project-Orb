import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Gyroscope } from 'expo-sensors';

// Obtém as dimensões da tela para posicionamento dinâmico.
const { width, height } = Dimensions.get('window');

// Define constantes para o tamanho dos elementos, facilitando a manutenção.
const PLAYER_SIZE = 50;
const ORB_SIZE = 30;

/**
 * Gera uma posição aleatória para o orbe.
 * A função garante que o orbe apareça completamente dentro dos limites da tela.
 */
const generateRandomPosition = () => {
  // BUG CORRIGIDO: Subtraímos o tamanho do orbe da largura/altura máxima.
  // Isso impede que o orbe seja gerado com parte do seu corpo fora da tela.
  const position = {
    x: Math.random() * (width - ORB_SIZE),
    y: Math.random() * (height - ORB_SIZE),
  };
  return position;
};

export default function App() {
  // Estado para armazenar os dados brutos do giroscópio (x, y, z).
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  
  // Estado para a posição do jogador, começando centralizado na tela.
  const [playerPosition, setPlayerPosition] = useState({ x: (width - PLAYER_SIZE) / 2, y: (height - PLAYER_SIZE) / 2 });

  // Estado para a posição do orbe, começando em um local aleatório.
  const [orbPosition, setOrbPosition] = useState(generateRandomPosition());

  // Hook executado uma vez para configurar o listener do giroscópio.
  useEffect(() => {
    // BUG CORRIGIDO: Reduzimos o intervalo de atualização de 500ms para 100ms.
    // Isso torna o movimento do jogador muito mais suave e com melhor resposta.
    Gyroscope.setUpdateInterval(100);

    // Adiciona um "ouvinte" que atualiza o estado 'data' com as leituras do giroscópio.
    const subscription = Gyroscope.addListener(gyroscopeData => {
      setData(gyroscopeData);
    });

    // Função de limpeza: remove o "ouvinte" quando o componente é desmontado para evitar vazamentos de memória.
    return () => subscription.remove();
  }, []); // O array vazio [] garante que este efeito rode apenas na montagem/desmontagem do componente.

  // Hook para atualizar a posição do jogador sempre que os dados do giroscópio mudam.
  useEffect(() => {
    // O eixo 'y' do giroscópio (inclinação lateral) controla o movimento 'x' na tela.
    let newX = playerPosition.x + data.y * 3;

    // BUG CORRIGIDO: Invertemos o sinal da operação para que o movimento vertical seja natural.
    // Agora, inclinar para baixo (data.x positivo) aumenta o 'y', movendo a bola para baixo na tela.
    let newY = playerPosition.y + data.x * 3;

    // Lógica para impedir que o jogador saia dos limites da tela.
    if (newX < 0) newX = 0;
    if (newX > width - PLAYER_SIZE) newX = width - PLAYER_SIZE;
    if (newY < 0) newY = 0;
    if (newY > height - PLAYER_SIZE) newY = height - PLAYER_SIZE;

    // Atualiza o estado com a nova posição do jogador.
    setPlayerPosition({ x: newX, y: newY });
  }, [data]); // Este efeito é executado sempre que o estado 'data' é alterado.

  // Hook para verificar a colisão entre o jogador e o orbe.
  useEffect(() => {
    // Calcula a posição do centro de cada círculo.
    const playerCenterX = playerPosition.x + PLAYER_SIZE / 2;
    const playerCenterY = playerPosition.y + PLAYER_SIZE / 2;
    const orbCenterX = orbPosition.x + ORB_SIZE / 2;
    const orbCenterY = orbPosition.y + ORB_SIZE / 2;

    // Calcula a distância entre os centros usando o Teorema de Pitágoras.
    const dx = playerCenterX - orbCenterX;
    const dy = playerCenterY - orbCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // BUG CORRIGIDO: A colisão ocorre quando a distância é menor que a SOMA DOS RAIOS (metade do tamanho),
    // e não a soma dos diâmetros. Isso torna a detecção de colisão visualmente precisa.
    if (distance < (PLAYER_SIZE / 2) + (ORB_SIZE / 2)) {
      // Se houver colisão, gera uma nova posição aleatória para o orbe.
      setOrbPosition(generateRandomPosition());
    }
  }, [playerPosition]); // Este efeito é executado sempre que a posição do jogador muda.

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>Colete o orbe azul!</Text>
      
      {/* Componente que renderiza o Orbe */}
      <View
        style={[
          styles.orb,
          {
            left: orbPosition.x,
            top: orbPosition.y,
          },
        ]}
      />
      
      {/* Componente que renderiza o Jogador */}
      <View
        style={[
          styles.player,
          {
            left: playerPosition.x,
            top: playerPosition.y,
          },
        ]}
      />
    </View>
  );
}

// Folha de estilos para os componentes.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  instructions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2, // Garante que a View seja um círculo perfeito.
    backgroundColor: 'coral',
    borderWidth: 2,
    borderColor: '#fff',
  },
  orb: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2, // Garante que a View seja um círculo perfeito.
    backgroundColor: '#3498db',
    borderWidth: 2,
    borderColor: '#fff',
  },
});