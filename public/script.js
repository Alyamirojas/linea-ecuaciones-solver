class EquationSolver {
    constructor() {
        this.size = 3;
        this.coefficients = [
            ['2', '1', '-1'],
            ['-3', '-1', '2'],
            ['-2', '1', '2']
        ];
        this.constants = ['8', '-11', '-3'];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateMatrix();
        this.renderMatrixInputs();
        this.updateEquationPreview();
    }
    
    bindEvents() {
        // Size selector
        document.getElementById('size').addEventListener('change', (e) => {
            this.updateSize(parseInt(e.target.value));
        });
        
        // Load example button
        document.getElementById('load-example').addEventListener('click', () => {
            this.loadExample();
        });
        
        // Method buttons
        document.querySelectorAll('.method-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const method = e.currentTarget.dataset.method;
                this.solveProblem(method);
            });
        });
        
        // Toast close button
        document.getElementById('toast-close').addEventListener('click', () => {
            this.hideToast();
        });
    }
    
    updateSize(newSize) {
        this.size = newSize;
        
        // Ajustar matriz de coeficientes
        const newCoefficients = Array(newSize).fill(null).map((_, i) => 
            Array(newSize).fill(null).map((_, j) => 
                this.coefficients[i]?.[j] || '0'
            )
        );
        
        // Ajustar vector de constantes
        const newConstants = Array(newSize).fill(null).map((_, i) => 
            this.constants[i] || '0'
        );
        
        this.coefficients = newCoefficients;
        this.constants = newConstants;
        
        this.renderMatrixInputs();
        this.updateMatrix();
        this.updateEquationPreview();
    }
    
    renderMatrixInputs() {
        const container = document.getElementById('matrix-inputs');
        container.innerHTML = '';
        
        for (let row = 0; row < this.size; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'matrix-row';
            
            // Row label
            const label = document.createElement('span');
            label.className = 'row-label';
            label.textContent = `F${row + 1}:`;
            rowDiv.appendChild(label);
            
            // Coefficient inputs
            for (let col = 0; col < this.size; col++) {
                const group = document.createElement('div');
                group.className = 'coefficient-group';
                
                const input = document.createElement('input');
                input.type = 'number';
                input.step = 'any';
                input.className = 'matrix-input';
                input.value = this.coefficients[row][col];
                input.addEventListener('input', (e) => {
                    this.updateCoefficient(row, col, e.target.value);
                });
                
                const variableLabel = document.createElement('span');
                variableLabel.className = 'variable-label';
                variableLabel.textContent = `x${col + 1}${col < this.size - 1 ? ' +' : ' ='}`;
                
                group.appendChild(input);
                group.appendChild(variableLabel);
                rowDiv.appendChild(group);
            }
            
            // Constant input
            const constantInput = document.createElement('input');
            constantInput.type = 'number';
            constantInput.step = 'any';
            constantInput.className = 'matrix-input constant-input';
            constantInput.value = this.constants[row];
            constantInput.addEventListener('input', (e) => {
                this.updateConstant(row, e.target.value);
            });
            
            rowDiv.appendChild(constantInput);
            container.appendChild(rowDiv);
        }
    }
    
    updateCoefficient(row, col, value) {
        this.coefficients[row][col] = value;
        this.updateMatrix();
        this.updateEquationPreview();
    }
    
    updateConstant(row, value) {
        this.constants[row] = value;
        this.updateMatrix();
        this.updateEquationPreview();
    }
    
    updateMatrix() {
        try {
            this.numCoefficients = this.coefficients.map(row => 
                row.map(val => parseFloat(val) || 0)
            );
            this.numConstants = this.constants.map(val => parseFloat(val) || 0);
        } catch (error) {
            console.error('Error parsing matrix:', error);
        }
    }
    
    updateEquationPreview() {
        const container = document.getElementById('equation-preview');
        container.innerHTML = '';
        
        for (let row = 0; row < this.size; row++) {
            const div = document.createElement('div');
            div.className = 'equation-line';
            
            let equation = '';
            for (let col = 0; col < this.size; col++) {
                const coeff = this.coefficients[row][col];
                const sign = col > 0 ? (parseFloat(coeff) >= 0 ? ' + ' : ' - ') : '';
                const value = col > 0 && parseFloat(coeff) < 0 ? Math.abs(parseFloat(coeff)) : coeff;
                equation += `${sign}${value}x${col + 1}`;
            }
            equation += ` = ${this.constants[row]}`;
            
            div.textContent = equation;
            container.appendChild(div);
        }
    }
    
    loadExample() {
        if (this.size === 2) {
            this.coefficients = [['2', '3'], ['1', '-1']];
            this.constants = ['7', '1'];
        } else if (this.size === 3) {
            this.coefficients = [['2', '1', '-1'], ['-3', '-1', '2'], ['-2', '1', '2']];
            this.constants = ['8', '-11', '-3'];
        } else if (this.size === 4) {
            this.coefficients = [
                ['1', '2', '-1', '3'],
                ['2', '-1', '1', '1'],
                ['1', '1', '1', '1'],
                ['3', '1', '2', '-1']
            ];
            this.constants = ['6', '5', '4', '8'];
        }
        
        this.renderMatrixInputs();
        this.updateMatrix();
        this.updateEquationPreview();
    }
    
    async solveProblem(method) {
        if (this.numCoefficients.length === 0 || this.numConstants.length === 0) {
            this.showToast('Error', 'Por favor ingresa un sistema de ecuaciones válido', 'error');
            return;
        }
        
        this.setLoading(true);
        
        try {
            let result;
            
            switch (method) {
                case 'inverse':
                    result = MatrixSolver.solveByInverse(this.numCoefficients, this.numConstants);
                    break;
                case 'cramer':
                    result = MatrixSolver.solveByCramer(this.numCoefficients, this.numConstants);
                    break;
                case 'gauss-jordan':
                    result = MatrixSolver.solveByGaussJordan(this.numCoefficients, this.numConstants);
                    break;
                default:
                    throw new Error("Método no válido");
            }
            
            this.displayResult(result);
            this.showToast('¡Éxito!', `Sistema resuelto usando ${result.method}`, 'success');
        } catch (err) {
            const errorMessage = err.message || "Error desconocido";
            this.displayError(errorMessage);
            this.showToast('Error al resolver', errorMessage, 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    displayResult(solution) {
        const container = document.getElementById('result-display');
        container.innerHTML = '';
        container.className = 'card';
        
        // Solution card
        const solutionCard = this.createSolutionCard(solution);
        container.appendChild(solutionCard);
        
        // Steps card
        const stepsCard = this.createStepsCard(solution);
        container.appendChild(stepsCard);
        
        // Verification card
        const verificationCard = this.createVerificationCard();
        container.appendChild(verificationCard);
    }
    
    createSolutionCard(solution) {
        const card = document.createElement('div');
        card.className = 'card solution-card';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="solution-header">
                    <h2>Solución</h2>
                    <span class="badge">${solution.method}</span>
                </div>
            </div>
            <div class="card-content">
                <div class="solution-variables">
                    ${solution.variables.map((value, index) => `
                        <div class="variable-result">
                            <span class="variable-name">x${index + 1} =</span>
                            <span class="variable-value">${value.toFixed(4)}</span>
                        </div>
                    `).join('')}
                </div>
                ${solution.determinant !== undefined ? `
                    <div class="separator"></div>
                    <div class="determinant-info">
                        <strong>Determinante:</strong> ${solution.determinant.toFixed(4)}
                    </div>
                ` : ''}
            </div>
        `;
        
        return card;
    }
    
    createStepsCard(solution) {
        const card = document.createElement('div');
        card.className = 'card';
        
        const header = document.createElement('div');
        header.className = 'card-header';
        header.innerHTML = '<h2>Desarrollo Paso a Paso</h2>';
        
        const content = document.createElement('div');
        content.className = 'card-content';
        
        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'steps-container';
        
        solution.steps.forEach(step => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-item';
            
            if (step.includes('Matriz') || step.includes('Método')) {
                stepDiv.className += ' step-header';
                stepDiv.textContent = step;
            } else if (step.includes('[')) {
                stepDiv.className += ' step-matrix';
                stepDiv.textContent = step;
            } else if (step.includes('=')) {
                stepDiv.className += ' step-equation';
                stepDiv.textContent = step;
            } else {
                stepDiv.className += ' step-text';
                stepDiv.textContent = step;
            }
            
            stepsContainer.appendChild(stepDiv);
        });
        
        content.appendChild(stepsContainer);
        card.appendChild(header);
        card.appendChild(content);
        
        return card;
    }
    
    createVerificationCard() {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="card-header">
                <h2 style="font-size: 0.875rem;">Verificación</h2>
            </div>
            <div class="card-content">
                <p style="font-size: 0.75rem; color: hsl(var(--muted-foreground));">
                    Puedes verificar la solución sustituyendo los valores en las ecuaciones originales.
                </p>
            </div>
        `;
        
        return card;
    }
    
    displayError(errorMessage) {
        const container = document.getElementById('result-display');
        container.innerHTML = '';
        container.className = 'card error-card';
        
        container.innerHTML = `
            <div class="card-header">
                <h2 class="error-title">Error</h2>
            </div>
            <div class="card-content">
                <p class="error-text">${errorMessage}</p>
            </div>
        `;
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        const buttons = document.querySelectorAll('.method-btn');
        buttons.forEach(btn => {
            btn.disabled = loading;
        });
        
        if (loading) {
            document.body.classList.add('loading');
        } else {
            document.body.classList.remove('loading');
        }
    }
    
    showToast(title, description, type = 'success') {
        const toast = document.getElementById('toast');
        const titleEl = document.getElementById('toast-title');
        const descriptionEl = document.getElementById('toast-description');
        
        titleEl.textContent = title;
        descriptionEl.textContent = description;
        
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }
    
    hideToast() {
        const toast = document.getElementById('toast');
        toast.classList.add('hidden');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EquationSolver();
});