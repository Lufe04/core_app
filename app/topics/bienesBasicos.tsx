import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView,TouchableOpacity,Modal,ScrollView, Animated, Dimensions,FlatList} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";

// Datos para las flashcards
// Datos para las flashcards
const flashcards = [
    {
      id: '1',
      pregunta: '¿Por qué consideramos la vida como un bien básico que va más allá de su utilidad?',
      respuesta: 'La vida es valiosa por sí misma, no solo instrumentalmente. Aunque es cierto que sin ella no podríamos disfrutar de ningún otro bien, su valor intrínseco va más allá de ser un simple medio para otros fines. La vida se nos presenta como un bien digno de ser disfrutado y celebrado en sí mismo.'
    },
    {
      id: '2',
      pregunta: '¿Cómo se relacionan la amistad y la familia como bienes básicos humanos?',
      respuesta: 'La vida familiar fracasa cuando hay carencia de otros bienes, particularmente la amistad. La amistad familiar es a la familia lo que la salud es al cuerpo. Sin los ingredientes centrales de la amistad (afecto, reciprocidad y buenos deseos mutuos), las relaciones familiares no pueden florecer plenamente.'
    },
    {
      id: '3',
      pregunta: '¿Puede el trabajo considerarse un bien humano básico si a veces resulta tedioso?',
      respuesta: 'Sí, porque el elemento clave que hace del trabajo un bien humano es la experiencia de logro y autorrealización que constituye su núcleo central, no necesariamente su disfrute inmediato. El trabajo también nos vincula con nuestras comunidades, aunque debe equilibrarse con otros bienes como el juego, pues una vida dedicada exclusivamente al trabajo se torna menos deseable.'
    },
    {
      id: '4',
      pregunta: '¿Cómo se distingue el conocimiento práctico del teórico y por qué ambos son bienes básicos?',
      respuesta: 'El conocimiento teórico lo queremos por sí mismo, mientras que el práctico lo queremos para actuar. El primero busca la verdad por su valor intrínseco; el segundo nos permite tomar mejores decisiones, como identificar amistades verdaderas. Ambos son esenciales: uno enriquece nuestra comprensión del mundo y el otro guía nuestras acciones en él.'
    },
  ];

// Datos para las preguntas del quiz
const quizQuestions = [
    {
      pregunta: 'Según lo estudiado, ¿qué caracteriza a la vida como un bien humano básico?',
      opciones: [
        'Su valor es puramente instrumental para conseguir otros bienes',
        'Es valiosa por sí misma, no solo como medio para otros fines', 
        'Su valor depende únicamente de la calidad de vida que se tenga',
        'Es importante solo porque nos permite trabajar'
      ],
      respuestaCorrecta: 'Es valiosa por sí misma, no solo como medio para otros fines'
    },
    {
      pregunta: '¿Cuáles son los tres ingredientes centrales de la amistad como bien humano básico?',
      opciones: [
        'Cercanía, dependencia y confianza',
        'Afecto, reciprocidad y buenos deseos mutuos', 
        'Diversión, utilidad y tiempo compartido',
        'Lealtad, sacrificio y proximidad física'
      ],
      respuestaCorrecta: 'Afecto, reciprocidad y buenos deseos mutuos'
    },
    {
      pregunta: '¿Qué elemento hace que el trabajo sea considerado un bien humano básico?',
      opciones: [
        'La remuneración económica que proporciona',
        'El reconocimiento social que genera', 
        'La experiencia de logro y autorrealización',
        'Las relaciones laborales que facilita'
      ],
      respuestaCorrecta: 'La experiencia de logro y autorrealización'
    },
    {
      pregunta: '¿Qué diferencia fundamental existe entre el conocimiento teórico y el práctico?',
      opciones: [
        'El teórico es útil mientras que el práctico no lo es',
        'El teórico lo queremos por sí mismo, mientras que el práctico lo queremos para actuar', 
        'El teórico es accesible a todos, el práctico solo a especialistas',
        'El teórico es objetivo y el práctico es subjetivo'
      ],
      respuestaCorrecta: 'El teórico lo queremos por sí mismo, mientras que el práctico lo queremos para actuar'
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
        <Text style={styles.topBarTitle}>Bienes Básicos Humanos</Text>
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
          <Text style={styles.explanationTitle}>Sobre los Bienes Básicos Humanos</Text>
          <Text style={styles.explanationText}>
            Los bienes humanos básicos son aquellos aspectos fundamentales del bienestar humano 
            que son valiosos por sí mismos, no solo como medios para otros fines. Constituyen las 
            dimensiones básicas del florecimiento humano.
          </Text>
          <Text style={styles.explanationText}>
            Entre estos bienes se incluyen: la vida y la salud, el conocimiento y la apreciación 
            estética, la excelencia en el trabajo y juego, la amistad y sociabilidad, la armonía 
            interior, la razonabilidad práctica y la religión o espiritualidad.
          </Text>
          <Text style={styles.explanationText}>
            Estos bienes son universales (comunes a todas las culturas), inconmensurables 
            (no reducibles unos a otros), y no jerárquicos (todos son igualmente fundamentales 
            aunque en distintos momentos de la vida podamos priorizar unos sobre otros).
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
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  placeholderView: {
    width: 40,  // Para mantener el título centrado
  },
  // Añade estos estilos a tu StyleSheet
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