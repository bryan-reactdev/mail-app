import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { loginSchema } from "@/types/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import * as z from "zod";

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLogin: (data: z.infer<typeof loginSchema>) => Promise<boolean | void>;
    isLogging: boolean;
}

export default function LoginModal({ open, onOpenChange, onLogin, isLogging }: LoginModalProps) {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        const res = await onLogin(data);

        if (res) {
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Inicia sesión en tu cuenta</DialogTitle>                    
                </DialogHeader>
                <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-login-email">
                                        Username o Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-login-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa tu username o email"
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
                                        Contraseña
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-login-password"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa tu contraseña"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <div className="flex flex-col gap-2 mt-4">
                        <Button type="submit" className="w-full" size="lg" form="form-login" disabled={isLogging}>
                            {isLogging ? <Spinner /> : "Iniciar sesión"}
                        </Button>
                        <Button variant="outline" className="w-full" size="lg" disabled={isLogging}>
                            Iniciar sesión con Google
                        </Button>
                        <div className="text-center">
                            <Button variant="link" type="button" size="lg" disabled={isLogging}>Registrarse</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
