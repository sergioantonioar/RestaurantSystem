export interface Empleado {
  id_atm: string; // Identificador único del empleado
  name_atm: string; // Nombre completo del empleado
  alias: string; // Alias o nombre de usuario del empleado
  email: string; // Correo electrónico del empleado
  phone: string; // Número de teléfono del empleado
  dni: string; // Documento Nacional de Identidad del empleado
  is_active: boolean; // Estado del empleado (activo/inactivo)
  user_atm?: string; // ID del usuario asociado al empleado (requerido para asignación a caja)
}