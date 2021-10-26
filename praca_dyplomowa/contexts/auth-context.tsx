import React, { useState, useContext } from "react";
import { SignIn, SignUp } from "../services/auth-service";

type AuthContextModel = {
    account?: User,
    token?: string,
    error?: string,
    loading?: boolean,
    signin?: any,
    signup?: any,
    signout?: any,
    resetError?: any
}

export const getErrorMessage = (errorCode: number): string => {
    console.log(`${errorCode}`);
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

    const signup = (email: string, password: string) => {
        setLoading(true);
        SignUp(email,password).then( auth => {
            if (auth === undefined) {
                setError('Unhandled sign up error');
                return;
            }
            setCurrentUser(auth.account);
            setCurrentToken(auth.token);
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
        }).catch( error => {
            setError(getErrorMessage(error));
        }).finally( ()=> {
            setLoading(false)
        });
    }

    const signout = () => {
        setCurrentUser(undefined);
        setCurrentToken(undefined);
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
        resetError
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