import { useState } from "react";
import { MatrixInput } from "@/components/MatrixInput";
import { MethodSelector } from "@/components/MethodSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { MatrixSolver, MatrixSolution } from "@/utils/matrixSolver";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [coefficients, setCoefficients] = useState<number[][]>([]);
  const [constants, setConstants] = useState<number[]>([]);
  const [solution, setSolution] = useState<MatrixSolution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMatrixChange = (newCoefficients: number[][], newConstants: number[]) => {
    setCoefficients(newCoefficients);
    setConstants(newConstants);
    setSolution(null);
    setError(null);
  };

  const handleSolve = async (method: 'inverse' | 'cramer' | 'gauss-jordan') => {
    if (coefficients.length === 0 || constants.length === 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un sistema de ecuaciones válido",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let result: MatrixSolution;
      
      switch (method) {
        case 'inverse':
          result = MatrixSolver.solveByInverse(coefficients, constants);
          break;
        case 'cramer':
          result = MatrixSolver.solveByCramer(coefficients, constants);
          break;
        case 'gauss-jordan':
          result = MatrixSolver.solveByGaussJordan(coefficients, constants);
          break;
        default:
          throw new Error("Método no válido");
      }
      
      setSolution(result);
      toast({
        title: "¡Éxito!",
        description: `Sistema resuelto usando ${result.method}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      toast({
        title: "Error al resolver",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Solucionador de Sistemas de Ecuaciones Lineales</h1>
          <p className="text-xl text-muted-foreground">
            Resuelve sistemas usando Matriz Inversa, Cramer y Gauss-Jordan
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <MatrixInput onMatrixChange={handleMatrixChange} />
            <MethodSelector onSolve={handleSolve} isLoading={isLoading} />
          </div>
          
          <div>
            <ResultDisplay solution={solution} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
