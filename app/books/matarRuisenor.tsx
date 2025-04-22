import React, { useState } from 'react';
import {View,Text,StyleSheet,Image,SafeAreaView,ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,Alert,Modal} from 'react-native';
import { useComments } from '../../context/CommentsContext';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MatarRuisenor() {
  const { comments, loading, addComment, deleteComment, getCommentsByBook } = useComments();
  const [newComment, setNewComment] = useState('');
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const toggleModal = (modalName: string | null) => {setActiveModal(modalName);};
  
  // ID del libro - debería coincidir con el ID en la base de datos
  const bookId = "mockingbird";
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
              source={require('../../assets/images/book1.jpg')} 
              style={styles.bookImage} 
              resizeMode="contain"
            />
            
            <Text style={styles.bookTitle}>Matar un Ruiseñor</Text>
            <Text style={styles.bookAuthor}>Harper Lee</Text>
            
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

            <Text style={styles.bookDescription}></Text>
            
            <Text style={styles.bookDescription}>
              Una novela clásica que aborda temas de raza y justicia en el Sur de Estados Unidos 
              durante la década de 1930. Narrada a través de los ojos de Scout Finch, una niña 
              cuyo padre, el abogado Atticus Finch, defiende a un hombre negro acusado falsamente. 
              La obra es reconocida como una poderosa crítica al racismo y la injusticia, y ha 
              dejado una huella perdurable en la literatura mundial.
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
            <Text style={styles.modalTitle}>Bienes Básicos en Matar un Ruiseñor</Text>
            <ScrollView style={styles.modalTextContainer}>
              <Text style={styles.modalText}>
                "Matar un Ruiseñor" explora diversos bienes humanos básicos a través de su narrativa:
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>La vida como bien fundamental:</Text> La novela explora el valor intrínseco de la vida humana a través del juicio de Tom Robinson, cuya vida es devaluada por el sistema. La metáfora del ruiseñor —"matar un ruiseñor es pecado porque no hacen nada más que cantar para alegrarnos"— simboliza cómo la vida tiene valor por sí misma, no solo por su utilidad.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>La familia:</Text> A través de la relación entre Atticus y sus hijos se muestra una vida familiar saludable basada en la amistad familiar. Atticus no solo ejerce autoridad parental sino que cultiva afecto, reciprocidad y buenos deseos mutuos con Jem y Scout. El contraste con familias disfuncionales como los Ewell subraya la importancia de este bien.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>La amistad:</Text> Más allá de la familiar, la amistad entre Scout, Jem y Dill ilustra los tres ingredientes centrales: afecto genuino, reciprocidad en sus aventuras y preocupación por el bienestar mutuo. La transformación de la relación con Boo Radley muestra cómo la amistad supera el miedo y los prejuicios.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>El trabajo como autorrealización:</Text> Atticus encuentra dignidad y realización en su trabajo como abogado, no por prestigio o riqueza sino por la experiencia de contribuir a la justicia. La dedicación con la que defiende a Tom Robinson muestra cómo el trabajo puede ser una expresión de valores profundos y no mera subsistencia.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>La experiencia de la belleza:</Text> Las descripciones del condado de Maycomb, los cambios estacionales y los momentos de tranquilidad narrativa revelan cómo la apreciación de la belleza enriquece la vida de los personajes, especialmente en contraste con la fealdad moral del prejuicio racial.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>El conocimiento práctico y teórico:</Text> La educación que Atticus proporciona a sus hijos combina conocimiento teórico con sabiduría práctica. Su célebre consejo de "ponerse en los zapatos del otro" ejemplifica el conocimiento práctico que permite tomar mejores decisiones morales, mientras que la lucha de Scout con la educación formal muestra los límites del conocimiento puramente teórico.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>La armonía interior:</Text> Atticus personifica la armonía interna al coordinar sus acciones con sus principios, incluso cuando enfrenta presión social. El desarrollo moral de Scout a lo largo de la novela representa el proceso de búsqueda de esta armonía, aprendiendo a reconciliar sus impulsos con valores más profundos.
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
            <Text style={styles.modalTitle}>La Felicidad en Matar un Ruiseñor</Text>
            <ScrollView style={styles.modalTextContainer}>
              <Text style={styles.modalText}>
                En "Matar un Ruiseñor", la felicidad se explora a través de diferentes perspectivas:
              </Text>
              <Text style={styles.modalText}>
                Atticus Finch encarna una concepción profunda de la felicidad basada en la integridad y coherencia entre sus principios y acciones. Su tranquilidad interior proviene no de circunstancias externas favorables, sino de la conciencia de actuar rectamente, incluso cuando esto implica enfrentar la hostilidad social.
              </Text>
              <Text style={styles.modalText}>
                La novela contrasta esta visión de felicidad con la aparente satisfacción superficial de quienes participan en la injusticia colectiva contra Tom Robinson, sugiriendo que la complicidad con el mal social corrompe la posibilidad de una felicidad auténtica.
              </Text>
              <Text style={styles.modalText}>
                A través de los ojos de Scout, Harper Lee muestra cómo la felicidad infantil está conectada con el descubrimiento del mundo y el desarrollo de la comprensión moral. Su proceso de maduración implica reconciliar la inocencia con el conocimiento del mal, manteniendo la esperanza y la capacidad de asombro.
              </Text>
              <Text style={styles.modalText}>
                La obra sugiere que la verdadera felicidad no es posible sin justicia y reconocimiento de la dignidad humana, estableciendo un vínculo indisoluble entre el bienestar personal y la rectitud moral.
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
            <Text style={styles.modalTitle}>Hábitos en Matar un Ruiseñor</Text>
            <ScrollView style={styles.modalTextContainer}>
              <Text style={styles.modalText}>
                "Matar un Ruiseñor" ilustra cómo los hábitos configuran el carácter y las comunidades:
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Hábitos de integridad:</Text> Atticus Finch ha cultivado hábitos de integridad moral que le permiten actuar correctamente sin aparente esfuerzo. Su compromiso con la verdad y la justicia no es ocasional, sino una disposición permanente que define su carácter.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Hábitos sociales negativos:</Text> La novela muestra cómo el racismo en Maycomb no es simplemente una opinión, sino un hábito social arraigado que distorsiona el juicio moral colectivo. Los ciudadanos han interiorizado prejuicios que les impiden ver claramente la injusticia que cometen.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Formación del carácter:</Text> A través de la crianza de Jem y Scout, vemos cómo Atticus inculca hábitos de pensamiento crítico, empatía y respeto. No impone reglas arbitrarias, sino que fomenta disposiciones permanentes hacia el bien.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Transformación personal:</Text> Personajes como la Sra. Dubose demuestran la posibilidad de romper con hábitos destructivos (su adicción a la morfina) mediante la fortaleza de voluntad, revelando el vínculo entre hábitos, libertad y carácter.
              </Text>
              <Text style={styles.modalText}>
                La novela sugiere que tanto la virtud como el vicio se desarrollan a través de pequeñas decisiones repetidas que, con el tiempo, se convierten en disposiciones automáticas que definen quiénes somos.
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
            <Text style={styles.modalTitle}>Virtudes Cardinales en Matar un Ruiseñor</Text>
            <ScrollView style={styles.modalTextContainer}>
              <Text style={styles.modalText}>
                Las cuatro virtudes cardinales están ejemplificadas en "Matar un Ruiseñor", principalmente a través del personaje de Atticus Finch:
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Prudencia:</Text> Atticus demuestra esta virtud al discernir constantemente lo correcto en situaciones complejas. Su capacidad para evaluar cada circunstancia con sabiduría práctica, como cuando decide defender a Tom Robinson pese a saber que probablemente perderá, refleja un juicio prudencial ejemplar.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Justicia:</Text> El compromiso inquebrantable de Atticus con dar a cada uno lo que le corresponde, independientemente de su raza o posición social, encarna perfectamente esta virtud. Su defensa de Tom Robinson representa la justicia en su forma más pura frente a un sistema corrompido por el prejuicio.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Fortaleza:</Text> Atticus muestra valor moral al enfrentar la hostilidad de toda la comunidad por defender a un hombre negro. Su capacidad para mantenerse firme en sus convicciones a pesar de las amenazas y el ostracismo social ejemplifica la virtud de la fortaleza.
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Templanza:</Text> A lo largo de la novela, Atticus exhibe un perfecto dominio de sí mismo, moderando sus reacciones incluso ante las provocaciones más graves. Su capacidad para responder con calma y mesura cuando Bob Ewell le escupe en la cara demuestra un autocontrol extraordinario.
              </Text>
              <Text style={styles.modalText}>
                La novela sugiere que estas virtudes no son características innatas sino logros morales desarrollados mediante la práctica constante y la firme adhesión a principios éticos fundamentales.
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