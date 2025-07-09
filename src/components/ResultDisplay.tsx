import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MatrixSolution } from "@/utils/matrixSolver";

interface ResultDisplayProps {
  solution: MatrixSolution | null;
  error: string | null;
}

export const ResultDisplay = ({ solution, error }: ResultDisplayProps) => {
  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!solution) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Selecciona un método para resolver el sistema de ecuaciones
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Solución */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Solución</CardTitle>
            <Badge variant="secondary">{solution.method}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {solution.variables.map((value, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="font-mono font-bold text-lg">
                  x{index + 1} =
                </span>
                <span className="font-mono text-lg bg-accent px-3 py-1 rounded">
                  {value.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
          
          {solution.determinant !== undefined && (
            <>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                <strong>Determinante:</strong> {solution.determinant.toFixed(4)}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Desarrollo paso a paso */}
      <Card>
        <CardHeader>
          <CardTitle>Desarrollo Paso a Paso</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {solution.steps.map((step, index) => (
                <div key={index} className="text-sm">
                  {step.includes('Matriz') || step.includes('Método') ? (
                    <div className="font-semibold text-primary bg-muted p-2 rounded">
                      {step}
                    </div>
                  ) : step.includes('[') ? (
                    <pre className="font-mono text-xs bg-accent p-2 rounded overflow-x-auto">
                      {step}
                    </pre>
                  ) : step.includes('=') ? (
                    <div className="font-mono bg-secondary p-2 rounded">
                      {step}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      {step}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Verificación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Verificación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Puedes verificar la solución sustituyendo los valores en las ecuaciones originales.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};