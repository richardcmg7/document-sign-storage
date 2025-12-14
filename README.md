# Document Sign Storage DApp

Una aplicación descentralizada (DApp) para firmar, almacenar y verificar documentos digitalmente en la Blockchain.

## 📋 Características

- **Firma Digital**: Sube documentos y fírmalos criptográficamente con tu billetera (MetaMask).
- **Inmutabilidad**: El hash del documento y la firma quedan registrados permanentemente en la blockchain.
- **Verificación Pública**: Cualquiera puede verificar la autenticidad y el firmante de un documento original.
- **Historial**: Visualiza todos los documentos firmados y almacenados.

## 🛠️ Tecnologías

- **Blockchain**: Solidity, Foundry (Forge/Anvil).
- **Frontend**: Next.js 14, React, Tailwind CSS, Ethers.js v6.
- **Redes Soportadas**: Localhost (Anvil), Ethereum Sepolia (Testnet).

## 🚀 Guía de Inicio Rápido (Local - Anvil)

Ideal para desarrollo y pruebas rápidas sin costo.

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) (v18+)
- [Foundry](https://getfoundry.sh/)
- [MetaMask](https://metamask.io/) configurado.

### 2. Iniciar Blockchain Local
Abra una terminal y ejecuta:
```bash
cd sc
anvil
```
*Mantén esta terminal abierta.*

### 3. Desplegar Contrato
En una **segunda terminal**:
```bash
cd sc
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
⚠️ **COPIA** la `Contract Address` que aparece al final (ej: `0x5FbDB...`).

### 4. Configurar Frontend
```bash
cd ../dapp
cp .env.example .env.local
```
Edita `.env.local` con la dirección copiada:
```env
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=<PEGAR_DIRECCION_AQUI>
```

### 5. Ejecutar App
```bash
npm install
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000).
*Configura MetaMask en la red `Localhost 8545` e importa una cuenta de Anvil.*

---

## 🌍 Despliegue en Testnet (Sepolia)

Para hacer tu aplicación pública en Internet.

### 1. Conseguir Sepolia ETH
Necesitas fondos de prueba. Usa un "Faucet" (ej: Google "Sepolia Faucet") para conseguir ETH gratis en tu billetera.

### 2. Desplegar en Sepolia
Ejecuta desde `sc/`:
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://ethereum-sepolia-rpc.publicnode.com \
  --broadcast \
  --legacy \
  --private-key <TU_CLAVE_PRIVADA_REAL>
```
*Nota: Nunca compartas tu clave privada.*

### 3. Configurar Frontend
Actualiza `dapp/.env.local`:
```env
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CONTRACT_ADDRESS=<NUEVA_DIRECCION_DE_SEPOLIA>
```

### 4. Reiniciar y Usar
Reinicia el servidor (`npm run dev`) y asegúrate de que **MetaMask esté conectado a la red Sepolia**.

---

## ❓ Solución de Problemas Comunes

### Error: `could not decode result data (value="0x", code=BAD_DATA)`
*   **Causa**: Estás intentando leer el contrato desde la red equivocada.
*   **Solución**: Revisa tu MetaMask. Si desplegaste en Sepolia, **MetaMask debe estar en Sepolia**. Si está en Ethereum Mainnet o Localhost, fallará porque no encuentra el contrato en esa red.

### Error: `Insufficient funds` en Localhost
*   **Causa**: MetaMask tiene un historial de transacciones desincronizado con Anvil (Nonce mismatch).
*   **Solución**: En MetaMask, ve a **Configuración > Avanzado > Borrar datos de la pestaña de actividad** (Reset Account). Esto no borra fondos, solo reinicia el historial local.

### La transacción falla en MetaMask (Localhost)
*   **Causa**: Estás usando una cuenta sin fondos o la red incorrecta.
*   **Solución**: Asegúrate de importar una de las claves privadas que imprime `anvil` al iniciarse (tienen 10,000 ETH de prueba).

---

## 🧪 Testing

### Smart Contracts
```bash
cd sc
forge test
```

### Frontend (E2E)
```bash
cd dapp
npm run e2e
```