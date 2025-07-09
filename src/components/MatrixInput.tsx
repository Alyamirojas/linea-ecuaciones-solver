import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MatrixInputProps {
  onMatrixChange: (coefficients: number[][], constants: number[]) => void;
}

export const MatrixInput = ({ onMatrixChange }: MatrixInputProps) => {
  const [size, setSize] = useState(3);
  const [coefficients, setCoefficients] = useState<string[][]>([
    ['2', '1', '-1'],
    ['-3', '-1', '2'],
    ['-2', '1', '2']
  ]);
  const [constants, setConstants] = useState<string[]>(['8', '-11', '-3']);

  const updateSize = (newSize: number) => {
    setSize(newSize);
    
    // Ajustar matriz de coeficientes
    const newCoefficients = Array(newSize).fill(null).map((_, i) => 
      Array(newSize).fill(null).map((_, j) => 
        coefficients[i]?.[j] || '0'
      )
    );
    
    // Ajustar vector de constantes
    const newConstants = Array(newSize).fill(null).map((_, i) => 
      constants[i] || '0'
    );
    
    setCoefficients(newCoefficients);
    setConstants(newConstants);
  };

  const updateCoefficient = (row: number, col: number, value: string) => {
    const newCoefficients = [...coefficients];
    newCoefficients[row][col] = value;
    setCoefficients(newCoefficients);
    updateMatrix(newCoefficients, constants);
  };

  const updateConstant = (row: number, value: string) => {
    const newConstants = [...constants];
    newConstants[row] = value;
    setConstants(newConstants);
    updateMatrix(coefficients, newConstants);
  };

  const updateMatrix = (coeff: string[][], const_: string[]) => {
    try {
      const numCoeff = coeff.map(row => row.map(val => parseFloat(val) || 0));
      const numConst = const_.map(val => parseFloat(val) || 0);
      onMatrixChange(numCoeff, numConst);
    } catch (error) {
      console.error('Error parsing matrix:', error);
    }
  };

  const loadExample = () => {
    if (size === 2) {
      setCoefficients([['2', '3'], ['1', '-1']]);
      setConstants(['7', '1']);
    } else if (size === 3) {
      setCoefficients([['2', '1', '-1'], ['-3', '-1', '2'], ['-2', '1', '2']]);
      setConstants(['8', '-11', '-3']);
    } else if (size === 4) {
      setCoefficients([
        ['1', '2', '-1', '3'],
        ['2', '-1', '1', '1'],
        ['1', '1', '1', '1'],
        ['3', '1', '2', '-1']
      ]);
      setConstants(['6', '5', '4', '8']);
    }
    updateMatrix(coefficients, constants);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sistema de Ecuaciones Lineales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="size">Tamaño del sistema:</Label>
          <select
            id="size"
            value={size}
            onChange={(e) => updateSize(parseInt(e.target.value))}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value={2}>2x2</option>
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
          </select>
          <Button variant="outline" onClick={loadExample}>
            Cargar Ejemplo
          </Button>
        </div>

        <div className="space-y-3">
          <Label>Matriz de coeficientes y constantes:</Label>
          {Array(size).fill(null).map((_, row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="text-sm font-medium w-8">F{row + 1}:</span>
              {Array(size).fill(null).map((_, col) => (
                <div key={col} className="flex items-center gap-1">
                  <Input
                    type="number"
                    step="any"
                    value={coefficients[row][col]}
                    onChange={(e) => updateCoefficient(row, col, e.target.value)}
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">
                    x{col + 1}{col < size - 1 ? ' +' : ' ='}
                  </span>
                </div>
              ))}
              <Input
                type="number"
                step="any"
                value={constants[row]}
                onChange={(e) => updateConstant(row, e.target.value)}
                className="w-20 text-center bg-accent"
              />
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Sistema de ecuaciones:</p>
          {Array(size).fill(null).map((_, row) => (
            <div key={row} className="font-mono">
              {Array(size).fill(null).map((_, col) => {
                const coeff = coefficients[row][col];
                const sign = col > 0 ? (parseFloat(coeff) >= 0 ? ' + ' : ' - ') : '';
                const value = col > 0 && parseFloat(coeff) < 0 ? Math.abs(parseFloat(coeff)) : coeff;
                return `${sign}${value}x${col + 1}`;
              }).join('')} = {constants[row]}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};