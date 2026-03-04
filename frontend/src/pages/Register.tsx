import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { registerPageSchema } from "@/types/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/stores/useUserStore";
import { useNavigate, Link } from "react-router-dom";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";

export default function Register() {
    const { register: registerUser, isRegisteringUser } = useUserStore();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof registerPageSchema>>({
        resolver: zodResolver(registerPageSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
        },
    });

    async function onSubmit(data: z.infer<typeof registerPageSchema>) {
        const success = await registerUser(data);
        if (success) {
            navigate("/login");
        }
    }

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center bg-black p-4 sm:p-6 md:p-8">
            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-left sm:bg-center bg-no-repeat bg-white"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/40 to-black/70" />

            {/* Content */}
            <Card className="relative z-10 w-full max-w-md bg-card/98 backdrop-blur-md shadow-2xl">
                <CardHeader className="flex flex-row items-start gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/")}
                        className="shrink-0"
                        aria-label="Volver"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <CardTitle className="text-2xl sm:text-3xl md:text-4xl">
                            Crear cuenta
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Regístrate para acceder a la plataforma
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="firstName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-register-firstName">
                                            Nombre
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-register-firstName"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Tu nombre"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="lastName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-register-lastName">
                                            Apellido
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-register-lastName"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Tu apellido"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-register-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-register-email"
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="ejemplo@ejemplo.com"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-register-password">
                                            Contraseña
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-register-password"
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Mínimo 8 caracteres"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                        <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
                            <Button
                                type="submit"
                                className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base"
                                size="lg"
                                form="form-register"
                                disabled={isRegisteringUser}
                            >
                                {isRegisteringUser ? <Spinner /> : "Registrarse"}
                            </Button>
                            <p className="text-xs sm:text-sm text-center text-muted-foreground mt-2">
                                ¿Ya tienes cuenta?{" "}
                                <Link to="/login" className="text-primary hover:underline">
                                    Iniciar sesión
                                </Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
