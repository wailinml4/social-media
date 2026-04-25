import { createContext, useContext, useState, useEffect } from "react"
import {
	signupService,
	loginService,
	checkAuthService,
	logoutService,
	verifyEmailService,
	resendVerificationEmailService,
	forgotPasswordService,
	resetPasswordService,
} from "../services/authService.js"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isSigningUp, setIsSigningUp] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
	const [isResendingVerificationEmail, setIsResendingVerificationEmail] = useState(false);
	const [isSendingForgotPassword, setIsSendingForgotPassword] = useState(false);
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const [error, setError] = useState(null);
	const isAuthenticated = !!user;

	const signup = async (fullName, email, password, confirmPassword) => {
		try {
			setIsSigningUp(true);
			const response = await signupService(fullName, email, password, confirmPassword);
			setUser(response);
			setError(null);
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setIsSigningUp(false);
		}
	};

	const login = async (email, password) => {
		try {
			setIsLoggingIn(true);
			const response = await loginService(email, password);
			setUser(response);
			setError(null);
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setIsLoggingIn(false);
		}
	};

	const logout = async () => {
		try {
			setIsLoggingOut(true);
			await logoutService();
			setUser(null);
			setError(null);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const checkAuth = async () => {
		try {
			setIsCheckingAuth(true);
			const response = await checkAuthService();
			setUser(response);
			setError(null);
		} catch (error) {
			setUser(null);
		} finally {
			setIsCheckingAuth(false);
		}
	};

	const verifyEmail = async (verificationCode) => {
		try {
			setIsVerifyingEmail(true);
			const response = await verifyEmailService(verificationCode);
			setUser(response);
			setError(null);
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setIsVerifyingEmail(false);
		}
	};

	const resendVerificationEmail = async (email) => {
		try {
			setIsResendingVerificationEmail(true);
			await resendVerificationEmailService(email);
			setError(null);
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setIsResendingVerificationEmail(false);
		}
	};

	const forgotPassword = async (email) => {
		try {
			setIsSendingForgotPassword(true);
			await forgotPasswordService(email);
			setError(null);
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setIsSendingForgotPassword(false);
		}
	};

	const resetPassword = async (resetPasswordToken, password) => {
		try {
			setIsResettingPassword(true);
			await resetPasswordService(resetPasswordToken, password);
			setError(null);
		} catch (error) {
			setError(error.message);
			throw error;
		} finally {
			setIsResettingPassword(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				isAuthenticated,
				isCheckingAuth,
				isSigningUp,
				isLoggingIn,
				isLoggingOut,
				isVerifyingEmail,
				isResendingVerificationEmail,
				isSendingForgotPassword,
				isResettingPassword,
				error,
				signup,
				login,
				logout,
				verifyEmail,
				resendVerificationEmail,
				forgotPassword,
				resetPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
