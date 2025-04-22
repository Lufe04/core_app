import React from "react";
import {Text, View, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView} from "react-native";
import { useRouter } from "expo-router";

// Datos de ejemplo para libros con imágenes locales
const libros: Libro[] = [
  {
    id: '1',
    titulo: 'Matar un Ruiseñor',
    autor: 'Harper Lee',
    imagen: require('../assets/images/book1.jpg'),
    ruta: '/books/matarRuisenor'
  },
  {
    id: '2',
    titulo: 'El señor de Los Anillos',
    autor: 'J.R.R. Tolkien',
    imagen: require('../assets/images/book2.jpg'),
    ruta: '/books/senorAnillo'
  },
  {
    id: '3',
    titulo: 'Sin miedo a volar',
    autor: 'Simone Biles',
    imagen: require('../assets/images/book3.jpg'),
    ruta: '/books/sinMiedoVolar'
  },
  {
    id: '4',
    titulo: 'Crimen y Castigo',
    autor: 'Fiodor Dostoyevski',
    imagen: require('../assets/images/book4.jpg'),
    ruta: '/books/crimenCastigo'
  },
];

// Datos de ejemplo para temas
const temas: Tema[] = [
  { id: '1', titulo: 'Bienes Basicos Humanos', ruta: '/topics/bienesBasicos' },
  { id: '2', titulo: 'Hábitos', ruta: '/topics/habitos' },
  { id: '3', titulo: 'Virtudes Cardinales', ruta: '/topics/virtudesCardinales' },
  { id: '4', titulo: 'Felicidad', ruta: '/topics/felicidad' },
];

interface Libro {
  id: string;
  titulo: string;
  autor: string;
  imagen: any;
  ruta: "/books/matarRuisenor" | "/books/senorAnillo" | "/books/sinMiedoVolar" | "/books/crimenCastigo";
}

interface Tema {
  id: string;
  titulo: string;
  ruta: "/topics/bienesBasicos" | "/topics/habitos" | "/topics/virtudesCardinales" | "/topics/felicidad";
}

export default function Index() {
  const router = useRouter();

  const handleLibroPress = (libro: Libro) => {
    console.log("Libro seleccionado:", libro.titulo);
    router.push(libro.ruta);
  };
  
  const handleTemaPress = (tema: Tema) => {
    console.log("Tema seleccionado:", tema.titulo);
    router.push(tema.ruta);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Core IV</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Sección de Libros */}
        <Text style={styles.sectionTitle}>Libros Recomendados</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.booksContainer}
        >
          {libros.map((libro) => (
            <TouchableOpacity 
              key={libro.id} 
              style={styles.bookItem}
              onPress={() => handleLibroPress(libro)}
            >
              <Image source={libro.imagen} style={styles.bookImage} />
              <Text style={styles.bookTitle} numberOfLines={1}>{libro.titulo}</Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>{libro.autor}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Sección de Temas */}
        <Text style={styles.sectionTitle}>Temas del Curso</Text>
        <View style={styles.topicsContainer}>
          {temas.map((tema) => (
            <TouchableOpacity 
              key={tema.id} 
              style={styles.topicItem}
              onPress={() => handleTemaPress(tema)}
            >
              <Text style={styles.topicTitle}>{tema.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... estilos existentes ...
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    backgroundColor: '#0a2463',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16,
    color: '#333',
  },
  booksContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  bookItem: {
    width: 120,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 8,
    paddingBottom: 4,
    color: '#0a2463',
  },
  bookAuthor: {
    fontSize: 12,
    padding: 8,
    paddingTop: 0,
    color: '#667',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  topicItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3e92cc',
    textAlign: 'center',
  },
});