# Document Sign Storage DApp

Una aplicación descentralizada (DApp) para firmar, almacenar y verificar documentos digitalmente utilizando Blockchain (Ethereum/Foundry) y Next.js.

## 📋 Características

- **Firma de Documentos**: Sube un documento y fírmalo digitalmente usando tu billetera MetaMask.
- **Registro Inmutable**: El hash del documento y la firma se almacenan en la blockchain.
- **Verificación**: Cualquiera puede verificar la autenticidad de un documento y quién lo firmó subiendo el archivo original.
- **Historial**: Visualiza los documentos firmados por tu dirección.

## 🛠️ Tecnologías

- **Smart Contract**: Solidity, Foundry (Forge/Anvil).
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS.
- **Interacción Blockchain**: Ethers.js v6.
- **Testing**: Foundry (Unit), Playwright (E2E).

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Foundry](https://getfoundry.sh/) (Forge & Anvil)
- [MetaMask](https://metamask.io/) (Extensión de navegador)

## 📦 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/richardcmg7/document-sign-storage.git
cd document-sign-storage
```

### 2. Configurar Smart Contracts (Backend)

Inicia la blockchain local y despliega el contrato.

```bash
# Entrar al directorio de contratos
cd sc

# Instalar dependencias
forge install

# Compilar contratos
forge build

# Iniciar nodo local (Anvil) en una terminal nueva
anvil
```

**Nota**: Al iniciar `anvil`, verás una lista de cuentas y claves privadas. Y la URL RPC local: `http://127.0.0.1:8545`.

En **otra terminal**, despliega el contrato a la red local:

```bash
cd sc
forge script script/Deploy.s.sol:DeployScript --rpc-url http://127.0.0.1:8545 --broadcast
```

Copia la dirección del contrato desplegado (`Contract Address`) que aparece en la salida.

### 3. Configurar Frontend (DApp)

```bash
# Entrar al directorio de la dApp
cd ../dapp

# Instalar dependencias
npm install
```

Crea un archivo `.env.local` en `dapp/` con la siguiente configuración:

```env
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=<PEGAR_DIRECCION_DEL_CONTRATO_AQUI>
```

### 4. Ejecutar la Aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🧪 Testing

### Smart Contracts (Unit Tests)
```bash
cd sc
forge test
```

### Frontend (E2E Tests)
*Nota: Requiere que la DApp esté corriendo en localhost:3000 y Anvil en puerto 8545.*

```bash
cd dapp
npm run e2e
```

## 📂 Estructura del Proyecto

```
document-sign-storage/
├── sc/                 # Smart Contracts (Foundry)
│   ├── src/            # Código fuente Solidity
│   ├── test/           # Tests del contrato
│   └── script/         # Scripts de despliegue
└── dapp/               # Frontend (Next.js)
    ├── app/            # Páginas y rutas
    ├── components/     # Componentes React (Uploader, Signer, Verifier)
    ├── hooks/          # Hooks personalizados (useContract)
    ├── contexts/       # Contexto global (MetaMask)
    └── e2e/            # Tests End-to-End (Playwright)
```

## 📝 Estado del Proyecto

Consulta [PROJECT_STATUS.md](./PROJECT_STATUS.md) para ver el detalle del progreso, funcionalidades implementadas y tareas pendientes.
