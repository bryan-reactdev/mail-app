import { Button } from "@/components/ui/button";
import { loginSchema } from "@/types/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/stores/useUserStore";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

export default function Login() {
    const { login, isLogging } = useUserStore();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        const res = await login(data);

        if (res) {
            navigate("/");
        }
    }

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center bg-black p-4 sm:p-6 md:p-8">
            {/* Background Image */}
            <div 
                className="absolute inset-0 w-full h-full bg-cover bg-left sm:bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
                }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 w-full h-full bg-black/80" />
            
            {/* Content */}
            <div className="relative z-10 w-full max-w-md p-4 sm:p-6 md:p-8 bg-card/98 backdrop-blur-md border border-border rounded-lg shadow-2xl">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                            Login
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                            Sign in to your account
                        </p>
                        <div className="mt-3 p-2 sm:p-3 bg-muted/50 rounded-md border border-border/50">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Enter your credentials to access your account
                            </p>
                        </div>
                    </div>

                    <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-login-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-login-email"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your email"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-login-password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-login-password"
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]}/>
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
                            <Button type="submit" className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base" size="lg" form="form-login" disabled={isLogging}>
                                {isLogging ? <Spinner /> : "Sign In"}
                            </Button>
                        </div>
                    </form>
            </div>
        </div>
    );
}

