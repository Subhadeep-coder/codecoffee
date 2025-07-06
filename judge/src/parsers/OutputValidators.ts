// OutputValidators.ts
// Utility functions to validate outputs for different formats

export class OutputValidators {
  static validate(actual: any, expected: any, format: string): boolean {
    switch (format) {
      case 'array':
      case 'matrix':
        return OutputValidators.deepEqual(actual, expected);
      case 'tree':
        return OutputValidators.deepEqual(actual, expected);
      case 'graph':
        return OutputValidators.deepEqual(actual, expected);
      case 'number':
        return Number(actual) === Number(expected);
      case 'string':
        return String(actual).trim() === String(expected).trim();
      default:
        return String(actual).trim() === String(expected).trim();
    }
  }

  static deepEqual(a: any, b: any): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!OutputValidators.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    return a === b;
  }
}
