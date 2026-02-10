import { calcWeightedGrade } from '../utils/calcWeightedGrade.js';

describe('calcWeightedGrade', () => {
  describe('casos válidos', () => {
    test('caso de referencia: [{score:80,weight:0.4},{score:90,weight:0.6}] → 86.00', () => {
      const result = calcWeightedGrade([
        { score: 80, weight: 0.4 },
        { score: 90, weight: 0.6 },
      ]);
      expect(result).toBe(86.0);
    });

    test('un solo item con weight=1', () => {
      const result = calcWeightedGrade([{ score: 75, weight: 1 }]);
      expect(result).toBe(75.0);
    });

    test('múltiples items con pesos iguales', () => {
      const result = calcWeightedGrade([
        { score: 100, weight: 0.25 },
        { score: 80, weight: 0.25 },
        { score: 60, weight: 0.25 },
        { score: 40, weight: 0.25 },
      ]);
      expect(result).toBe(70.0);
    });

    test('todos los scores en 0', () => {
      const result = calcWeightedGrade([
        { score: 0, weight: 0.5 },
        { score: 0, weight: 0.5 },
      ]);
      expect(result).toBe(0.0);
    });

    test('todos los scores en 100', () => {
      const result = calcWeightedGrade([
        { score: 100, weight: 0.3 },
        { score: 100, weight: 0.7 },
      ]);
      expect(result).toBe(100.0);
    });

    test('suma de weights = 0.999 (dentro de tolerancia)', () => {
      const result = calcWeightedGrade([
        { score: 50, weight: 0.4995 },
        { score: 50, weight: 0.5 },
      ]);
      expect(result).toBe(49.98);
    });

    test('suma de weights = 1.001 (dentro de tolerancia)', () => {
      const result = calcWeightedGrade([
        { score: 80, weight: 0.501 },
        { score: 80, weight: 0.5 },
      ]);
      expect(result).toBe(80.08);
    });

    test('resultado con decimales precisos', () => {
      const result = calcWeightedGrade([
        { score: 85.5, weight: 0.4 },
        { score: 92.3, weight: 0.6 },
      ]);
      expect(result).toBe(89.58);
    });

    test('weight de 0 no afecta el resultado', () => {
      const result = calcWeightedGrade([
        { score: 100, weight: 1 },
        { score: 0, weight: 0 },
      ]);
      expect(result).toBe(100.0);
    });
  });

  // Errores de tipo
  describe('TypeError - validación de tipos', () => {
    test('items no es un arreglo (null)', () => {
      expect(() => calcWeightedGrade(null)).toThrow(TypeError);
      expect(() => calcWeightedGrade(null)).toThrow(
        'items debe ser un arreglo',
      );
    });

    test('items no es un arreglo (undefined)', () => {
      expect(() => calcWeightedGrade(undefined)).toThrow(TypeError);
    });

    test('items no es un arreglo (objeto)', () => {
      expect(() => calcWeightedGrade({ score: 80, weight: 1 })).toThrow(
        TypeError,
      );
    });

    test('items no es un arreglo (número)', () => {
      expect(() => calcWeightedGrade(123)).toThrow(TypeError);
    });

    test('items no es un arreglo (string)', () => {
      expect(() => calcWeightedGrade('test')).toThrow(TypeError);
    });

    test('item no es un objeto (null en arreglo)', () => {
      expect(() => calcWeightedGrade([null])).toThrow(TypeError);
      expect(() => calcWeightedGrade([null])).toThrow(
        'Cada item debe ser un objeto',
      );
    });

    test('item no es un objeto (número en arreglo)', () => {
      expect(() => calcWeightedGrade([123])).toThrow(TypeError);
    });

    test('item sin propiedad score', () => {
      expect(() => calcWeightedGrade([{ weight: 1 }])).toThrow(TypeError);
      expect(() => calcWeightedGrade([{ weight: 1 }])).toThrow(
        'Cada item debe tener las propiedades score y weight',
      );
    });

    test('item sin propiedad weight', () => {
      expect(() => calcWeightedGrade([{ score: 80 }])).toThrow(TypeError);
    });

    test('score no es un número (string)', () => {
      expect(() => calcWeightedGrade([{ score: '80', weight: 1 }])).toThrow(
        TypeError,
      );
      expect(() => calcWeightedGrade([{ score: '80', weight: 1 }])).toThrow(
        'score y weight deben ser números',
      );
    });

    test('weight no es un número (string)', () => {
      expect(() => calcWeightedGrade([{ score: 80, weight: '1' }])).toThrow(
        TypeError,
      );
    });

    test('score es NaN', () => {
      expect(() => calcWeightedGrade([{ score: NaN, weight: 1 }])).toThrow(
        TypeError,
      );
      expect(() => calcWeightedGrade([{ score: NaN, weight: 1 }])).toThrow(
        'score y weight no pueden ser NaN',
      );
    });

    test('weight es NaN', () => {
      expect(() => calcWeightedGrade([{ score: 80, weight: NaN }])).toThrow(
        TypeError,
      );
    });
  });

  // Errores de rango
  describe('RangeError - validación de rangos', () => {
    test('arreglo vacío', () => {
      expect(() => calcWeightedGrade([])).toThrow(RangeError);
      expect(() => calcWeightedGrade([])).toThrow('items no puede estar vacío');
    });

    test('score menor a 0', () => {
      expect(() => calcWeightedGrade([{ score: -1, weight: 1 }])).toThrow(
        RangeError,
      );
      expect(() => calcWeightedGrade([{ score: -1, weight: 1 }])).toThrow(
        'score debe estar entre 0 y 100',
      );
    });

    test('score mayor a 100', () => {
      expect(() => calcWeightedGrade([{ score: 101, weight: 1 }])).toThrow(
        RangeError,
      );
    });

    test('weight menor a 0', () => {
      expect(() => calcWeightedGrade([{ score: 80, weight: -0.1 }])).toThrow(
        RangeError,
      );
      expect(() => calcWeightedGrade([{ score: 80, weight: -0.1 }])).toThrow(
        'weight debe estar entre 0 y 1',
      );
    });

    test('weight mayor a 1', () => {
      expect(() => calcWeightedGrade([{ score: 80, weight: 1.5 }])).toThrow(
        RangeError,
      );
    });

    test('suma de weights menor a 0.999 (fuera de tolerancia)', () => {
      expect(() =>
        calcWeightedGrade([
          { score: 80, weight: 0.4 },
          { score: 90, weight: 0.5 },
        ]),
      ).toThrow(RangeError);
      expect(() =>
        calcWeightedGrade([
          { score: 80, weight: 0.4 },
          { score: 90, weight: 0.5 },
        ]),
      ).toThrow('La suma de los weights debe ser 1');
    });

    test('suma de weights mayor a 1.001 (fuera de tolerancia)', () => {
      expect(() =>
        calcWeightedGrade([
          { score: 80, weight: 0.6 },
          { score: 90, weight: 0.5 },
        ]),
      ).toThrow(RangeError);
    });
  });

  // Casos borde
  describe('casos borde', () => {
    test('score exactamente 0', () => {
      const result = calcWeightedGrade([{ score: 0, weight: 1 }]);
      expect(result).toBe(0.0);
    });

    test('score exactamente 100', () => {
      const result = calcWeightedGrade([{ score: 100, weight: 1 }]);
      expect(result).toBe(100.0);
    });

    test('muchos items pequeños', () => {
      const items = [];
      for (let i = 0; i < 10; i++) {
        items.push({ score: 80, weight: 0.1 });
      }
      const result = calcWeightedGrade(items);
      expect(result).toBe(80.0);
    });
  });
});
