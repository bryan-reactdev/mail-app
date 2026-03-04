import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveSelect } from "@/components/ui/custom/responsive-select";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Trash2, User as UserIcon } from "lucide-react";
import type { User } from "@/types/entities";
import { editUserSchema, type EditUserForm } from "@/types/form";
import { FormSectionHeader } from "@/components/ui/form/form-section-header";
import { useUserStore } from "@/stores/useUserStore";

interface UsuarioButtonProps {
    rowData?: User;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
}

export const UsuarioEditarButton = ({ rowData }: UsuarioButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { updateUser, isUpdatingUser } = useUserStore();

    const form = useForm<EditUserForm>({
        resolver: zodResolver(editUserSchema) as any,
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
        if (isOpen && rowData) {
            const roleValue = rowData.role && ['admin', 'usuario'].includes(rowData.role) 
                ? rowData.role as "admin" | "usuario"
                : undefined;
            form.reset({
                firstName: rowData.firstName,
                lastName: rowData.lastName,
                email: rowData.email,
                password: '',
                role: roleValue,
                phone: rowData.phone || null,
            });
        }
    }, [isOpen, rowData, form]);

    const onSubmit = async (data: EditUserForm) => {
        if (!rowData) return;
        
        const success = await updateUser(rowData.id, data);
        
        if (success) {
            setIsOpen(false);
            form.reset();
        }
    };

    if (!rowData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant='action'>
                    Editar
                    <Edit className='text-muted-foreground' />
                </Button>
            </DialogTrigger>
            <DialogContent className="lg:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">Editar Usuario</DialogTitle>
                </DialogHeader>
                <form id="form-editar-usuario" onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                    <FormSectionHeader icon={UserIcon} title="Información Personal y de Contacto" className="mt-2" />

                    <FieldGroup className="flex flex-col lg:flex-row gap-4 mb-2">
                        <Controller
                            name="firstName"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-editar-usuario-firstName">
                                        Nombres
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-editar-usuario-firstName"
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
                                    <FieldLabel htmlFor="form-editar-usuario-lastName">
                                        Apellidos
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-editar-usuario-lastName"
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
                                    <FieldLabel htmlFor="form-editar-usuario-email">
                                        Email
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-editar-usuario-email"
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
                                    <FieldLabel htmlFor="form-editar-usuario-phone">
                                        Teléfono
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value || null)}
                                        id="form-editar-usuario-phone"
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
                                    <FieldLabel htmlFor="form-editar-usuario-role">
                                        Rol
                                    </FieldLabel>

                                    <ResponsiveSelect
                                        value={field.value || ''}
                                        onValueChange={(value) => field.onChange(value === '' ? undefined : value as "admin" | "usuario")}
                                        aria-invalid={fieldState.invalid}
                                    >
                                        <SelectTrigger
                                            id="form-editar-usuario-role"
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
                                    <FieldLabel htmlFor="form-editar-usuario-password">
                                        Contraseña (dejar vacío para no cambiar)
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="form-editar-usuario-password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingresa la nueva contraseña"
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
                    
                    <Button type="submit" form="form-editar-usuario" disabled={isUpdatingUser}>
                        {isUpdatingUser ? <Spinner /> : "Guardar cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const UsuarioEliminarButton = ({ rowData, onDelete }: UsuarioButtonProps) => {
    if (!rowData) return null;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(rowData);
        } else {
            // TODO: Implement delete functionality (e.g., open confirmation dialog)
            console.log("Delete user:", rowData);
        }
    };

    return (
        <Button variant='action' onClick={handleDelete} className="text-destructive hover:text-destructive">
            Eliminar
            <Trash2 className='text-destructive/80' />
        </Button>
    );
};

// Legacy component for backward compatibility (used in UsuarioCard)
interface UsuarioButtonsProps {
    user: User;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
}

const UsuarioButtons: React.FC<UsuarioButtonsProps> = ({
    user,
    onEdit,
    onDelete,
}) => {
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(user);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(user);
    };

    return (
        <div className="flex items-center gap-2">
            {onEdit && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0"
                >
                    <Edit className="h-4 w-4" />
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default UsuarioButtons;
