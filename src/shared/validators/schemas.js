/**
 * schemas.js — Validadores de formularios con Zod.
 * Centraliza todas las reglas de validación del sistema.
 */
import { useState } from 'react';
import { z } from 'zod';

/* ══════════════════════════════════════════
   VALIDADORES COMUNES
══════════════════════════════════════════ */

export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('Formato de email inválido')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial');

export const dniSchema = z
  .string()
  .length(8, 'El DNI debe tener 8 dígitos')
  .regex(/^\d+$/, 'El DNI solo debe contener números');

export const rucSchema = z
  .string()
  .length(11, 'El RUC debe tener 11 dígitos')
  .regex(/^\d+$/, 'El RUC solo debe contener números');

export const phoneSchema = z
  .string()
  .min(9, 'El teléfono debe tener al menos 9 dígitos')
  .regex(/^\d+$/, 'El teléfono solo debe contener números');

export const montoSchema = z
  .number({ invalid_type_error: 'El monto debe ser un número' })
  .positive('El monto debe ser positivo')
  .finite('El monto no puede ser infinito');

export const nombreSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede exceder 100 caracteres')
  .trim();

/* ══════════════════════════════════════════
   ESQUEMAS DE FORMULARIOS
══════════════════════════════════════════ */

/** Login */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

/** Registro */
export const registerSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  dni: dniSchema.optional(),
  telefono: phoneSchema.optional(),
  aceptaTerminos: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

/** Transferencia */
export const transferenciaSchema = z.object({
  cuentaOrigen: z.string().min(1, 'Selecciona una cuenta origen'),
  cuentaDestino: z
    .string()
    .min(1, 'Ingresa la cuenta destino')
    .regex(/^\d{14}$/, 'La cuenta debe tener 14 dígitos'),
  monto: montoSchema
    .min(1, 'El monto mínimo es S/ 1.00')
    .max(10000, 'El monto máximo por transferencia es S/ 10,000'),
  concepto: z
    .string()
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(200, 'El concepto no puede exceder 200 caracteres')
    .trim(),
});

/** Solicitud de Crédito */
export const solicitudCreditoSchema = z.object({
  tipoProducto: z.enum(
    ['CREDITO_PERSONAL', 'CREDITO_VEHICULAR', 'CREDITO_HIPOTECARIO', 'CREDITO_AGROPECUARIO'],
    { errorMap: () => ({ message: 'Selecciona un tipo de crédito' }) }
  ),
  montoSolicitado: montoSchema
    .min(1000, 'El monto mínimo es S/ 1,000')
    .max(500000, 'El monto máximo es S/ 500,000'),
  plazoMeses: z
    .number({ invalid_type_error: 'El plazo debe ser un número' })
    .int('El plazo debe ser un número entero')
    .min(6, 'El plazo mínimo es 6 meses')
    .max(360, 'El plazo máximo es 360 meses'),
  ingresoMensual: montoSchema
    .min(930, 'El ingreso mensual mínimo es S/ 930'),
  gastoMensual: montoSchema.min(0, 'Los gastos no pueden ser negativos'),
  actividadEconomica: z.string().min(3, 'Describe tu actividad económica'),
  destino: z.string().min(10, 'Describe el destino del crédito'),
});

/** Actualizar Perfil */
export const perfilSchema = z.object({
  nombre: nombreSchema,
  apellidos: nombreSchema,
  telefono: phoneSchema.optional(),
  direccion: z.string().max(200, 'La dirección no puede exceder 200 caracteres').optional(),
  fechaNacimiento: z.string().optional(),
});

/** Cambiar Contraseña */
export const cambioPasswordSchema = z.object({
  passwordActual: z.string().min(1, 'Ingresa tu contraseña actual'),
  passwordNueva: passwordSchema,
  confirmPasswordNueva: z.string().min(1, 'Confirma tu nueva contraseña'),
}).refine(data => data.passwordNueva === data.confirmPasswordNueva, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPasswordNueva'],
});

/** Crear Usuario (Admin) */
export const crearUsuarioSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  password: passwordSchema,
  rol: z.enum(
    ['CLIENTE', 'ASESOR', 'JEFE_REGIONAL', 'RIESGOS', 'COMITE', 'GERENCIA', 'COBRANZA', 'ADMIN'],
    { errorMap: () => ({ message: 'Selecciona un rol válido' }) }
  ),
  activo: z.boolean().default(true),
});

/* ══════════════════════════════════════════
   HELPER PARA VALIDAR FORMULARIOS
══════════════════════════════════════════ */

/**
 * Valida datos contra un schema de Zod.
 * @param {z.ZodSchema} schema - Schema de validación
 * @param {object} data - Datos a validar
 * @returns {{ success: boolean, errors?: object, data?: object }}
 */
export function validateForm(schema, data) {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convertir errores de Zod a objeto { campo: mensaje }
      const errors = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _form: 'Error de validación' } };
  }
}

/**
 * Hook personalizado para validación en tiempo real.
 * @param {z.ZodSchema} schema - Schema de validación
 */
export function useFormValidation(schema) {
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const result = validateForm(schema, data);
    if (!result.success) {
      setErrors(result.errors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateField = (name, value) => {
    try {
      const fieldSchema = schema.shape[name];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors[0]?.message,
        }));
      }
    }
  };

  const clearError = (name) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validate,
    validateField,
    clearError,
    clearErrors,
  };
}

export default {
  loginSchema,
  registerSchema,
  transferenciaSchema,
  solicitudCreditoSchema,
  perfilSchema,
  cambioPasswordSchema,
  crearUsuarioSchema,
  validateForm,
};
