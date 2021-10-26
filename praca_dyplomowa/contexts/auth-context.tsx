import React, { useState, useContext } from "react";
import { SignIn, SignUp } from "../services/auth-service";

type AuthContextModel = {
    account?: User,
    token?: string,
    error?: string,
    loading?: boolean,
    signin?: any,
    signup?: any,
    signout?: any
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
            setCurrentUser(auth.account);
            setCurrentToken(auth.token);
        }).catch((error: string) => {
            console.log(error);
            setError("An sign up error has occured");
        }).finally( ()=> {
            setLoading(false)
        });
    }

    const signin = (email: string, password: string) => {
        setLoading(true);
        SignIn(email,password).then( auth => {
            if (auth === undefined) {
                throw new Error("Some error");
            }
            setCurrentUser(auth.account);
            setCurrentToken(auth.token);
        }).catch( error => {
            console.log(error);
            setError("An sign in error has occured");
        }).finally( ()=> {
            setLoading(false)
        });
    }

    const signout = () => {
        setCurrentUser(undefined);
        setCurrentToken(undefined);
    }

    const value = {
        account: currentUser,
        token: currentToken,
        error: error,
        loading: loading,
        signup,
        signin,
        signout,
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