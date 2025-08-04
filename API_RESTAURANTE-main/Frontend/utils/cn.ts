import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de manera eficiente utilizando clsx y tailwind-merge.
 * Esta función es útil para combinar clases condicionales.
 * 
 * @param inputs - Las clases a combinar
 * @returns Una string con las clases combinadas
 * 
 * @example
 * // Uso básico:
 * cn('text-red-500', 'bg-blue-500')
 * 
 * // Uso condicional:
 * cn('btn', {
 *   'btn-primary': isPrimary,
 *   'btn-secondary': !isPrimary
 * })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
