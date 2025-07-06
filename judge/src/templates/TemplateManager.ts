export interface ProblemTemplate {
  language: string;
  template: string;
  placeholders: {
    functionName: string;
    parameters: string;
    returnType: string;
    [key: string]: string;
  };
}

export class TemplateManager {
  private static templates: Map<string, ProblemTemplate> = new Map();

  static {
    this.initializeTemplates();
  }

  private static initializeTemplates(): void {
    // Python Template
    this.templates.set("python", {
      language: "python",
      template: `import sys
import json
from typing import *

class Solution:
    def {{functionName}}(self, {{parameters}}) -> {{returnType}}:
        # Write your code here
        pass

if __name__ == "__main__":
    solution = Solution()
    # Input will be provided through stdin
    input_data = sys.stdin.read().strip()
    if input_data:
        try:
            # Parse input and call function
            # This is a placeholder - actual input parsing depends on problem
            result = solution.{{functionName}}(input_data)
            print(result)
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)`,
      placeholders: {
        functionName: "solve",
        parameters: "nums: List[int]",
        returnType: "int",
      },
    });

    // JavaScript/TypeScript Template
    this.templates.set("javascript", {
      language: "javascript",
      template: `/**
 * @param {{{parameterTypes}}} {{parameterNames}}
 * @return {{{returnType}}}
 */
var {{functionName}} = function({{parameters}}) {
    // Write your code here

};

// Input handling
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = '';
rl.on('line', (line) => {
    input += line + '\\n';
});

rl.on('close', () => {
    try {
        // Parse input and call function
        const result = {{functionName}}(input.trim());
        console.log(result);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
});`,
      placeholders: {
        functionName: "solve",
        parameters: "nums",
        returnType: "number",
        parameterTypes: "number[]",
        parameterNames: "nums",
      },
    });

    // TypeScript Template
    this.templates.set("typescript", {
      language: "typescript",
      template: `function {{functionName}}({{parameters}}): {{returnType}} {
    // Write your code here

}

// Input handling
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = '';
rl.on('line', (line: string) => {
    input += line + '\\n';
});

rl.on('close', () => {
    try {
        const result = {{functionName}}(input.trim() as any);
        console.log(result);
    } catch (error) {
        console.error('Error:', (error as Error).message);
        process.exit(1);
    }
});`,
      placeholders: {
        functionName: "solve",
        parameters: "nums: number[]",
        returnType: "number",
      },
    });

    // Java Template
    this.templates.set("java", {
      language: "java",
      template: `import java.util.*;
import java.io.*;

class Solution {
    public {{returnType}} {{functionName}}({{parameters}}) {
        // Write your code here

    }
}

public class Main {
    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            Solution solution = new Solution();

            // Read input
            String input = "";
            while (scanner.hasNextLine()) {
                input += scanner.nextLine() + "\\n";
            }

            // Parse and call function
            // This is a placeholder - actual parsing depends on problem
            System.out.println("Result placeholder");

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        }
    }
}`,
      placeholders: {
        functionName: "solve",
        parameters: "int[] nums",
        returnType: "int",
      },
    });

    // C++ Template
    this.templates.set("cpp", {
      language: "cpp",
      template: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <sstream>
using namespace std;

class Solution {
public:
    {{returnType}} {{functionName}}({{parameters}}) {
        // Write your code here

    }
};

int main() {
    Solution solution;

    // Read input
    string line;
    vector<string> input;
    while (getline(cin, line)) {
        input.push_back(line);
    }

    try {
        // Parse and call function
        // This is a placeholder - actual parsing depends on problem
        cout << "Result placeholder" << endl;
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }

    return 0;
}`,
      placeholders: {
        functionName: "solve",
        parameters: "vector<int>& nums",
        returnType: "int",
      },
    });

    // C Template
    this.templates.set("c", {
      language: "c",
      template: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

{{returnType}} {{functionName}}({{parameters}}) {
    // Write your code here

}

int main() {
    // Read input
    char buffer[1024];

    if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
        // Parse input and call function
        // This is a placeholder - actual parsing depends on problem
        printf("Result placeholder\\n");
    }

    return 0;
}`,
      placeholders: {
        functionName: "solve",
        parameters: "int* nums, int numsSize",
        returnType: "int",
      },
    });
  }

  static getTemplate(language: string, problemConfig?: any): string {
    const template = this.templates.get(language.toLowerCase());
    if (!template) {
      throw new Error(`Template not found for language: ${language}`);
    }

    let processedTemplate = template.template;

    if (problemConfig) {
      // Replace all placeholders
      Object.keys(template.placeholders).forEach((key) => {
        const placeholder = `{{${key}}}`;
        const value = problemConfig[key] || template.placeholders[key];
        processedTemplate = processedTemplate.replace(
          new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
          value,
        );
      });

      // Handle additional placeholders
      Object.keys(problemConfig).forEach((key) => {
        if (!template.placeholders[key]) {
          const placeholder = `{{${key}}}`;
          processedTemplate = processedTemplate.replace(
            new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
            problemConfig[key] || "",
          );
        }
      });
    } else {
      // Use default placeholders
      Object.keys(template.placeholders).forEach((key) => {
        const placeholder = `{{${key}}}`;
        processedTemplate = processedTemplate.replace(
          new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
          template.placeholders[key],
        );
      });
    }

    return processedTemplate;
  }

  static getSupportedLanguages(): string[] {
    return Array.from(this.templates.keys());
  }

  static addCustomTemplate(language: string, template: ProblemTemplate): void {
    this.templates.set(language.toLowerCase(), template);
  }
}
