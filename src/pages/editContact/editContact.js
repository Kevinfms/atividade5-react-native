import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DatabaseConnection } from '../../database/database';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function EditContact(){
    const db = DatabaseConnection.getConnection();
    const  navigation = useNavigation();
    const  route = useRoute();
    const [cliente, setCliente] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [dataNasc, setDataNasc] = useState("");
    const [tel, setTel] = useState("");
    const {id}  = route.params;

    useEffect(()=>{
        loadCliente();
    }, []);

    const loadCliente = () =>{
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT c.nome, c.data_nasc, t.numero FROM tbl_clientes c LEFT JOIN tbl_telefones_has_tbl_pessoa tp ON c.id = tp.id_pessoa LEFT JOIN tbl_telefones t ON tp.id_telefone = t.id WHERE c.id = ?",
                [id],
                (_, {rows}) =>{
                    if(rows.length > 0){
                        setCliente(rows.item(0));
                        setName(rows.item(0).name);
                        setDataNasc(rows.item(0).data_nasc);
                        setTel(rows.item(0).numero);
                    }else{
                        Alert.alert("Erro", "Não foi encontrado o clinete");
                        navigation.goBack();
                    }
                },
                (_, error) =>{
                    Alert.alert("Erro", "Erro ao buscar um cliente");
                    console.error(error);
                    navigation.goBack();
                }
            );
        });
    };

    const goBack= () =>{
        navigation.goBack();
    };

    const saveChanges = () =>{
        db.transaction(tx =>{
            tx.executeSql(
                "UPDATE tbl_clientes SET name = ?, data_nasc = ? WHERE id=?",
                [name, dataNasc, id],
                (_) =>{
                    Alert.alert("Success", "Cliente atualizado com sucesso!");
                    setModalVisible(false);
                    loadCliente();
                },
                (_, error) =>{
                    Alert.alert("Error","Falha ao atualizar cliente!");
                    console.error(error);
                }
            );
            tx.executeSql(
                "UPDATE tbl_telefones SET numero =? WHERE id=?",
                [tel, id]
            )
        });
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza de que deseja excluir este cliente?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        db.transaction(tx => {
                            tx.executeSql(
                                'DELETE FROM tbl_telefones_has_tbl_pessoa WHERE id_pessoa = ?',
                                [id],
                                (_, { rowsAffected }) => {
                                    console.log(`${rowsAffected} registros na tabela tbl_telefones_has_tbl_pessoa excluídos com sucesso.`);
                                    tx.executeSql(
                                        'DELETE FROM Telefones WHERE id = ?',
                                        [id],
                                        (_, { rowsAffected }) => {
                                            console.log(`${rowsAffected} números de telefone excluídos com sucesso.`);
                                            tx.executeSql(
                                                'DELETE FROM Clientes WHERE id = ?',
                                                [id],
                                                (_, { rowsAffected }) => {
                                                    Alert.alert('Sucesso', `${rowsAffected} cliente(s) excluído(s) com sucesso.`);
                                                    navigation.goBack();
                                                },
                                                (_, error) => {
                                                    Alert.alert('Erro', 'Erro ao excluir cliente.');
                                                    console.error(error);
                                                }
                                            );
                                        },
                                        (_, error) => {
                                            console.error('Erro ao excluir números de telefone:', error);
                                        }
                                    );
                                },
                                (_, error) => {
                                    console.error('Erro ao excluir registros na tabela tbl_telefones_has_tbl_pessoa:', error);
                                }
                            );
                        });
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return(
        <SafeAreaView>
             {cliente ? (
                <View>
                    <Text style={styles.label}>Nome:</Text>
                    <Text style={styles.value}>{cliente.nome}</Text>
                    <Text style={styles.label}>Data de Nascimento:</Text>
                    <Text style={styles.value}>{cliente.data_nasc}</Text>
                    <Text style={styles.label}>Telefone:</Text>
                    <Text style={styles.value}>{telefone}</Text>
                </View>
            ) : (
                <Text style={styles.error}>Carregando...</Text>
            )}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
                <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Cliente</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            value={nome}
                            onChangeText={text => setName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Data de Nascimento"
                            value={dataNasc}
                            onChangeText={text => setDataNasc(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Telefone"
                            value={telefone}
                            onChangeText={text => setTel(text)}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                            <Text style={styles.buttonText}>Salvar Alterações</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Fechar</Text>
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
        padding: 20,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 20,
    },
    error: {
        fontSize: 16,
        color: 'red',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#5127AA',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        width: '48%',
    },
    goBackButton: {
        backgroundColor: '#5127AA',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#6F3FFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        marginTop: 20,
    },
    closeButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        marginTop: 10,
    },
});