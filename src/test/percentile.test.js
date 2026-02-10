import { percentile } from '../utils/percentile.js';

describe('percentile', () => {
  // Casos de referencia
  describe('casos de referencia', () => {
    test('percentile(0,[1,2,3]) → 1.00', () => {
      expect(percentile(0, [1, 2, 3])).toBe(1.0);
    });

    test('percentile(100,[1,2,3]) → 3.00', () => {
      expect(percentile(100, [1, 2, 3])).toBe(3.0);
    });

    test('percentile(50,[1,2,3,4]) → 2.00 (nearest-rank)', () => {
      expect(percentile(50, [1, 2, 3, 4])).toBe(2.0);
    });
  });

  // Casos válidos
  describe('casos válidos', () => {
    test('percentile 25 de [1,2,3,4]', () => {
      // rank = ceil(25/100 * 4) = ceil(1) = 1 → values[0] = 1
      expect(percentile(25, [1, 2, 3, 4])).toBe(1.0);
    });

    test('percentile 75 de [1,2,3,4]', () => {
      // rank = ceil(75/100 * 4) = ceil(3) = 3 → values[2] = 3
      expect(percentile(75, [1, 2, 3, 4])).toBe(3.0);
    });

    test('un solo elemento', () => {
      expect(percentile(0, [42])).toBe(42.0);
      expect(percentile(50, [42])).toBe(42.0);
      expect(percentile(100, [42])).toBe(42.0);
    });

    test('valores desordenados se ordenan correctamente', () => {
      expect(percentile(0, [3, 1, 2])).toBe(1.0);
      expect(percentile(100, [3, 1, 2])).toBe(3.0);
    });

    test('valores negativos', () => {
      expect(percentile(0, [-10, -5, 0, 5, 10])).toBe(-10.0);
      expect(percentile(100, [-10, -5, 0, 5, 10])).toBe(10.0);
    });

    test('valores decimales', () => {
      expect(percentile(50, [1.5, 2.5, 3.5, 4.5])).toBe(2.5);
    });

    test('valores duplicados', () => {
      expect(percentile(50, [5, 5, 5, 5])).toBe(5.0);
    });

    test('percentile 10 de 10 elementos', () => {
      // rank = ceil(10/100 * 10) = ceil(1) = 1 → values[0]
      expect(percentile(10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(1.0);
    });

    test('percentile 90 de 10 elementos', () => {
      // rank = ceil(90/100 * 10) = ceil(9) = 9 → values[8] = 9
      expect(percentile(90, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(9.0);
    });

    test('percentile 1 (borde bajo)', () => {
      // rank = ceil(1/100 * 5) = ceil(0.05) = 1 → values[0]
      expect(percentile(1, [10, 20, 30, 40, 50])).toBe(10.0);
    });

    test('percentile 99 (borde alto)', () => {
      // rank = ceil(99/100 * 5) = ceil(4.95) = 5 → values[4]
      expect(percentile(99, [10, 20, 30, 40, 50])).toBe(50.0);
    });

    test('resultado con decimales precisos', () => {
      expect(percentile(50, [1.234, 5.678])).toBe(1.23);
    });

    test('no muta el arreglo original', () => {
      const original = [3, 1, 2];
      percentile(50, original);
      expect(original).toEqual([3, 1, 2]);
    });
  });

  // ===== ERRORES DE TIPO (TypeError) =====
  describe('TypeError - validación de tipos', () => {
    test('p no es un número (string)', () => {
      expect(() => percentile('50', [1, 2, 3])).toThrow(TypeError);
      expect(() => percentile('50', [1, 2, 3])).toThrow('p debe ser un número');
    });

    test('p no es un número (null)', () => {
      expect(() => percentile(null, [1, 2, 3])).toThrow(TypeError);
    });

    test('p no es un número (undefined)', () => {
      expect(() => percentile(undefined, [1, 2, 3])).toThrow(TypeError);
    });

    test('p es NaN', () => {
      expect(() => percentile(NaN, [1, 2, 3])).toThrow(TypeError);
      expect(() => percentile(NaN, [1, 2, 3])).toThrow('p no puede ser NaN');
    });

    test('values no es un arreglo (null)', () => {
      expect(() => percentile(50, null)).toThrow(TypeError);
      expect(() => percentile(50, null)).toThrow('values debe ser un arreglo');
    });

    test('values no es un arreglo (número)', () => {
      expect(() => percentile(50, 123)).toThrow(TypeError);
    });

    test('values no es un arreglo (objeto)', () => {
      expect(() => percentile(50, { 0: 1, 1: 2 })).toThrow(TypeError);
    });

    test('values contiene un elemento no numérico (string)', () => {
      expect(() => percentile(50, [1, '2', 3])).toThrow(TypeError);
      expect(() => percentile(50, [1, '2', 3])).toThrow(
        'Todos los elementos de values deben ser números',
      );
    });

    test('values contiene null', () => {
      expect(() => percentile(50, [1, null, 3])).toThrow(TypeError);
    });

    test('values contiene NaN', () => {
      expect(() => percentile(50, [1, NaN, 3])).toThrow(TypeError);
      expect(() => percentile(50, [1, NaN, 3])).toThrow(
        'values no puede contener NaN',
      );
    });
  });

  // ===== ERRORES DE RANGO (RangeError) =====
  describe('RangeError - validación de rangos', () => {
    test('p menor a 0', () => {
      expect(() => percentile(-1, [1, 2, 3])).toThrow(RangeError);
      expect(() => percentile(-1, [1, 2, 3])).toThrow(
        'p debe estar entre 0 y 100',
      );
    });

    test('p mayor a 100', () => {
      expect(() => percentile(101, [1, 2, 3])).toThrow(RangeError);
    });

    test('p = -0.001 (justo fuera de rango)', () => {
      expect(() => percentile(-0.001, [1, 2, 3])).toThrow(RangeError);
    });

    test('p = 100.001 (justo fuera de rango)', () => {
      expect(() => percentile(100.001, [1, 2, 3])).toThrow(RangeError);
    });

    test('values es un arreglo vacío', () => {
      expect(() => percentile(50, [])).toThrow(RangeError);
      expect(() => percentile(50, [])).toThrow('values no puede estar vacío');
    });
  });

  // ===== CASOS BORDE =====
  describe('casos borde', () => {
    test('p exactamente 0', () => {
      expect(percentile(0, [5, 10, 15])).toBe(5.0);
    });

    test('p exactamente 100', () => {
      expect(percentile(100, [5, 10, 15])).toBe(15.0);
    });

    test('p = 0.001 (justo dentro de rango)', () => {
      // rank = ceil(0.001/100 * 3) = ceil(0.00003) = 1 → values[0]
      expect(percentile(0.001, [1, 2, 3])).toBe(1.0);
    });

    test('p = 99.999 (justo dentro de rango)', () => {
      // rank = ceil(99.999/100 * 3) = ceil(2.99997) = 3 → values[2]
      expect(percentile(99.999, [1, 2, 3])).toBe(3.0);
    });

    test('dos elementos - percentile 50', () => {
      // rank = ceil(50/100 * 2) = ceil(1) = 1 → values[0]
      expect(percentile(50, [10, 20])).toBe(10.0);
    });

    test('arreglo grande', () => {
      const values = Array.from({ length: 100 }, (_, i) => i + 1);
      expect(percentile(0, values)).toBe(1.0);
      expect(percentile(50, values)).toBe(50.0);
      expect(percentile(100, values)).toBe(100.0);
    });

    test('valores muy grandes', () => {
      expect(percentile(50, [1e10, 2e10, 3e10])).toBe(20000000000.0);
    });

    test('valores muy pequeños', () => {
      expect(percentile(50, [0.001, 0.002, 0.003])).toBe(0.0);
    });
  });
});
