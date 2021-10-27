import React, { useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignIn, SignUp } from "../services/auth-service";
import jwtDecode from "jwt-decode";

type AuthContextModel = {
    account?: User,
    token?: string,
    error?: string,
    loading?: boolean,
    signin?: any,
    signup?: any,
    signout?: any,
    resetError?: any,
    validateToken?: any
}

export const getErrorMessage = (errorCode: number): string => {
    switch (errorCode){
        case 401: {
            return "Invalid login or password";
        }
        case 408: {
            return "Unable to connect to the server";
        }
        case 409: {
            return "This email has already been used";
        }
    }
    return "An error has occurred";
}

export const AuthContext = React.createContext<AuthContextModel>({});

export const AuthProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState<User>();
    const [currentToken, setCurrentToken] = useState<string>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        loadStorageData();
    })

    const loadStorageData = async (): Promise<void> => {
        try {
            const authDataSerialized = await AsyncStorage.getItem('@AuthData');
            if (authDataSerialized) {
                const _authData: AuthModel = JSON.parse(authDataSerialized);
                if (validateToken(_authData.token)) {
                    setCurrentUser(_authData.account);
                    setCurrentToken(_authData.token);
                } else {
                    await signout();
                }
            }
        } catch (error) {
        }finally {
            setLoading(false);
        }
    }

    const signup = (email: string, password: string) => {
        setLoading(true);
        SignUp(email,password).then( auth => {
            if (auth === undefined) {
                setError('Unhandled sign up error');
                return;
            }
            setCurrentUser(auth.account);
            setCurrentToken(auth.token);
            const data: AuthModel = {
                account: auth.account,
                token: auth.token
            }
            AsyncStorage.setItem('@AuthData', JSON.stringify(data));
        }).catch((error: number) => {
            setError(getErrorMessage(error));
        }).finally( ()=> {
            setLoading(false)
        });
    }

    const signin = (email: string, password: string) => {
        setLoading(true);
        SignIn(email,password).then( auth => {
            if (auth === undefined) {
                setError('Unhandled sign in error');
                return;
            }
            setCurrentUser(auth.account);
            setCurrentToken(auth.token);
            const data: AuthModel = {
                account: auth.account,
                token: auth.token
            }
            AsyncStorage.setItem('@AuthData', JSON.stringify(data));
        }).catch( error => {
            setError(getErrorMessage(error));
        }).finally( ()=> {
            setLoading(false)
        });
    }

    const signout = async () => {
        await AsyncStorage.removeItem('@AuthData');
        setCurrentUser(undefined);
        setCurrentToken(undefined);
    }

    const validateToken = (token: string): boolean => {
        const { exp }:any = jwtDecode(token);
        const expirationTime = (exp * 1000) - 60000;
        if (Date.now() >= expirationTime) {
            return false;
        }
        return true;
    }

    const resetError = () => {
        setError("");
    }

    const value = {
        account: currentUser,
        token: currentToken,
        error: error,
        loading: loading,
        signup,
        signin,
        signout,
        resetError,
        validateToken
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextModel => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context;
}

export default AuthProvider;