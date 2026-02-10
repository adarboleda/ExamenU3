export function percentile(p, values) {
  if (typeof p !== 'number') {
    throw new TypeError('p debe ser un número');
  }
  if (Number.isNaN(p)) {
    throw new TypeError('p no puede ser NaN');
  }
  if (p < 0 || p > 100) {
    throw new RangeError('p debe estar entre 0 y 100');
  }
  if (!Array.isArray(values)) {
    throw new TypeError('values debe ser un arreglo');
  }
  if (values.length === 0) {
    throw new RangeError('values no puede estar vacío');
  }

  // Validar que todos los elementos sean números
  for (const value of values) {
    if (typeof value !== 'number') {
      throw new TypeError('Todos los elementos de values deben ser números');
    }
    if (Number.isNaN(value)) {
      throw new TypeError('values no puede contener NaN');
    }
  }

  // Ordenar ascendentemente
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  // Regla explícita para bordes
  if (p === 0) {
    return Number(sorted[0].toFixed(2));
  }
  if (p === 100) {
    return Number(sorted[n - 1].toFixed(2));
  }

  // Indexación 1..N
  const rank = Math.ceil((p / 100) * n);
  const index = rank - 1;

  return Number(sorted[index].toFixed(2));
}
