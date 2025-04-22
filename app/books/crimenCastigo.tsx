import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity,KeyboardAvoidingView, Platform, Alert, Modal } from 'react-native';
import { useComments } from '../../context/CommentsContext';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function CrimenYCastigo() {
  const { comments, loading, addComment, deleteComment, getCommentsByBook } = useComments();
  const [newComment, setNewComment] = useState('');
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const toggleModal = (modalName: string | null) => {setActiveModal(modalName);
};
  
  // ID del libro - debería coincidir con el ID en la base de datos
  const bookId = "crimenYCastigo";
  const bookComments = getCommentsByBook(bookId);
  
  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      Alert.alert("Error", "El comentario no puede estar vacío");
      return;
    }
    
    try {
      await addComment({
        comentario: newComment,
        libro: bookId
      });
      setNewComment('');
    } catch (error) {
      Alert.alert("Error", "No se pudo añadir el comentario");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AntDesign 
          key={i} 
          name={i <= rating ? "star" : "staro"} 
          size={20} 
          color={i <= rating ? "#FFD700" : "#aaa"} 
          style={{ marginRight: 5 }}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView}>
          {/* Barra superior */}
          <View style={styles.topBar}>
                <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
                >
                <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.placeholderView} />
            </View>
          
          {/* Detalles del libro */}
          <View style={styles.bookDetails}>
            <Image 
              source={require('../../assets/images/book4.jpg')} 
              style={styles.bookImage} 
              resizeMode="contain"
            />
            
            <Text style={styles.bookTitle}>Crimen y Castigo</Text>
            <Text style={styles.bookAuthor}>Fiodor Dostoyevski</Text>
            
            {renderStars(5)}

            {/* Botones de análisis */}
              <View style={styles.analysisButtonsContainer}>
                <TouchableOpacity 
                  style={styles.analysisButton}
                  onPress={() => toggleModal('bienesBasicos')}
                >
                  <Text style={styles.analysisButtonText}>Bienes Básicos</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.analysisButton}
                  onPress={() => toggleModal('felicidad')}
                >
                  <Text style={styles.analysisButtonText}>Felicidad</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.analysisButton}
                  onPress={() => toggleModal('habitos')}
                >
                  <Text style={styles.analysisButtonText}>Hábitos</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.analysisButton}
                  onPress={() => toggleModal('virtudesCardinales')}
                >
                  <Text style={styles.analysisButtonText}>Virtudes Cardinales</Text>
                </TouchableOpacity>
              </View>
            
            <Text style={styles.bookDescription}>
              Considerada una de las obras más influyentes de la literatura universal, esta novela 
              psicológica narra la historia de Rodion Raskolnikov, un estudiante que desarrolla 
              una teoría por la cual las personas extraordinarias están por encima de la ley moral. 
              Para probarlo, comete un asesinato que lo sumerge en un tormento psicológico. La obra 
              explora profundamente la conciencia humana, la culpa, la redención y las consecuencias 
              morales de nuestros actos. Publicada en 1866, sigue siendo un análisis perspicaz de la 
              mente humana frente al mal.
            </Text>
          </View>
          
          {/* Sección de comentarios */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Comentarios</Text>
            
            {loading ? (
              <Text style={styles.loadingText}>Cargando comentarios...</Text>
            ) : bookComments.length === 0 ? (
              <Text style={styles.noCommentsText}>No hay comentarios aún. ¡Sé el primero!</Text>
            ) : (
              bookComments.map((comment) => (
                <View key={comment.id} style={styles.commentContainer}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentDate}>
                      {comment.fecha instanceof Date 
                        ? comment.fecha.toLocaleString() 
                        : new Date().toLocaleString()}
                    </Text>
                    <TouchableOpacity 
                      onPress={() => comment.id && deleteComment(comment.id)}
                    >
                      <AntDesign name="close" size={16} color="#999" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.commentText}>{comment.comentario}</Text>
                </View>
              ))
            )}
            
            {/* Añadir nuevo comentario */}
            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe un comentario..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleAddComment}
              >
                <Text style={styles.submitButtonText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Modales de análisis */}
        {/* Modal Bienes Básicos */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={activeModal === 'bienesBasicos'}
          onRequestClose={() => toggleModal(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Bienes Básicos en Crimen y Castigo</Text>
              <ScrollView style={styles.modalTextContainer}>
                <Text style={styles.modalText}>
                  En "Crimen y Castigo", Dostoyevski explora varios bienes humanos básicos a través de su ausencia o distorsión:
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>La vida:</Text> Raskolnikov viola este bien fundamental al asesinar a la usurera y su hermana, mostrando cómo la instrumentalización de la vida humana lleva a una profunda deshumanización.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>La amistad y comunidad:</Text> El aislamiento de Raskolnikov y su incapacidad para mantener relaciones sanas evidencia la importancia de este bien. Solo cuando comienza a aceptar la amistad de Sonia y a reconectarse con su familia inicia su recuperación moral.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>La armonía interior:</Text> La novela retrata magistralmente el tormento psicológico causado por actuar contra la propia conciencia. Raskolnikov no encuentra paz hasta que reconoce su error y acepta el castigo, mostrando que la armonía interior es inseparable de nuestras decisiones morales.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>El conocimiento:</Text> El protagonista distorsiona este bien al desarrollar una teoría intelectual que justifica el asesinato, revelando el peligro de separar el conocimiento teórico de la sabiduría práctica y la comprensión ética.
                </Text>
              </ScrollView>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => toggleModal(null)}
              >
                <Text style={styles.closeModalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Felicidad */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={activeModal === 'felicidad'}
          onRequestClose={() => toggleModal(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>La Felicidad en Crimen y Castigo</Text>
              <ScrollView style={styles.modalTextContainer}>
                <Text style={styles.modalText}>
                  "Crimen y Castigo" ofrece una profunda reflexión sobre la verdadera naturaleza de la felicidad:
                </Text>
                <Text style={styles.modalText}>
                  La obra demuestra que la felicidad no puede construirse sobre decisiones moralmente incorrectas. Raskolnikov busca una forma de felicidad basada en liberarse de la pobreza y alcanzar grandeza a través de medios inmorales, pero solo encuentra tormento interior.
                </Text>
                <Text style={styles.modalText}>
                  Dostoyevski contrasta la falsa felicidad del hedonismo (representada por Svidrigáilov) con la posibilidad de una felicidad auténtica basada en el amor, la redención y la reconciliación con los propios valores morales (que Raskolnikov comienza a vislumbrar al final).
                </Text>
                <Text style={styles.modalText}>
                  La novela sugiere que la verdadera felicidad requiere libertad moral y responsabilidad personal. Raskolnikov intenta colocarse "por encima" de las normas morales, pero paradójicamente pierde su libertad interior, encontrándose atrapado en su culpa y alienación.
                </Text>
                <Text style={styles.modalText}>
                  El sufrimiento de Raskolnikov ilustra que las decisiones contrarias al bien genuino no pueden llevar a la felicidad verdadera, sin importar cómo se justifiquen intelectualmente.
                </Text>
              </ScrollView>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => toggleModal(null)}
              >
                <Text style={styles.closeModalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Hábitos */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={activeModal === 'habitos'}
          onRequestClose={() => toggleModal(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Hábitos en Crimen y Castigo</Text>
              <ScrollView style={styles.modalTextContainer}>
                <Text style={styles.modalText}>
                  "Crimen y Castigo" ofrece un profundo estudio sobre cómo los hábitos determinan el carácter humano:
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Hábitos de aislamiento:</Text> Raskolnikov ha desarrollado el hábito del aislamiento social que facilita su separación moral del resto de la humanidad, permitiéndole considerar su teoría del superhombre sin confrontación externa.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Hábitos de generosidad:</Text> Personajes como Sonia encarnan hábitos positivos de sacrificio y compasión, ofreciendo un contrapunto moral. Su disposición habitual a ayudar a otros a pesar de sus propias dificultades revela una interiorización profunda de valores morales.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>La transformación de hábitos:</Text> La novela muestra cómo Raskolnikov comienza a transformarse gradualmente cuando empieza a practicar nuevos hábitos de apertura emocional, honestidad y reconocimiento de su responsabilidad.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>El autoengaño como hábito:</Text> Dostoyevski muestra magistralmente cómo el protagonista ha desarrollado el hábito del autoengaño intelectual, justificando acciones inmorales con teorías sofisticadas pero moralmente vacías.
                </Text>
                <Text style={styles.modalText}>
                  La redención de Raskolnikov comienza precisamente cuando empieza a romper con sus hábitos destructivos y a formar nuevos patrones de comportamiento basados en la honestidad y la conexión humana.
                </Text>
              </ScrollView>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => toggleModal(null)}
              >
                <Text style={styles.closeModalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Virtudes Cardinales */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={activeModal === 'virtudesCardinales'}
          onRequestClose={() => toggleModal(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Virtudes Cardinales en Crimen y Castigo</Text>
              <ScrollView style={styles.modalTextContainer}>
                <Text style={styles.modalText}>
                  En "Crimen y Castigo", las virtudes cardinales aparecen principalmente a través de su ausencia en Raskolnikov y su presencia en otros personajes:
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Prudencia:</Text> Raskolnikov carece de esta virtud al principio, pues aunque es inteligente, falla completamente en discernir su verdadero bien. Su razón está nublada por teorías abstractas desconectadas de la realidad moral. En contraste, personajes como Razumijin muestran prudencia al evaluar situaciones con sensatez.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Justicia:</Text> El protagonista viola fundamentalmente esta virtud al considerar que ciertos humanos están "por encima" de dar a otros lo que les corresponde (como el derecho a la vida). La novela explora profundamente las consecuencias de esta injusticia.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Fortaleza:</Text> La verdadera fortaleza aparece no en la capacidad de Raskolnikov para cometer el crimen, sino en el coraje moral que eventualmente desarrolla para confesar y aceptar su castigo. Sonia ejemplifica esta virtud en su capacidad para mantenerse íntegra a pesar de circunstancias extremadamente difíciles.
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.boldText}>Templanza:</Text> Raskolnikov carece inicialmente de templanza, dejándose dominar por pasiones intelectuales y orgullo desmedido. Su camino hacia la redención implica desarrollar mayor moderación en sus juicios y ambiciones.
                </Text>
                <Text style={styles.modalText}>
                  El arco narrativo de la novela puede verse como el recorrido de Raskolnikov hacia el reconocimiento y desarrollo gradual de estas virtudes, especialmente a través de la influencia de Sonia.
                </Text>
              </ScrollView>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => toggleModal(null)}
              >
                <Text style={styles.closeModalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
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
  bookDetails: {
    alignItems: 'center',
    padding: 20,
  },
  bookImage: {
    width: '70%',
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a2463',
    marginBottom: 6,
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bookDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  commentsSection: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0a2463',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  noCommentsText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  commentContainer: {
    backgroundColor: '#f0f4f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  addCommentContainer: {
    marginTop: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3e92cc',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  placeholderView: {
    width: 40,  // Para mantener el título centrado
  },
analysisButtonsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  paddingHorizontal: 10,
  marginVertical: 20,
},
analysisButton: {
  backgroundColor: 'rgba(62, 146, 204, 0.2)',
  borderWidth: 1,
  borderColor: '#3e92cc',
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 15,
  marginBottom: 12,
  width: '48%',
  alignItems: 'center',
},
analysisButtonText: {
  color: '#0a2463',
  fontWeight: '600',
  fontSize: 14,
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
  maxHeight: '80%',
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#0a2463',
  marginBottom: 16,
  textAlign: 'center',
},
modalTextContainer: {
  maxHeight: 400,
},
modalText: {
  fontSize: 15,
  lineHeight: 24,
  color: '#333',
  marginBottom: 12,
  textAlign: 'justify',
},
boldText: {
  fontWeight: 'bold',
},
closeModalButton: {
  backgroundColor: '#3e92cc',
  borderRadius: 12,
  padding: 14,
  alignItems: 'center',
  marginTop: 16,
},
closeModalButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},
});