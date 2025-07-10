class MatrixSolver {
    
    // Método de la matriz inversa
    static solveByInverse(coefficients, constants) {
        const steps = [];
        const n = coefficients.length;
        
        steps.push(`Método de la Matriz Inversa`);
        steps.push(`Sistema: Ax = b donde A es la matriz de coeficientes y b el vector constante`);
        
        // Calcular determinante
        const det = this.calculateDeterminant(coefficients);
        steps.push(`Determinante de A = ${det.toFixed(4)}`);
        
        if (Math.abs(det) < 1e-10) {
            throw new Error("El sistema no tiene solución única (determinante = 0)");
        }
        
        // Calcular matriz inversa
        const inverse = this.calculateInverse(coefficients);
        steps.push(`Calculando A^(-1)...`);
        
        // Multiplicar A^(-1) * b
        const solution = this.multiplyMatrixVector(inverse, constants);
        steps.push(`x = A^(-1) * b`);
        steps.push(`Solución encontrada:`);
        
        return {
            variables: solution,
            steps,
            determinant: det,
            method: "Matriz Inversa"
        };
    }

    // Método de Cramer
    static solveByCramer(coefficients, constants) {
        const steps = [];
        const n = coefficients.length;
        
        steps.push(`Método de Cramer`);
        
        // Calcular determinante principal
        const mainDet = this.calculateDeterminant(coefficients);
        steps.push(`Determinante principal = ${mainDet.toFixed(4)}`);
        
        if (Math.abs(mainDet) < 1e-10) {
            throw new Error("El sistema no tiene solución única (determinante = 0)");
        }
        
        const solution = [];
        
        // Para cada variable
        for (let i = 0; i < n; i++) {
            // Crear matriz sustituyendo la columna i con las constantes
            const tempMatrix = coefficients.map(row => [...row]);
            for (let j = 0; j < n; j++) {
                tempMatrix[j][i] = constants[j];
            }
            
            const det = this.calculateDeterminant(tempMatrix);
            const variable = det / mainDet;
            solution.push(variable);
            
            steps.push(`x${i + 1} = Det(A${i + 1}) / Det(A) = ${det.toFixed(4)} / ${mainDet.toFixed(4)} = ${variable.toFixed(4)}`);
        }
        
        return {
            variables: solution,
            steps,
            determinant: mainDet,
            method: "Cramer"
        };
    }

    // Método de Gauss-Jordan
    static solveByGaussJordan(coefficients, constants) {
        const steps = [];
        const n = coefficients.length;
        
        steps.push(`Método de Gauss-Jordan`);
        steps.push(`Matriz aumentada inicial:`);
        
        // Crear matriz aumentada
        const augmented = coefficients.map((row, i) => [...row, constants[i]]);
        steps.push(this.matrixToString(augmented));
        
        // Eliminación hacia adelante y hacia atrás
        for (let i = 0; i < n; i++) {
            // Encontrar pivote
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            // Intercambiar filas si es necesario
            if (maxRow !== i) {
                [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
                steps.push(`Intercambiando filas ${i + 1} y ${maxRow + 1}`);
                steps.push(this.matrixToString(augmented));
            }
            
            // Hacer el pivote = 1
            const pivot = augmented[i][i];
            if (Math.abs(pivot) < 1e-10) {
                throw new Error("El sistema no tiene solución única");
            }
            
            for (let j = 0; j <= n; j++) {
                augmented[i][j] /= pivot;
            }
            steps.push(`Dividiendo fila ${i + 1} por ${pivot.toFixed(4)}`);
            steps.push(this.matrixToString(augmented));
            
            // Eliminar elementos arriba y abajo del pivote
            for (let k = 0; k < n; k++) {
                if (k !== i && Math.abs(augmented[k][i]) > 1e-10) {
                    const factor = augmented[k][i];
                    for (let j = 0; j <= n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                    steps.push(`F${k + 1} = F${k + 1} - ${factor.toFixed(4)} * F${i + 1}`);
                    steps.push(this.matrixToString(augmented));
                }
            }
        }
        
        // Extraer solución
        const solution = augmented.map(row => row[n]);
        
        return {
            variables: solution,
            steps,
            method: "Gauss-Jordan"
        };
    }

    // Utilidades
    static calculateDeterminant(matrix) {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        
        // Para matrices mayores, usar expansión por cofactores
        let det = 0;
        for (let i = 0; i < n; i++) {
            const subMatrix = matrix.slice(1).map(row => 
                row.filter((_, colIndex) => colIndex !== i)
            );
            const cofactor = Math.pow(-1, i) * matrix[0][i] * this.calculateDeterminant(subMatrix);
            det += cofactor;
        }
        return det;
    }

    static calculateInverse(matrix) {
        const n = matrix.length;
        const det = this.calculateDeterminant(matrix);
        
        if (Math.abs(det) < 1e-10) {
            throw new Error("La matriz no es invertible");
        }
        
        // Calcular matriz de cofactores
        const cofactors = [];
        for (let i = 0; i < n; i++) {
            cofactors[i] = [];
            for (let j = 0; j < n; j++) {
                const subMatrix = matrix
                    .filter((_, rowIndex) => rowIndex !== i)
                    .map(row => row.filter((_, colIndex) => colIndex !== j));
                
                cofactors[i][j] = Math.pow(-1, i + j) * this.calculateDeterminant(subMatrix);
            }
        }
        
        // Transponer y dividir por determinante
        const inverse = [];
        for (let i = 0; i < n; i++) {
            inverse[i] = [];
            for (let j = 0; j < n; j++) {
                inverse[i][j] = cofactors[j][i] / det;
            }
        }
        
        return inverse;
    }

    static multiplyMatrixVector(matrix, vector) {
        return matrix.map(row => 
            row.reduce((sum, value, index) => sum + value * vector[index], 0)
        );
    }

    static matrixToString(matrix) {
        return matrix.map(row => 
            '[ ' + row.map(val => val.toFixed(3).padStart(8)).join(' ') + ' ]'
        ).join('\n');
    }
}