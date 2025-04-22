import React, { useState } from 'react';
import {View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import { useComments } from '../../context/CommentsContext';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SinMiedoAVolar() {
  const { comments, loading, addComment, deleteComment, getCommentsByBook } = useComments();
  const [newComment, setNewComment] = useState('');
    const router = useRouter();
  
  // ID del libro - debería coincidir con el ID en la base de datos
  const bookId = "sinMiedoAVolar";
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
              source={require('../../assets/images/book3.jpg')} 
              style={styles.bookImage} 
              resizeMode="contain"
            />
            
            <Text style={styles.bookTitle}>Sin miedo a volar</Text>
            <Text style={styles.bookAuthor}>Simone Biles</Text>
            
            {renderStars(5)}
            
            <Text style={styles.bookDescription}>
              En esta inspiradora autobiografía, la gimnasta olímpica Simone Biles comparte 
              su extraordinario viaje desde la niñez hasta convertirse en una de las 
              atletas más condecoradas de todos los tiempos. A través de sus palabras, 
              Biles revela los desafíos personales que enfrentó, su dedicación al deporte 
              y cómo aprendió a superar el miedo para alcanzar la excelencia. Una historia 
              de resiliencia, determinación y el poder de creer en uno mismo frente a las 
              adversidades.
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
  }
});