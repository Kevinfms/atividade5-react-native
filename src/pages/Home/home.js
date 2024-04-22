import React, {useEffect, useState} from "react";
import { StatusBar } from "expo-status-bar";
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import {DatabaseConnection} from '../../database/database';
import { useNavigation } from "@react-navigation/native";

const db = new DatabaseConnection.getConnection;

export default function Home(){
    const navigation = useNavigation();
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tbl_clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, data_nasc DATE)",
                [],
                () => console.log("Tabela 'tbl_clientes' criada com sucesso"),
                (_, error) => console.log("Erro ao criar tabela 'tbl_clientes':", error)
            );
    
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tbl_telefones (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT NOT NULL, tipo TEXT NOT NULL)",
                [],
                () => console.log("Tabela 'tbl_telefones' criada com sucesso"),
                (_, error) => console.log("Erro ao criar tabela 'tbl_telefones':", error)
            );
    
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS tbl_telefones_has_tbl_pessoa 
                (id_telefone INTEGER NOT NULL, id_pessoa INTEGER NOT NULL, 
                FOREIGN KEY (id_telefone) REFERENCES tbl_telefones (id), 
                FOREIGN KEY (id_pessoa) REFERENCES tbl_clientes (id))`,
                [],
                () => console.log("Tabela 'tbl_telefones_has_tbl_pessoa' criada com sucesso"),
                (_, error) => console.log("Erro ao criar tabela 'tbl_telefones_has_tbl_pessoa':", error)
            );
        });
    }, [todos]);

    function navegaRegister() {
        navigation.navigate('newContact')
    }

    function navegaShowAllContacts(){
        navigation.navigate('todosContatos')
    }

    function navegaSearchContacts(){
        navigation.navigate('searchContacts')
    }

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Lista de Telefones</Text>


            <TouchableOpacity style={styles.btn} onPress={()=> navegaRegister()}>
                <Text style={styles.btnText}>Cadastrar novo registro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={()=> navegaShowAllContacts()}>
                <Text style={styles.btnText}>Exibir Todos os Contatos</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.btn} onPress={()=> navegaSearchContacts()}>
                <Text style={styles.btnText}>Pesquisar um contato</Text>
            </TouchableOpacity>

            <StatusBar style="auto"/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    btn:{
        backgroundColor: 'darkblue',
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
    },
    btnText:{
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        fontFamily: 'monospace',
        color: '#fff'
    },
    title:{
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontFamily: 'monospace'
    }
})