import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TodosContatos(){
    const db = DatabaseConnection.getConnection;
    const [clientes, setClientes] = useState([]);
    const navigation = useNavigation();

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus',()=>{
            carregaClientes();
        })

        return unsubscribe;
    }, [navigation]);

    const carregaClientes =()=>{
        db.transaction(tx=>{
            tx.executeSql(
                "SELECT * FROM tbl_clientes",
                [],
                (_, {rows}) =>{
                    setClientes(rows._array);
                }
            );
        });
    }


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('editContact', { id: item.id })}>
            <Text style={styles.itemText}>{item.nome}</Text>
        </TouchableOpacity>
    );

    const handleNavegateToNewContact= () =>{
        navigation.navigate('newContact')
    };

    return(
        <SafeAreaView>
            <View style={styles.header}>
                <Text style={styles.headerText}>Lista de Clientes</Text>
            </View>
            <FlatList
                data={clientes}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={clientes.length === 0 && styles.emptyListContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cliente cadastrado.</Text>}
            />
            <TouchableOpacity style={styles.button} onPress={handleNavegateToNewContact}>
                <Text style={styles.buttonText}>Cadastrar Novo Cliente</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'monospace',
        textTransform: 'uppercase'
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    },
    emptyListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#5300A0',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
});