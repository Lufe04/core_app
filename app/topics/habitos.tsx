import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView,TouchableOpacity,Modal,ScrollView, Animated, Dimensions,FlatList} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Datos para las flashcards
const flashcards = [
    {
      id: '1',
      pregunta: '¿Cómo influyen los hábitos en nuestra libertad?',
      respuesta: 'Los hábitos condicionan nuestra libertad al crear patrones de comportamiento automáticos. Los buenos hábitos amplían nuestra libertad efectiva al hacer que las acciones buenas resulten más fáciles y naturales. Los malos hábitos la reducen, creando dependencias y obstaculizando nuestras decisiones racionales.'
    },
    {
      id: '2',
      pregunta: '¿Qué diferencia existe entre continencia y virtud?',
      respuesta: 'La continencia es el estado donde la persona sabe lo que es bueno y actúa correctamente, pero sus deseos aún se inclinan hacia lo contrario, lo que genera un conflicto interno. La virtud es un estado superior donde no solo se actúa bien, sino que los deseos están alineados con lo bueno, produciendo armonía interior.'
    },
    {
      id: '3',
      pregunta: '¿Por qué los hábitos son tan importantes para el perfeccionamiento humano?',
      respuesta: 'A diferencia de otros seres vivos que están determinados por su naturaleza, los humanos podemos elegir nuestro perfeccionamiento. Los hábitos permiten que estas elecciones se conviertan en disposiciones estables que conforman nuestro carácter, haciéndonos capaces de actuar bien de manera consistente y no solo ocasional.'
    },
    {
      id: '4',
      pregunta: '¿Cómo se forma un hábito y por qué deja una "huella" interior?',
      respuesta: 'Los hábitos se forman mediante la repetición de decisiones y acciones. Cada acción no solo produce un efecto externo sino que modifica interiormente a quien la realiza, creando una disposición o inclinación. Esta "huella" interior facilita que acciones similares futuras se realicen con mayor facilidad, eficacia y agrado.'
    },
  ];

// Datos para las preguntas del quiz
const quizQuestions = [
    {
      pregunta: '¿Qué es un hábito según lo estudiado?',
      opciones: [
        'Una rutina que se realiza siempre a la misma hora',
        'Un acto involuntario provocado por estímulos externos',
        'Una inclinación o disposición a realizar acciones de manera fácil, eficaz y agradable',
        'Una obligación que nos imponemos para disciplinarnos'
      ],
      respuestaCorrecta: 'Una inclinación o disposición a realizar acciones de manera fácil, eficaz y agradable'
    },
    {
      pregunta: '¿Por qué se dice que los hábitos dejan una "huella" en nuestro interior?',
      opciones: [
        'Porque generan memorias emocionales duraderas',
        'Porque alteran nuestra apariencia física',
        'Porque las decisiones repetidas crean disposiciones estables que modifican nuestro carácter',
        'Porque nos hacen recordar experiencias del pasado'
      ],
      respuestaCorrecta: 'Porque las decisiones repetidas crean disposiciones estables que modifican nuestro carácter'
    },
    {
      pregunta: '¿Cuál es la relación entre hábitos y libertad?',
      opciones: [
        'Los hábitos siempre disminuyen nuestra libertad',
        'Los hábitos no tienen impacto en nuestra libertad',
        'Los buenos hábitos amplían nuestra libertad efectiva haciendo más fácil elegir el bien',
        'La libertad consiste en no tener ningún hábito'
      ],
      respuestaCorrecta: 'Los buenos hábitos amplían nuestra libertad efectiva haciendo más fácil elegir el bien'
    },
    {
      pregunta: '¿Qué significa ser una persona continente?',
      opciones: [
        'Alguien que evita los excesos en comidas y bebidas',
        'Alguien físicamente fuerte y resistente',
        'Alguien que sabe lo que es bueno y actúa así, aunque sus deseos se orienten en otra dirección',
        'Alguien que logra mantenerse fiel a sus promesas'
      ],
      respuestaCorrecta: 'Alguien que sabe lo que es bueno y actúa así, aunque sus deseos se orienten en otra dirección'
    }
  ];

const { width } = Dimensions.get('window');

export default function BienesBasicos() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const router = useRouter();
  const [isIncorrect, setIsIncorrect] = useState(false);
  // Resto del código igual que en habitos.tsx, pero cambiando el título
  const flipCard = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsIncorrect(false); // Reinicia el estado de incorrecta al seleccionar otra respuesta
  };

  const checkAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuizIndex].respuestaCorrecta) {
      // Si es correcta, avanza a la siguiente pregunta o completa el quiz
      setIsIncorrect(false);
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setSelectedAnswer(null);
      } else {
        setQuizComplete(true);
      }
    } else {
      // Si es incorrecta, marca la respuesta como incorrecta
      setIsIncorrect(true);
      // No avanza a la siguiente pregunta, permitiendo otro intento
    }
  };

  const resetQuiz = () => {
    setQuizComplete(false);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizModalVisible(false);
  };

  const renderCard = ({ item }: { item: { id: string; pregunta: string; respuesta: string } }) => (
    <TouchableOpacity 
      style={[
        styles.flashcard, 
        flippedCards[item.id] ? styles.flippedCard : {}
      ]}
      onPress={() => flipCard(item.id)}
      activeOpacity={0.9}
    >
      <Text style={[
        styles.flashcardText, 
        flippedCards[item.id] ? styles.flippedText : {}
      ]}>
        {flippedCards[item.id] ? item.respuesta : item.pregunta}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Hábitos</Text>
        <View style={styles.placeholderView} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Sección de Flashcards */}
        <View style={styles.flashcardsSection}>
          <Text style={styles.sectionTitle}>Preguntas para reflexionar</Text>
            <FlatList
            data={flashcards}
            renderItem={renderCard}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={width - 40}
            decelerationRate="fast"
            style={styles.cardList}
            onScroll={(e) => {
                const x = e.nativeEvent.contentOffset.x;
                const newIndex = Math.round(x / (width - 40));
                if (currentCardIndex !== newIndex) {
                setCurrentCardIndex(newIndex);
                }
            }}
            scrollEventThrottle={16}
            />
          <View style={styles.dotsContainer}>
            {flashcards.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  i === currentCardIndex ? styles.activeDot : {}
                ]} 
              />
            ))}
          </View>
        </View>
        
        {/* Explicación del tema */}
        <View style={styles.explanationSection}>
        <Text style={styles.explanationTitle}>Sobre los Hábitos</Text>
        <Text style={styles.explanationText}>
            Los hábitos son decisiones que al materializarse repetidamente en acciones, 
            dejan una "huella" en nuestro interior, creando inclinaciones o disposiciones 
            para actuar de determinada manera con facilidad, eficacia y agrado.
        </Text>
        <Text style={styles.explanationText}>
            A diferencia de otros seres vivos, los humanos no estamos determinados a alcanzar 
            nuestra perfección de una única forma. Los hábitos representan el camino por el 
            cual elegimos y construimos nuestro propio desarrollo, pudiendo formarse tanto 
            hábitos buenos (virtudes) como malos (vicios).
        </Text>
        <Text style={styles.explanationText}>
            La meta es lograr una alineación entre nuestros deseos, hábitos y decisiones, 
            orientados hacia bienes auténticos. Inicialmente puede existir una discordancia 
            (continencia), donde sabemos lo bueno y lo hacemos aunque nuestros deseos vayan 
            en otra dirección. El ideal es alcanzar la virtud, donde el bien se realiza de 
            forma natural y armónica, encontrando satisfacción en ello.
        </Text>
        </View>
                
        {/* Botón de jugar */}
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => setQuizModalVisible(true)}
        >
          <Text style={styles.playButtonText}>Poner a prueba tus conocimientos</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Modal del quiz */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={quizModalVisible}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        {/* El contenido del modal es igual que en habitos.tsx */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {!quizComplete ? (
              <>
                <Text style={styles.questionCounter}>
                  Pregunta {currentQuizIndex + 1} de {quizQuestions.length}
                </Text>
                <Text style={styles.questionText}>
                  {quizQuestions[currentQuizIndex].pregunta}
                </Text>
                <View style={styles.optionsContainer}>
                {quizQuestions[currentQuizIndex].opciones.map((opcion, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedAnswer === opcion && isIncorrect ? styles.incorrectOption : 
                      selectedAnswer === opcion ? styles.selectedOption : {}
                    ]}
                    onPress={() => handleAnswerSelect(opcion)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedAnswer === opcion && isIncorrect ? styles.incorrectOptionText : 
                      selectedAnswer === opcion ? styles.selectedOptionText : {}
                    ]}>
                      {opcion}
                    </Text>
                  </TouchableOpacity>
                ))}
                </View>
                <View style={styles.quizButtonsContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.checkButton,
                      !selectedAnswer ? styles.disabledButton : {}
                    ]}
                    onPress={checkAnswer}
                    disabled={!selectedAnswer}
                  >
                    <Text style={styles.checkButtonText}>Verificar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setQuizModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.completionContainer}>
                <AntDesign name="smileo" size={80} color="#0a2463" />
                <Text style={styles.completionText}>¡Felicidades!</Text>
                <Text style={styles.completionSubtext}>
                  Has completado correctamente todas las preguntas sobre bienes básicos humanos.
                </Text>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={resetQuiz}
                >
                  <Text style={styles.resetButtonText}>Volver a intentar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setQuizModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Los estilos son iguales que en habitos.tsx
const styles = StyleSheet.create({
  // Mismo StyleSheet que el anterior
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  // Añade estos estilos al StyleSheet existente en cada archivo

topBar: {
    backgroundColor: '#0a2463',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  topBarTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  placeholderView: {
    width: 40,  // Para mantener el título centrado
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  flashcardsSection: {
    marginBottom: 24,
  },
  cardList: {
    marginBottom: 16,
  },
  flashcard: {
    width: width - 40,
    marginHorizontal: 4,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flippedCard: {
    backgroundColor: '#3e92cc',
  },
  flashcardText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  flippedText: {
    color: 'white',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0a2463',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  explanationSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0a2463',
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
    marginBottom: 12,
  },
  playButton: {
    backgroundColor: '#0a2463',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  questionCounter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#f0f4f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#3e92cc',
    borderColor: '#0a2463',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quizButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkButton: {
    backgroundColor: '#0a2463',
    borderRadius: 12,
    padding: 14,
    flex: 2,
    alignItems: 'center',
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f0f4f9',
    borderRadius: 12,
    padding: 14,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  closeButtonText: {
    color: '#555',
    fontSize: 16,
  },
  completionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a2463',
    marginTop: 16,
    marginBottom: 8,
  },
  completionSubtext: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#3e92cc',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  incorrectOption: {
    backgroundColor: '#ffebee',
    borderColor: '#d32f2f',
    borderWidth: 1,
  },
  incorrectOptionText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
});