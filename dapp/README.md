# dapp (Frontend)

Estructura base para la dApp Next.js + TypeScript + TailwindCSS + Ethers v6.

## Carpetas principales
- app/: Páginas y layout principal (Next.js 14+)
- components/: Componentes reutilizables de UI
- contexts/: Context Providers (ej. MetaMaskContext)
- hooks/: Custom hooks (ej. useContract)
- styles/: Archivos de estilos (ej. tailwind.css)
- abi/: ABI de contratos

## Instalación y arranque
1. Instala dependencias:
   npm install
2. Arranca el servidor:
   npm run dev

Configura las variables en `.env.local` según el contrato desplegado.
