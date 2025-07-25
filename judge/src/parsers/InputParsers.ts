// InputParsers.ts
// Utility functions to parse different input formats for problems

export type InputFormatType = 'array' | 'tree' | 'graph' | 'matrix' | 'string' | 'number';

export class InputParsers {
  static parse(input: string, format: InputFormatType): any {
    switch (format) {
      case 'array':
        return InputParsers.parseArray(input);
      case 'tree':
        return InputParsers.parseTree(input);
      case 'graph':
        return InputParsers.parseGraph(input);
      case 'matrix':
        return InputParsers.parseMatrix(input);
      case 'number':
        return Number(input.trim());
      case 'string':
        return input.trim();
      default:
        throw new Error(`Unsupported input format: ${format}`);
    }
  }

  static parseArray(input: string): any[] {
    // Handles [1,2,3,4,5] or 1 2 3 4 5
    input = input.trim();
    if (input.startsWith('[') && input.endsWith(']')) {
      return JSON.parse(input.replace(/null/g, 'null'));
    }
    return input.split(/\s+/).map(Number);
  }

  static parseMatrix(input: string): any[][] {
    // Handles [[1,2],[3,4]]
    return JSON.parse(input.replace(/null/g, 'null'));
  }

  static parseTree(input: string): (number|null)[] {
    // Handles [12,9,34,null,3,0,140,20]
    return JSON.parse(input.replace(/null/g, 'null'));
  }

  static parseGraph(input: string): number[][] {
    // Handles [[0,1],[1,2],[2,0]]
    return JSON.parse(input);
  }
}
