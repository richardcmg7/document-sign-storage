import { test, expect } from "@playwright/test";

// IMPORTANTE: Antes de ejecutar estos tests:
// 1. Asegúrate de que Anvil esté corriendo: cd ../sc && anvil
// 2. Despliega el contrato una vez: cd ../sc && forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
// 3. Asegúrate de que Next.js esté corriendo con las variables de entorno correctas: npm run dev
// 4. Ejecuta los tests: npm run e2e

test("flujo completo de documento", async ({ page }) => {
  // Capturar logs de consola
  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`[LOG]`, msg.text());
    }
  });

  // Aceptar automáticamente todos los diálogos de confirmación
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  // 1. Subir archivo y firmar
  await page.goto("http://localhost:3000/upload");
  await page.setInputFiles('input[type="file"]', "./e2e/sample.txt");

  const signButton = page.locator('button:has-text("Sign Document")');
  await signButton.waitFor({ state: "visible", timeout: 5000 });
  await page.waitForTimeout(500);

  await signButton.click();
  await page.waitForTimeout(2000);

  const storeButton = page.locator("text=Store on Blockchain");
  await storeButton.waitFor({ state: "visible", timeout: 10000 });
  await page.click("text=Store on Blockchain");
  await page.waitForTimeout(3000);

  // Verificar que apareció mensaje de éxito
  const successMessage = page.locator("text=/Document successfully stored|almacenado en blockchain/i");
  await expect(successMessage).toBeVisible({ timeout: 15000 });
  console.log("✅ Documento almacenado exitosamente");

  // 2. Ir al historial
  await page.goto("http://localhost:3000/history");
  await page.waitForTimeout(2000);
  console.log("✅ Navegado a historial");

  // 3. Verificar documento con el firmante correcto
  const signer = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Wallet 0 de Anvil
  await page.goto("http://localhost:3000/verify");
  await page.setInputFiles('input[type="file"]', "./e2e/sample.txt");
  await page.fill('input[placeholder="0x..."]', signer);
  await page.waitForTimeout(1000);
  
  const verifyButton = page.locator('button:has-text("Verify Document")');
  await verifyButton.click({ force: true });
  await page.waitForTimeout(2000);
  
  const resultDiv = page.locator('div.p-6.rounded-lg.border-2');
  await expect(resultDiv).toBeVisible({ timeout: 15000 });
  
  const resultText = await resultDiv.textContent();
  console.log("✅ Resultado de verificación:", resultText);
  expect(resultText).toMatch(/válido|✅/i);
});

test("no permite almacenar documento duplicado", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`[LOG]`, msg.text());
    }
  });

  // Intentar almacenar el mismo documento (sample.txt) nuevamente
  await page.goto("http://localhost:3000/upload");
  await page.setInputFiles('input[type="file"]', "./e2e/sample.txt");
  
  const signButton = page.locator('button:has-text("Sign Document")');
  await signButton.waitFor({ state: "visible", timeout: 5000 });
  await page.waitForTimeout(500);
  
  await signButton.click();
  await page.waitForTimeout(2000);
  
  const storeButton = page.locator("text=Store on Blockchain");
  await storeButton.waitFor({ state: "visible", timeout: 10000 });
  await page.click("text=Store on Blockchain");
  await page.waitForTimeout(3000);
  
  // Verificar que aparece el mensaje de error
  const errorMessage = page.locator("text=/documento ya fue almacenado|already exists|Document already exists/i");
  await expect(errorMessage).toBeVisible({ timeout: 15000 });
  
  console.log("✅ Test pasado: El sistema correctamente rechazó el documento duplicado");
});

test("verifica con firmante incorrecto", async ({ page }) => {
  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`[LOG]`, msg.text());
    }
  });

  await page.goto("http://localhost:3000/verify");
  await page.setInputFiles('input[type="file"]', "./e2e/sample.txt");
  
  // Wallet 1 de Anvil (no es el firmante original)
  const wrongSigner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  await page.fill('input[placeholder="0x..."]', wrongSigner);
  await page.waitForTimeout(1000);
  
  const verifyButton = page.locator('button:has-text("Verify Document")');
  await verifyButton.click({ force: true });
  await page.waitForTimeout(2000);
  
  const resultDiv = page.locator('div.p-6.rounded-lg.border-2');
  await expect(resultDiv).toBeVisible({ timeout: 15000 });
  
  const resultText = await resultDiv.textContent();
  console.log("✅ Resultado:", resultText);
  
  expect(resultText).toMatch(/❌|Firmante incorrecto|Signer mismatch/i);
  console.log("✅ Test pasado: Sistema detectó firmante incorrecto");
});

test("documento no existente", async ({ page }) => {
  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`[LOG]`, msg.text());
    }
  });

  const fs = require('fs');
  const testFile = './e2e/nonexistent.txt';
  fs.writeFileSync(testFile, 'Este documento nunca fue almacenado en blockchain');
  
  await page.goto("http://localhost:3000/verify");
  await page.setInputFiles('input[type="file"]', testFile);
  await page.fill('input[placeholder="0x..."]', "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  await page.waitForTimeout(1000);
  
  const verifyButton = page.locator('button:has-text("Verify Document")');
  await verifyButton.click({ force: true });
  await page.waitForTimeout(2000);
  
  const resultDiv = page.locator('div.p-6.rounded-lg.border-2');
  await expect(resultDiv).toBeVisible({ timeout: 15000 });
  
  const resultText = await resultDiv.textContent();
  console.log("✅ Resultado:", resultText);
  
  expect(resultText).toMatch(/Document not found|no encontrado/i);
  fs.unlinkSync(testFile);
  
  console.log("✅ Test pasado: Sistema detectó documento no existente");
});

test("múltiples documentos", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(`[LOG]`, msg.text());
    }
  });

  const fs = require('fs');
  const testFile2 = './e2e/second-doc.txt';
  fs.writeFileSync(testFile2, 'Documento adicional para pruebas');

  // Firmar y almacenar segundo documento
  await page.goto("http://localhost:3000/upload");
  await page.setInputFiles('input[type="file"]', testFile2);
  
  const signButton = page.locator('button:has-text("Sign Document")');
  await signButton.waitFor({ state: "visible", timeout: 5000 });
  await page.waitForTimeout(500);
  
  await signButton.click();
  await page.waitForTimeout(2000);
  
  const storeButton = page.locator("text=Store on Blockchain");
  await storeButton.waitFor({ state: "visible", timeout: 10000 });
  await page.click("text=Store on Blockchain");
  await page.waitForTimeout(3000);
  
  const successMessage = page.locator("text=/Document successfully stored|almacenado en blockchain/i");
  await expect(successMessage).toBeVisible({ timeout: 15000 });
  console.log("✅ Segundo documento almacenado");

  // Verificar el segundo documento
  await page.goto("http://localhost:3000/verify");
  await page.setInputFiles('input[type="file"]', testFile2);
  await page.fill('input[placeholder="0x..."]', "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  await page.waitForTimeout(1000);
  
  const verifyButton = page.locator('button:has-text("Verify Document")');
  await verifyButton.click({ force: true });
  await page.waitForTimeout(2000);
  
  const resultDiv = page.locator('div.p-6.rounded-lg.border-2');
  await expect(resultDiv).toBeVisible({ timeout: 15000 });
  
  const resultText = await resultDiv.textContent();
  expect(resultText).toMatch(/válido|✅/i);
  
  fs.unlinkSync(testFile2);
  console.log("✅ Test pasado: Múltiples documentos pueden ser firmados y verificados");
});