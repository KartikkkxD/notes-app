import React, { useState, createContext, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthContext = createContext();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NotesApp</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={() => login(email)} />
      <View style={styles.link}>
        <Button title="Don't have an account? Sign Up" color="gray" onPress={() => navigation.navigate('Signup')} />
      </View>
    </View>
  );
}

function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign Up" onPress={() => login(email)} />
      <View style={styles.link}>
        <Button title="Already have an account? Login" color="gray" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function DashboardScreen({ navigation }) {
  const { notes, deleteNote } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.dashboardTitle}>My Notes</Text>
        <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      </View>
      
      {notes.length === 0 ? <Text style={styles.emptyText}>No notes yet.</Text> : (
        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteContent}>{item.content}</Text>
              <View style={styles.deleteBtn}>
                <Button title="Delete" color="red" onPress={() => deleteNote(item.id)} />
              </View>
            </View>
          )}
        />
      )}
      
      <View style={{ marginTop: 20 }}>
        <Button title="Create New Note" onPress={() => navigation.navigate('CreateNote')} />
      </View>
    </View>
  );
}

function CreateNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createNote } = useContext(AuthContext);

  const handleCreate = () => {
    if (title && content) {
      createNote(title, content);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Note</Text>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput 
        style={[styles.input, { height: 100 }]} 
        placeholder="Content" 
        value={content} 
        onChangeText={setContent} 
        multiline 
      />
      <Button title="Save Note" onPress={handleCreate} />
    </View>
  );
}

function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.centerContainer}>
      <View style={styles.profileAvatar}>
        <Text style={styles.avatarText}>{user ? user.substring(0, 2).toUpperCase() : 'U'}</Text>
      </View>
      <Text style={styles.profileEmail}>{user}</Text>
      <View style={{ marginTop: 30, width: 200 }}>
        <Button title="Logout" color="red" onPress={logout} />
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  const login = (email) => {
    if(email) setUser(email);
  };
  
  const logout = () => {
    setUser(null);
    setNotes([]);
  };

  const createNote = (title, content) => {
    setNotes([...notes, { id: Date.now().toString(), title, content }]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, notes, createNote, deleteNote }}>
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
              <Stack.Screen name="CreateNote" component={CreateNoteScreen} options={{ title: 'Create Note' }} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  link: {
    marginTop: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20
  },
  card: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  noteContent: {
    fontSize: 16,
    color: '#444'
  },
  deleteBtn: {
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    color: '#666',
  },
  profileEmail: {
    fontSize: 18,
    color: '#333',
  }
});
