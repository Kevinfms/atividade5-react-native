import React, {useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from  'react-native';
import { DatabaseConnection } from "../../database/database";
import { SafeAreaView } from "react-native-safe-area-context";



export default function NewContact(){
    const db = DatabaseConnection.getConnection;
    const [name, setName] = useState("");
    const [dataNasc, setDataNasc] = useState("");
    const [telefone, setTelefone] = useState("");


    const newRecord = () => {
        db.transaction(tx=>{
            tx.executeSql(
                "INSERT INTO tbl_clientes (nome, dataNasc) VALUES (?,?)" ,
                [name, dataNasc],
                (_, resultCliente) =>{
                    console.log("Success",resultCliente);
                    const idCliente = resultCliente.insertId;

                    tx.executeSql(
                        "INSERT INTO tbl_telefones (numero) VALUES (?) ",
                        [telefone],
                        (_, resulTel) =>{
                            console.log("success",resulTel);
                            const  idTel = resulTel.insertId;
                            
                            tx.executeSql(
                                "INSERT INTO tbl_telefones_has_tbl_pessoa (id_pessoa, id_telefone) values (?, ?)",
                                [idCliente, idTel],
                                (_, results) => {
                                    console.log("success",results);
                                    Alert.alert("info", "Registro inserido com sucesso");
                                    setName("");
                                    setDataNasc("");
                                    setTelefone("");
                                },
                                (error) => console.log("Erro ao inseridos os dados", error)
                            );
                        },
                        (error) => console.log("Erro ao inserir o número", error)
                    );
                },
                (error)=>console.log("Erro ao inserir  o cliente", error)
            );
        });
    };

    return(
        <SafeAreaView  style={styles.container}>
            
                <Text style={styles.title}>Insira Seus dados</Text>

                <View style={styles.viewInputs}>
                    <TextInput style={styles.inputs} placeholder="Insira seu Nome" value={name} onChangeText={text => setName(text)}/>
                </View>
                
                <View style={styles.viewInputs}>
                    <TextInput style={styles.inputs} placeholder="Insira sua data de nascimento" value={dataNasc} onChangeText={text => setDataNasc(text)}/>
                </View>
                
                <View style={styles.viewInputs}>
                    <TextInput style={styles.inputs} placeholder="Insira seu número" value={telefone} onChangeText={text => setTelefone(text)}/>
                </View>
                

                <TouchableOpacity style={styles.btn} onPress={newRecord}>
                    <Text style={{textAlign: 'center', fontFamily: 'monospace', fontSize: 18, color: 'white'}}>Cadastrar</Text>
                </TouchableOpacity>
            
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#55504E',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title:{
        color: 'white',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        marginBottom: 20,
        fontSize: 22,
        textTransform: 'uppercase'
    },
    inputs:{
        backgroundColor: 'white',
        padding: 5,
        borderColor: 'purple',
        margin: 10,
        fontSize: 20,
        fontFamily: 'monospace',
        color: 'black',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'purple'
    },
    viewInputs:{
        width: '100%'
    },
    btn:{
        backgroundColor: 'purple',
        width: '93%',
        borderRadius: 10,
        height: 40,
        alignSelf:'center',
        justifyContent: 'center',
    }
})

