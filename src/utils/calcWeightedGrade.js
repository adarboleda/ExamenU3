export function calcWeightedGrade(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items debe ser un arreglo');
  }
  if (items.length === 0) {
    throw new RangeError('items no puede estar vacío');
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const item of items) {
    // Validar que cada item sea un objeto
    if (typeof item !== 'object' || item === null) {
      throw new TypeError('Cada item debe ser un objeto');
    }

    // Validar que tenga las propiedades score y weight
    if (
      !Object.prototype.hasOwnProperty.call(item, 'score') ||
      !Object.prototype.hasOwnProperty.call(item, 'weight')
    ) {
      throw new TypeError(
        'Cada item debe tener las propiedades score y weight',
      );
    }

    const { score, weight } = item;

    if (typeof score !== 'number' || typeof weight !== 'number') {
      throw new TypeError('score y weight deben ser números');
    }
    if (Number.isNaN(score) || Number.isNaN(weight)) {
      throw new TypeError('score y weight no pueden ser NaN');
    }
    if (score < 0 || score > 100) {
      throw new RangeError('score debe estar entre 0 y 100');
    }
    if (weight < 0 || weight > 1) {
      throw new RangeError('weight debe estar entre 0 y 1');
    }

    totalWeight += weight;
    weightedSum += score * weight;
  }

  // Validar que la suma de weights sea 1 con tolerancia ±0.001
  if (Math.abs(totalWeight - 1) > 0.001) {
    throw new RangeError(
      'La suma de los weights debe ser 1 (tolerancia ±0.001)',
    );
  }

  return Number(weightedSum.toFixed(2));
}
