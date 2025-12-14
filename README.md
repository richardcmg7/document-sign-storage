# Document Sign Storage DApp

Una aplicación descentralizada (DApp) para firmar, almacenar y verificar documentos digitalmente.

**Importante**: Esta aplicación está diseñada para funcionar localmente usando **Anvil** como blockchain de prueba.

## 📋 Características

- **Firma de Documentos**: Sube un documento y fírmalo digitalmente.
- **Registro Inmutable**: Almacena el hash del documento en la blockchain local.
- **Verificación**: Verifica la autenticidad y el firmante de cualquier documento.

## 🛠️ Requisitos

1.  **Foundry (Anvil)**: Para ejecutar la blockchain local.
    *   [Instalar Foundry](https://getfoundry.sh/)
2.  **Node.js**: Para ejecutar el frontend (v18+).
3.  **MetaMask**: Billetera en el navegador para firmar las transacciones.
    *   *Nota: Debes configurarlo para conectarse a `Localhost 8545`.*

## ⚡ Guía de Puesta en Marcha (Paso a Paso)

Sigue estos pasos en orden exacto para levantar el entorno completo.

### 1. Iniciar Blockchain Local (Terminal 1)
Inicia Anvil para tener una red Ethereum corriendo en tu máquina. Mantén esta terminal abierta.

```bash
cd sc
anvil
```
*Copia una de las "Private Keys" que muestra Anvil e impórtala en tu MetaMask para tener fondos.*

### 2. Desplegar el Contrato (Terminal 2)
Necesitamos "subir" el contrato inteligente a nuestra red local (Anvil).

```bash
cd sc
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

🛑 **¡ALTO!** Copia la dirección que aparece al final de la salida:
`Contract Address: 0x...` (La necesitarás en el paso 3).

### 3. Configurar Frontend (Terminal 2)
Dile a la aplicación dónde está el contrato.

```bash
cd ../dapp
cp .env.example .env.local  # O crea el archivo manualmente
```

Edita el archivo `.env.local`:
```env
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=<PEGAR_DIRECCION_DEL_CONTRATO_AQUI>
```

### 4. Ejecutar la Aplicación (Terminal 2)
Instala las dependencias y arranca el servidor web.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🌍 Despliegue en Testnet (Sepolia)

Si deseas probar la aplicación en una red pública real:

1.  **Desplegar Contrato**:
    ```bash
    cd sc
    forge script script/Deploy.s.sol:DeployScript \
      --rpc-url https://ethereum-sepolia-rpc.publicnode.com \
      --broadcast \
      --legacy \
      --private-key <TU_CLAVE_PRIVADA_SEPOLIA>
    ```

2.  **Configurar Frontend**:
    Actualiza `dapp/.env.local`:
    ```env
    NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
    NEXT_PUBLIC_CONTRACT_ADDRESS=<NUEVA_DIRECCION_DEL_CONTRATO>
    ```

3.  **Reiniciar**: `npm run dev`.

---

## 🔧 Configuración de MetaMask (Para pruebas manuales)

Para que la app funcione en el navegador:
1.  Abre MetaMask.
2.  Agrega una red manualmente (si no aparece "Localhost 8545"):
    *   **Nombre**: Anvil Local
    *   **RPC URL**: `http://127.0.0.1:8545`
    *   **Chain ID**: `31337`
    *   **Símbolo**: ETH
3.  Importa una cuenta usando una de las **Private Keys** que mostró Anvil al iniciarse.

## 🧪 Ejecutar Tests

### Tests del Contrato (Solidity)
```bash
cd sc
forge test
```

### Tests de la Aplicación (E2E)
*Requiere que la app esté corriendo en localhost:3000 y Anvil en puerto 8545.*
```bash
cd dapp
npm run e2e
```
