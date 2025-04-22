import React, { useState } from 'react';
import {View,Text,StyleSheet,Image,SafeAreaView,ScrollView,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,Alert,Modal} from 'react-native';
import { useComments } from '../../context/CommentsContext';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SenorAnillos() {
  const { comments, loading, addComment, deleteComment, getCommentsByBook } = useComments();
  const [newComment, setNewComment] = useState('');
  const router = useRouter();
  // ID del libro - debería coincidir con el ID en la base de datos
  const bookId = "lotr";
  const bookComments = getCommentsByBook(bookId);
   const [activeModal, setActiveModal] = useState<string | null>(null);
    const toggleModal = (modalName: string | null) => {setActiveModal(modalName);};
  
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
              source={require('../../assets/images/book2.jpg')} 
              style={styles.bookImage} 
              resizeMode="contain"
            />
            
            <Text style={styles.bookTitle}>El Señor de los Anillos</Text>
            <Text style={styles.bookAuthor}>J.R.R. Tolkien</Text>
            
            {renderStars(5)}

            {/* Botones de Análisis */}
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
              Una épica historia de fantasía ambientada en la Tierra Media, donde diversas razas 
              se unen para destruir un anillo mágico de gran poder antes de que caiga en manos 
              del Señor Oscuro Sauron. La trilogía narra el viaje del hobbit Frodo Bolsón y sus 
              compañeros en una peligrosa misión para destruir el Anillo Único en las llamas 
              del Monte del Destino. Considerada una de las obras más influyentes de la literatura 
              fantástica moderna.
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
      <Text style={styles.modalTitle}>Bienes Básicos en El Señor de los Anillos</Text>
      <ScrollView style={styles.modalTextContainer}>
        <Text style={styles.modalText}>
          En "El Señor de los Anillos", Tolkien presenta una exploración profunda de los bienes humanos básicos:
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>La amistad:</Text> Constituye uno de los bienes más valorados en la obra. La Comunidad del Anillo ejemplifica los tres ingredientes centrales de la amistad genuina: afecto (como el que existe entre Frodo y Sam), reciprocidad (la lealtad mutua entre los miembros) y buenos deseos mutuos (el deseo de todos por el bienestar común). Las relaciones entre Sam y Frodo, Merry y Pippin, o Legolas y Gimli muestran cómo la amistad trasciende fronteras raciales y sociales.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>La comunidad y familia:</Text> Los hobbits de la Comarca viven en una comunidad donde los vínculos familiares son fundamentales. La obra muestra cómo una vida familiar y comunitaria saludable requiere de otros bienes como la amistad. El contraste con Mordor, donde existen relaciones basadas únicamente en el miedo y el poder, subraya la importancia de estos bienes.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>La experiencia de la belleza:</Text> Tolkien presenta los reinos élficos como lugares de extraordinaria belleza que enriquecen la vida y el espíritu. Rivendell y Lothlórien representan espacios donde la armonía con la naturaleza y la apreciación estética son fundamentales. El contraste con las tierras devastadas por Sauron enfatiza cómo la belleza es esencial para una vida plena.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>El conocimiento y la sabiduría:</Text> Personajes como Gandalf y Elrond encarnan la búsqueda del conocimiento como bien en sí mismo. La obra distingue claramente entre el conocimiento que busca dominio y poder (como el de Saruman) y aquel orientado hacia la sabiduría y el bien común (como el de Gandalf), mostrando la diferencia entre el conocimiento instrumental y el intrínsecamente valioso.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>La armonía interior:</Text> La lucha de Frodo contra la influencia del Anillo ilustra la importancia de mantener la armonía interior frente a fuerzas que intentan corromperla. Su eventual fracaso en el Monte del Destino y la intervención de Gollum demuestran la dificultad de mantener esta armonía bajo presión extrema, pero también la posibilidad de redención.
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
      <Text style={styles.modalTitle}>La Felicidad en El Señor de los Anillos</Text>
      <ScrollView style={styles.modalTextContainer}>
        <Text style={styles.modalText}>
          Tolkien ofrece una visión profunda de la felicidad a través de diferentes personajes y sociedades:
        </Text>
        <Text style={styles.modalText}>
          La obra contrasta dos concepciones opuestas de felicidad: la de los hobbits de la Comarca, basada en la simplicidad, la comunidad y el disfrute de placeres cotidianos, frente a la búsqueda de poder absoluto de Sauron, que representa la distorsión completa de los deseos.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>Felicidad y libertad:</Text> La obra muestra que la verdadera felicidad requiere libertad moral. El Anillo ofrece poder ilimitado pero esclaviza la voluntad de quien lo porta, ilustrando que ciertas elecciones, aunque aparentemente nos ofrecen lo que deseamos, terminan destruyendo nuestra capacidad de ser felices.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>El hedonismo insuficiente:</Text> La vida confortable de la Comarca es valorada pero insuficiente para una felicidad completa. Los hobbits que participan en la misión descubren que el compromiso con causas mayores, aunque conlleve sufrimiento, proporciona una satisfacción más profunda que el mero placer.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>La decisión virtuosa:</Text> Al final de la novela, Frodo no puede disfrutar de la paz recuperada en la Comarca debido a sus heridas físicas y psicológicas. Sin embargo, su decisión de asumir la misión del Anillo, aunque le costó su propia felicidad inmediata, permitió la felicidad de muchos otros, ilustrando una visión de la felicidad vinculada al sacrificio y la virtud.
        </Text>
        <Text style={styles.modalText}>
          Tolkien sugiere que la felicidad verdadera surge de una vida balanceada que integra comunidad, simplicidad, propósito moral y la apreciación de la belleza, no de la acumulación de poder o la mera satisfacción de deseos.
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
      <Text style={styles.modalTitle}>Hábitos en El Señor de los Anillos</Text>
      <ScrollView style={styles.modalTextContainer}>
        <Text style={styles.modalText}>
          "El Señor de los Anillos" ilustra magistralmente cómo los hábitos forman el carácter y determinan nuestras acciones:
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>Hábitos y carácter:</Text> Los hobbits muestran cómo los hábitos cotidianos de simplicidad, trabajo honesto y lealtad forman un carácter resistente a la corrupción. Sam Gamgee, con sus hábitos de servicio y lealtad, manifiesta una fortaleza moral que supera incluso las tentaciones del Anillo.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>Hábitos corruptores:</Text> La transformación de Sméagol en Gollum ilustra cómo los hábitos negativos pueden deformar gradualmente la personalidad hasta hacerla irreconocible. Su obsesión con el Anillo comenzó con un acto de violencia que se convirtió en una pauta habitual de comportamiento, transformando completamente su carácter.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>El poder transformador de nuevos hábitos:</Text> Gimli y Legolas superan siglos de hostilidad entre enanos y elfos formando nuevos hábitos de cooperación y aprecio mutuo, demostrando que incluso los prejuicios más arraigados pueden transformarse mediante la formación de nuevas disposiciones.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>Continencia vs. virtud:</Text> El contraste entre Boromir y Aragorn muestra la diferencia entre continencia y virtud plena. Boromir conoce lo correcto pero sus deseos no están alineados, cayendo eventualmente ante la tentación del Anillo. Aragorn, aunque tentado, ha desarrollado hábitos virtuosos que alinean sus deseos con el bien.
        </Text>
        <Text style={styles.modalText}>
          La obra muestra que frente a grandes pruebas morales, respondemos según los hábitos que hemos cultivado previamente. Los personajes que han formado hábitos virtuosos pueden resistir tentaciones que otros, incluso con buenas intenciones iniciales, no pueden superar.
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
      <Text style={styles.modalTitle}>Virtudes Cardinales en El Señor de los Anillos</Text>
      <ScrollView style={styles.modalTextContainer}>
        <Text style={styles.modalText}>
          Las cuatro virtudes cardinales están representadas vívidamente a través de los personajes principales:
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>Prudencia:</Text> Gandalf encarna la prudencia como guía de las demás virtudes. Su capacidad para discernir el verdadero bien en circunstancias complejas se muestra en decisiones como rechazar el Anillo, confiar en Frodo para la misión y reconocer que la fuerza militar no bastaría contra Sauron. Demuestra memoria (conocimiento de la historia de la Tierra Media), docilidad (consulta con Elrond y otros sabios), sagacidad (encuentra soluciones creativas) y circunspección (considera todas las circunstancias).
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>Justicia:</Text> Aragorn personifica la justicia al reconocer lo debido a cada uno. Respeta los derechos de los hobbits cuando los encuentra, honra sus compromisos con Gondor, y al convertirse en rey, establece un gobierno justo. Faramir también muestra esta virtud al tratar honorablemente a Frodo y Sam, respetando su misión aunque la ley le permitiría tomar el Anillo.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>Fortaleza:</Text> Sam Gamgee ejemplifica la fortaleza, manteniendo firmeza en las dificultades y constancia en la búsqueda del bien. Su perseverancia en Mordor, incluso cuando toda esperanza parece perdida, representa la esencia de esta virtud. Frodo también muestra fortaleza al soportar el peso creciente del Anillo, resistiendo su influencia más allá de lo que parecía posible.
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.boldText}>Templanza:</Text> Frodo demuestra templanza en su relación con el Anillo, moderando su atracción hacia el poder que podría obtener con él. Los hobbits en general representan una vida de templanza, alejada de excesos y ambición desmedida. Este contraste es evidente frente a personajes como Saruman, quien sucumbe a deseos desmedidos de poder y conocimiento.
        </Text>
        <Text style={styles.modalText}>
          La victoria final en la historia no se logra mediante la fuerza bruta sino a través del ejercicio de estas virtudes por parte de personajes aparentemente insignificantes, sugiriendo que la grandeza moral verdadera reside en la integración de estas cuatro disposiciones fundamentales.
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