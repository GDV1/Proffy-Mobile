import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, AsyncStorage } from 'react-native';


import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { ScrollView, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';


function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<Number[]>([]);
    const [isfiltersVisible, setisfilterVisible] = useState(false);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function LoadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                })

                setFavorites(favoritedTeachersIds);
            }
        });
    }


    function handleToggleFiltersVisible() {
        setisfilterVisible(!isfiltersVisible);
    }

    async function handleFiltersSubmit() {
        LoadFavorites();
        const response = await api.get('classes', {
            params: {
                subject, week_day, time
            }
        });

        setisfilterVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys Disponíveis"
                headerRight={
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color='#FFF' />
                    </BorderlessButton>
                }
            >
                {isfiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholderTextColor="#C1BCCC"
                            style={styles.input}
                            placeholder="Qual a matéria"
                        />

                        <View style={styles.stylesInputGroup}>
                            <View style={styles.stylesInputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    placeholderTextColor="#C1BCCC"
                                    style={styles.input}
                                    placeholder="Qual o dia"
                                />
                            </View>
                            <View style={styles.stylesInputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholderTextColor="#C1BCCC"
                                    style={styles.input}
                                    placeholder="Qual horário"
                                />
                            </View>
                        </View>

                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher}  
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}

            </ScrollView>
        </View>
    )
}

export default TeacherList;