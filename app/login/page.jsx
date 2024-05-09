"use client";

import { ImSpinner8 } from "react-icons/im";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaHandSparkles } from "react-icons/fa";
import Link from "next/link";
import { useForm } from "react-hook-form";

const loginPage = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("/login", data);
            router.push("/");
        } catch (err) {
            if (err.response) {
                setError("root", {
                    message: err.response.data,
                });
            } else {
                setError("root", {
                    message: "An error accured, please try again later.",
                });
            }
        }
    };
    return (
        <>
            <Link className="logo" href="/">
                <FaHandSparkles size={25} />
                <span>WeDecide</span>
            </Link>
            <main className="login-section">

                <h1>Sign in to your account</h1>
                <p>Enter your Email and password below to sign in</p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ opacity: isSubmitting ? 0.85 : 1 }}
                    className="auth-form"
                >
                    {errors.root && (
                        <span className="root-error">{errors.root?.message}</span>
                    )}
                    <label>
                        <span className="input-label">Email:</span>
                        {errors.email && (
                            <span className="email-password-error">
                                {errors.email?.message}
                            </span>
                        )}
                        <input
                            style={{
                                border: errors.email ? "1px #EF4444 solid" : "",
                                cursor: isSubmitting ? "not-allowed" : "text",
                            }}
                            className="form-input"
                            placeholder="example@gmail.com"
                            disabled={isSubmitting}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                    </label>

                    <label>
                        <span className="input-label">Password:</span>
                        {errors.password && (
                            <span className="email-password-error">
                                {errors.password?.message}
                            </span>
                        )}
                        <input
                            style={{
                                border: errors.password ? "1px #EF4444 solid" : "",
                                cursor: isSubmitting ? "not-allowed" : "text",
                            }}
                            className="form-input"
                            placeholder="Password"
                            type="password"
                            disabled={isSubmitting}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long",
                                },
                            })}
                        />
                    </label>

                    { }

                    <button
                        className="submit-button"
                        style={{ cursor: isSubmitting ? "default" : "pointer" }}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ImSpinner8 className="spinner" size={25} />
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
            </main>
        </>
    );
};

export default loginPage;
