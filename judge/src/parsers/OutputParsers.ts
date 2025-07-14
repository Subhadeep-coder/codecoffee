// OutputParsers.ts
import { InputFormatType } from './InputParsers';

export class OutputParsers {
  static parse(output: string, format: InputFormatType): any {
    try {
      // First, clean the output by removing any trailing whitespace or newlines
      output = output.trim();

      switch (format) {
        case 'array':
          return OutputParsers.parseArray(output);
        case 'tree':
          return OutputParsers.parseTree(output);
        case 'graph':
          return OutputParsers.parseGraph(output);
        case 'matrix':
          return OutputParsers.parseMatrix(output);
        case 'number':
          return OutputParsers.parseNumber(output);
        case 'string':
          return output;
        default:
          throw new Error(`Unsupported output format: ${format}`);
      }
    } catch (error: any) {
      throw new Error(`Output parsing error: ${error?.message || 'Unknown error'}`);
    }
  }

  static parseArray(output: string): any[] {
    // Handle different array formats
    output = output.trim();
    
    // If output is already in JSON format
    if (output.startsWith('[') && output.endsWith(']')) {
      try {
        return JSON.parse(output);
      } catch {
        // If JSON parse fails, try other methods
      }
    }
    
    // If output is space-separated numbers
    if (output.match(/^[-\d\s.]+$/)) {
      return output.split(/\s+/).map(Number);
    }
    
    // If output is comma-separated
    if (output.includes(',')) {
      return output.split(',').map(item => {
        item = item.trim();
        return isNaN(Number(item)) ? item : Number(item);
      });
    }

    // Default: treat as space-separated strings
    return output.split(/\s+/);
  }

  static parseMatrix(output: string): any[][] {
    output = output.trim();
    
    // If it's already in JSON format
    if (output.startsWith('[') && output.endsWith(']')) {
      try {
        return JSON.parse(output);
      } catch {
        // If JSON parse fails, try other methods
      }
    }

    // Handle newline-separated rows
    return output.split('\n').map(row => {
      row = row.trim();
      if (row.startsWith('[') && row.endsWith(']')) {
        try {
          return JSON.parse(row);
        } catch {
          // If JSON parse fails, split by spaces
          return row.slice(1, -1).split(/\s+|,/).map(Number);
        }
      }
      return row.split(/\s+|,/).map(Number);
    });
  }

  static parseTree(output: string): (number|null)[] {
    output = output.trim();
    
    // Handle JSON array format
    if (output.startsWith('[') && output.endsWith(']')) {
      try {
        return JSON.parse(output.replace(/null/g, 'null'));
      } catch {
        // If JSON parse fails, try other methods
      }
    }

    // Handle space-separated format with "null" for null nodes
    return output.split(/\s+|,/).map(val => 
      val.toLowerCase() === 'null' || val === '#' ? null : Number(val)
    );
  }

  static parseGraph(output: string): number[][] {
    output = output.trim();
    
    // If it's already in JSON format
    if (output.startsWith('[') && output.endsWith(']')) {
      try {
        return JSON.parse(output);
      } catch {
        // If JSON parse fails, try other methods
      }
    }

    // Handle newline-separated edges
    return output.split('\n').map(edge => {
      edge = edge.trim();
      if (edge.startsWith('[') && edge.endsWith(']')) {
        return JSON.parse(edge);
      }
      return edge.split(/\s+|,/).map(Number);
    });
  }

  static parseNumber(output: string): number {
    const num = Number(output.trim());
    if (isNaN(num)) {
      throw new Error('Output is not a valid number');
    }
    return num;
  }
}
