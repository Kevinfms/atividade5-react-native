import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TodosContatos from './src/pages/todosContatos/todosContatos';
import editContact from './src/pages/editContact/editContact';
import home from './src/pages/Home/home';
import newContact from './src/pages/newContact/newContact';
import searchContact from './src/pages/searchContacts/searchContacts';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='TodosContatos' component={TodosContatos} options={{title:'Todos os Contatos'}}/>
          <Stack.Screen name='EditContact' component={editContact} options={{title: 'Editar Contato'}}/>
          <Stack.Screen name='home' component={home} options={{title: 'Home'}}/>
          <Stack.Screen name='newContact' component={newContact} options={{title: 'Novo Registro'}}/>
          <Stack.Screen name='searchContact' component={searchContact} options={{title: 'Procurar Contato'}}/> 
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

