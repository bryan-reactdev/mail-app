import { useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveSelect } from "@/components/ui/custom/responsive-select";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { User as UserIcon } from "lucide-react";
import { createUserSchema, type CreateUserForm } from "@/types/form";
import { FormSectionHeader } from "@/components/ui/form/form-section-header";
import { useUserStore } from "@/stores/useUserStore";

interface RegisterUsuarioModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RegisterUsuarioModal({ isOpen, onOpenChange }: RegisterUsuarioModalProps) {
    const { createUser, isCreatingUser, getUsers } = useUserStore();

    const form = useForm<CreateUserForm>({
        resolver: zodResolver(createUserSchema) as any,
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: undefined,
            phone: null,
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: undefined,
                phone: null,
            });
        }
    }, [isOpen, form]);

    const onSubmit = async (data: CreateUserForm) => {
        const success = await createUser(data);
        
        if (success) {
            onOpenChange(false);
            form.reset();
            getUsers(); // Refresh the users list
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="lg:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">Registrar Usuario</DialogTitle>
                </DialogHeader>
                <form id="form-registrar-usuario" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                    <FormSectionHeader icon={UserIcon} title="Información Personal y de Contacto" className="mt-2" />

                    <FieldGroup className="flex flex-col lg:flex-row gap-4 mb-2">
                        <Controller
                            name="firstName"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-registrar-usuario-firstName">
                                        Nombres
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-registrar-usuario-firstName"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa el nombre"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="lastName"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-registrar-usuario-lastName">
                                        Apellidos
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-registrar-usuario-lastName"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa el apellido"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup className="flex flex-col lg:flex-row gap-4 mb-2">
                        <Controller
                            name="email"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-registrar-usuario-email">
                                        Email
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-registrar-usuario-email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa el email"
                                        autoComplete="nope"
                                        type="email"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="phone"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-registrar-usuario-phone">
                                        Teléfono
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value || null)}
                                        id="form-registrar-usuario-phone"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa el teléfono"
                                        type="tel"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup className="mb-2">
                        <Controller
                            name="role"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-registrar-usuario-role">
                                        Rol
                                    </FieldLabel>

                                    <ResponsiveSelect
                                        value={field.value || ''}
                                        onValueChange={(value) => field.onChange(value === '' ? undefined : value as "admin" | "usuario")}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectTrigger
                                            id="form-registrar-usuario-role"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="usuario">Usuario</SelectItem>
                                        </SelectContent>
                                    </ResponsiveSelect>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Controller
                            name="password"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-registrar-usuario-password">
                                        Contraseña
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-registrar-usuario-password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa la contraseña"
                                        autoComplete="new-password"
                                        type="password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}/>
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    
                    <Button type="submit" form="form-registrar-usuario" disabled={isCreatingUser}>
                        {isCreatingUser ? <Spinner /> : "Registrar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


