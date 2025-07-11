import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: Date;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from Firestore
    const fetchUserProfile = async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data() as UserProfile);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    // Sign up function
    const signUp = async (email: string, password: string, displayName: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Update the user's display name
            await updateProfile(newUser, { displayName });

            // Create user profile in Firestore
            const userProfile: UserProfile = {
                uid: newUser.uid,
                email: newUser.email!,
                displayName,
                photoURL: newUser.photoURL || undefined,
                createdAt: new Date(),
            };

            await setDoc(doc(db, 'users', newUser.uid), userProfile);

            // Update local state immediately
            setUser(newUser);
            setUserProfile(userProfile);
        } catch (error) {
            console.error('Error signing up:', error);
            throw error;
        }
    };

    // Sign in function
    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    // Improved logout function with immediate state clearing
    const logout = async () => {
        console.log('AuthContext logout function called');
        try {
            console.log('Starting logout process...');
            console.log('Current user before logout:', user?.email);

            // Clear local state immediately for better UX
            setUser(null);
            setUserProfile(null);
            console.log('Local state cleared');

            // Then sign out from Firebase
            await signOut(auth);

            console.log('Firebase signOut completed');

        } catch (error) {
            console.error('Error during logout:', error);

            // Ensure state is cleared even if signOut fails
            setUser(null);
            setUserProfile(null);

            throw error;
        }
    };

    // Update user profile
    const updateUserProfile = async (displayName: string, photoURL?: string) => {
        if (!user) return;

        try {
            // Update Firebase Auth profile
            await updateProfile(user, { displayName, photoURL });

            // Update Firestore profile
            const updatedProfile = {
                ...userProfile!,
                displayName,
                photoURL,
            };

            await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
            setUserProfile(updatedProfile);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('Auth state changed:', firebaseUser?.uid || 'null');

            if (firebaseUser) {
                // User is signed in
                setUser(firebaseUser);
                await fetchUserProfile(firebaseUser.uid);
            } else {
                // User is signed out - clear all state
                console.log('User signed out, clearing state');
                setUser(null);
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextType = {
        user,
        userProfile,
        loading,
        signUp,
        signIn,
        logout,
        updateUserProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};