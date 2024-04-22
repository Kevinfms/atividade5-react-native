import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SearchContact(){
    const db = DatabaseConnection.getConnection();
    const navigation  = useNavigation();
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);

    const search=()=>{
        db.transaction(tx=>{
            tx.executeSql(
                "SELECT c.nome, c.data_nasc, t.numero FROM tbl_clientes c LEFT JOIN tbl_telefones_has_tbl_pessoa tp ON c.id = tp.id_pessoa LEFT JOIN tbl_telefones t ON tp.id_telefone = t.id WHERE c.nome LIKE ? OR t.numero LIKE ? ",
                [`%${input}%`, `%${input}%`],
                (_, {rows}) =>{
                    setResults(rows._array);
                }
            );
        });
    }

    const renderItem = ({item}) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('editContact', { id: item.id })}>
            <Text style={styles.itemText}>{item.nome}</Text>
        </TouchableOpacity>
    );

    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Pesquisar Cliente</Text>

            <TextInput style={styles.input} placeholder="Digite o nome ou número de telefone do cliente" value={input} onChangeText={text => setInput(text)}/>

            <TouchableOpacity style={styles.btn} onPress={search}>
                <Text style={styles.btnText}>Pesquisar</Text>
            </TouchableOpacity>

            <FlatList
                data={results}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#ccc',
        paddingTop: 20,
        alignItems:'center',
        justifyContent: 'center'
    },
    title:{
        color: 'white',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        marginBottom: 20,
        fontSize: 22,
        textTransform: 'uppercase'
    },
    input:{
        width: '90%',
        height: 35,
        borderWidth: 2,
        borderRadius: 10,
        borderColor:  '#6a4f7c',
        margin: 10
    },
    btn:{
        backgroundColor: '#5100FF',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black'
    },
    btnText:{
        textAlign: 'center'
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    itemText: {
        fontSize: 18,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
    }
})

