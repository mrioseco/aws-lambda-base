# 🧠 Proyecto Base Node.js + AWS Lambda (Serverless)

Este proyecto sigue una arquitectura estructurada, ideal para funciones Lambda en AWS escritas en TypeScript, con enfoque en mantenibilidad, escalabilidad y claridad.

---

## 📦 Stack y convenciones

- **Lenguaje:** TypeScript
- **Node Version:** `22` (definida en `.nvmrc`)
- **SDK AWS:** Siempre usar [`aws-sdk v3`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- **Región AWS por defecto:** `us-east-1`
- **Estilo:**
  - Siempre usar `async/await`
  - Siempre usar **funciones flecha**
  - Exports:
    - Si es una función única: `export default`
    - Si son múltiples funciones: `export const fn = () => {}` en la misma línea del export
  - Nombres de variables y funciones en camelCase
  - Interfaces y tipos en PascalCase
  - Constantes en UPPER_SNAKE_CASE

⚠️ Las **credenciales AWS no deben incluirse jamás** en el código. Se asume que se usa el **rol IAM** del entorno de ejecución (Lambda, ECS, etc.).

---

## 🗂 Estructura del Proyecto

```
src/
├── index.ts                    # Punto de entrada único (invocado por el handler)
├── AbstraLambdaHandler.ts      # Middleware que extrae y normaliza el payload
├── main.ts                     # Lógica principal de enrutamiento
├── controllers/                # Controladores (uno por tipo/verbo de solicitud)
│   ├── http/                   # Controladores para API Gateway
│   └── events/                 # Controladores para otros eventos (SNS, SQS, etc.)
├── useCases/                   # Lógica de negocio (independiente de infraestructura)
├── gateways/                   # Adaptadores a servicios externos (DynamoDB, S3, etc.)
├── adapters/                   # Transformadores de datos entre capas
├── types/                      # Definiciones de tipos e interfaces
└── utils/                      # Utilidades generales
```

## 🔁 Flujo de ejecución

1. `index.ts` recibe el evento (API Gateway, EventBridge, etc.)
2. `AbstraLambdaHandler.ts` normaliza el payload y lo pasa a `main.ts`
3. `main.ts` decide qué controlador ejecutar (por método HTTP o `operacion`)
4. El **controller** interpreta los datos y llama al **caso de uso** apropiado
5. El **caso de uso** ejecuta la lógica sin preocuparse de la fuente de los datos
6. Los **gateways** son usados por los casos de uso para interactuar con servicios externos
7. Los **adapters** transforman datos entre diferentes formatos sin efectos secundarios
8. La respuesta es devuelta en el formato adecuado según el origen (ej: respuesta HTTP)

---

## 🎯 Principios y Buenas Prácticas

### Arquitectura

- Separar claramente controladores, casos de uso y acceso a infraestructura
- Mantener `main.ts` lo más simple posible: solo enruta
- No usar lógica de negocio directamente en los controladores
- Asegurar que los casos de uso no dependan de frameworks ni eventos Lambda
- Validar inputs en los controladores, no en los casos de uso

### SOLID

De los principios SOLID, aplicamos principalmente:

- **S**ingle Responsibility: Cada módulo tiene una única responsabilidad
- **D**ependency Injection: Cuando mejora la testabilidad sin complicar el código

### Programación Funcional

- Preferir funciones puras cuando mejora la claridad
- Usar `map`, `reduce`, y `filter` en lugar de bucles cuando es más expresivo
- Evitar efectos secundarios innecesarios
- Todas las variables deben ser `const` para forzar buenos nombres

### Manejo de Errores

- Usar tipos específicos para errores
- Manejar errores en la capa más cercana a donde ocurren
- Loggear errores con contexto suficiente
- Retornar respuestas de error consistentes

### Testing

- Tests unitarios para casos de uso
- Tests de integración para gateways
- Mocks para servicios externos
- Coverage mínimo del 80%

### Logging

- Usar niveles de log apropiados (debug, info, warn, error)
- Incluir correlationId en todos los logs
- No loggear información sensible
- Estructurar logs en formato JSON

### Performance

- Minimizar dependencias
- Usar cold start optimizations
- Implementar caching cuando sea necesario
- Monitorear tiempos de ejecución

### Manejo de Operaciones Asíncronas en Lambda ⚠️

Es **CRUCIAL** entender que cuando el handler de Lambda termina su ejecución, todas las operaciones asíncronas pendientes se detienen abruptamente. Esto significa que:

- ✅ **CORRECTO**:

```typescript
// Esperar a que todas las promesas se resuelvan
const results = await Promise.all(
  items.map(async (item) => {
    return await processItem(item);
  })
);

// Usar for...of para operaciones secuenciales
for (const item of items) {
  await processItem(item);
}
```

- ❌ **INCORRECTO**:

```typescript
// ❌ NO HACER: Las operaciones se detendrán cuando el handler termine
items.map(async (item) => {
  await processItem(item); // Nunca se completará
});

// ❌ NO HACER: Similar al anterior
items.forEach(async (item) => {
  await processItem(item); // Nunca se completará
});
```

#### Reglas para Operaciones Asíncronas:

1. **Siempre usar `await`**:

   - En operaciones paralelas: `Promise.all()`
   - En operaciones secuenciales: `for...of`
   - En operaciones con límite de concurrencia: `p-limit` o similar

2. **Evitar**:

   - `forEach` con callbacks asíncronos
   - `map` sin `Promise.all`
   - Cualquier operación que no espere a que las promesas se resuelvan

3. **Patrones Recomendados**:

```typescript
// Paralelo (todos a la vez)
const results = await Promise.all(items.map(processItem));

// Secuencial (uno tras otro)
for (const item of items) {
  await processItem(item);
}

// Con límite de concurrencia
import pLimit from "p-limit";
const limit = pLimit(3); // máximo 3 operaciones simultáneas
const results = await Promise.all(
  items.map((item) => limit(() => processItem(item)))
);
```

4. **Manejo de Errores**:

```typescript
try {
  const results = await Promise.all(
    items.map(async (item) => {
      try {
        return await processItem(item);
      } catch (error) {
        // Manejar error individual
        return null;
      }
    })
  );
} catch (error) {
  // Manejar error general
}
```

5. **Timeouts**:

```typescript
// Añadir timeout a operaciones asíncronas
const timeout = (ms: number) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );

const result = await Promise.race([
  processItem(item),
  timeout(5000), // 5 segundos
]);
```

⚠️ **IMPORTANTE**: Recuerda que el tiempo máximo de ejecución de Lambda es de 15 minutos. Planifica tus operaciones asíncronas considerando este límite.

---

## 📝 Ejemplo de Estructura de Código

```typescript
// controller.ts
export const handleRequest = async (payload: NormalizedPayload) => {
  const result = await useCase(payload.data);
  return response.success(result);
};

// useCase.ts
export const useCase = async (data: InputData) => {
  const validated = validateInput(data);
  return await gateway.process(validated);
};

// gateway.ts
export const process = async (data: ValidatedData) => {
  const client = new DynamoDBClient({});
  // Implementación...
};
```

## 🚀 Guía de Inicio Rápido

### 1. Clonar y Personalizar el Proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/aws-lambda-base.git mi-nuevo-lambda

# 2. Entrar al directorio
cd mi-nuevo-lambda

# 3. Eliminar el git existente
rm -rf .git

# 4. Inicializar nuevo repositorio
git init
```

### 2. Archivos a Modificar

1. **package.json**:

```json
{
  "name": "mi-nuevo-lambda",
  "version": "1.0.0",
  "description": "Descripción de mi nuevo lambda",
  "author": "Tu Nombre",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/mi-nuevo-lambda"
  }
}
```

2. **serverless.yml**:

```yaml
service: mi-nuevo-lambda

provider:
  name: aws
  runtime: nodejs22.x
  region: us-east-1
  # ... resto de la configuración
```

3. **README.md**:

   - Actualizar el título
   - Modificar la descripción
   - Actualizar los badges
   - Ajustar la documentación específica

4. **Variables de Entorno**:
   - Crear `.env.example` con las variables necesarias
   - Actualizar `.gitignore` si es necesario

### 3. Estructura de Archivos a Mantener

```
.
├── .github/                    # Workflows de GitHub Actions
├── .vscode/                    # Configuración de VS Code
├── src/                        # Código fuente
├── tests/                      # Tests
├── .env.example               # Ejemplo de variables de entorno
├── .eslintrc.js              # Configuración de ESLint
├── .gitignore                # Archivos ignorados por git
├── .nvmrc                    # Versión de Node
├── jest.config.js            # Configuración de Jest
├── package.json              # Dependencias y scripts
├── serverless.yml            # Configuración de Serverless
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Documentación
```

### 4. Scripts Útiles en package.json

```json
{
  "scripts": {
    "dev": "serverless offline",
    "deploy": "serverless deploy",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "build": "tsc",
    "clean": "rm -rf .serverless node_modules",
    "prepare": "husky install"
  }
}
```

### 5. Configuración Inicial

1. **Instalar Dependencias**:

```bash
npm install
```

2. **Configurar Variables de Entorno**:

```bash
cp .env.example .env
# Editar .env con tus valores
```

3. **Configurar AWS**:

```bash
# Asegúrate de tener las credenciales AWS configuradas
aws configure
```

4. **Inicializar Git**:

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/mi-nuevo-lambda.git
git push -u origin main
```

### 6. Verificación

1. **Ejecutar Tests**:

```bash
npm test
```

2. **Probar Localmente**:

```bash
npm run dev
```

3. **Desplegar**:

```bash
npm run deploy
```

### 7. Mantenimiento

- Mantener actualizadas las dependencias:

```bash
npm audit
npm update
```

- Verificar la cobertura de tests:

```bash
npm test -- --coverage
```

- Limpiar el proyecto:

```bash
npm run clean
```
