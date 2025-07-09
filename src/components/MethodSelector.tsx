import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MethodSelectorProps {
  onSolve: (method: 'inverse' | 'cramer' | 'gauss-jordan') => void;
  isLoading: boolean;
}

export const MethodSelector = ({ onSolve, isLoading }: MethodSelectorProps) => {
  const methods = [
    {
      key: 'inverse' as const,
      title: 'Método de la Matriz Inversa',
      description: 'Utiliza A⁻¹ para resolver x = A⁻¹b',
      icon: '🔢'
    },
    {
      key: 'cramer' as const,
      title: 'Regla de Cramer',
      description: 'Utiliza determinantes para encontrar cada variable',
      icon: '📐'
    },
    {
      key: 'gauss-jordan' as const,
      title: 'Método de Gauss-Jordan',
      description: 'Eliminación gaussiana con matriz aumentada',
      icon: '🔄'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona el Método de Resolución</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {methods.map((method) => (
            <Button
              key={method.key}
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => onSolve(method.key)}
              disabled={isLoading}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <div className="font-semibold">{method.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {method.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};