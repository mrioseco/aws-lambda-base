import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { promisify } from "util";
import { exec } from "child_process";
import inquirer from "inquirer";

const execAsync = promisify(exec);

interface ProjectConfig {
  name: string;
  description: string;
  author: string;
  repository: string;
  region: string;
  memorySize: number;
  timeout: number;
  ephemeralStorage: number;
}

const defaultConfig: ProjectConfig = {
  name: "",
  description: "",
  author: "",
  repository: "",
  region: "us-east-1",
  memorySize: 256,
  timeout: 30,
  ephemeralStorage: 512,
};

async function getProjectConfig(): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Nombre del proyecto (kebab-case):",
      validate: (input) => /^[a-z0-9-]+$/.test(input) || "Debe ser kebab-case",
    },
    {
      type: "input",
      name: "description",
      message: "Descripción del proyecto:",
    },
    {
      type: "input",
      name: "author",
      message: "Autor:",
    },
    {
      type: "input",
      name: "repository",
      message: "URL del repositorio:",
    },
    {
      type: "list",
      name: "region",
      message: "Región AWS:",
      choices: ["us-east-1", "us-west-2", "eu-west-1"],
      default: defaultConfig.region,
    },
    {
      type: "number",
      name: "memorySize",
      message: "Tamaño de memoria (MB):",
      default: defaultConfig.memorySize,
    },
    {
      type: "number",
      name: "timeout",
      message: "Timeout (segundos):",
      default: defaultConfig.timeout,
    },
    {
      type: "number",
      name: "ephemeralStorage",
      message: "Almacenamiento efímero (MB):",
      default: defaultConfig.ephemeralStorage,
    },
  ]);

  return { ...defaultConfig, ...answers };
}

async function updatePackageJson(config: ProjectConfig) {
  const packagePath = join(process.cwd(), "package.json");
  const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));

  packageJson.name = config.name;
  packageJson.description = config.description;
  packageJson.author = config.author;
  packageJson.repository = {
    type: "git",
    url: config.repository,
  };

  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
}

async function createClaudiaConfig(config: ProjectConfig) {
  const claudiaConfig = {
    name: config.name,
    region: config.region,
    handler: "index.handler",
    runtime: "nodejs22.x",
    memory: config.memorySize,
    timeout: config.timeout,
    description: config.description,
  };

  writeFileSync(
    join(process.cwd(), "claudia.json"),
    JSON.stringify(claudiaConfig, null, 2)
  );
}

async function updateReadme(config: ProjectConfig) {
  const readmePath = join(process.cwd(), "README.md");
  const readme = readFileSync(readmePath, "utf-8");

  const updatedReadme = readme
    .replace(/# 🚀 AWS Lambda Base/, `# 🚀 ${config.name}`)
    .replace(/Este es un proyecto base.*/, config.description)
    .replace(
      /git clone https:\/\/github.com\/.*/,
      `git clone ${config.repository}`
    );

  writeFileSync(readmePath, updatedReadme);
}

async function initializeGit(config: ProjectConfig) {
  try {
    execSync("rm -rf .git");
    execSync("git init");
    execSync("git add .");
    execSync('git commit -m "Initial commit"');
    execSync(`git remote add origin ${config.repository}`);
    execSync("git push -u origin main");
  } catch (error) {
    console.error("Error al inicializar git:", error);
  }
}

async function main() {
  try {
    console.log("🚀 Iniciando configuración del proyecto...");

    const config = await getProjectConfig();

    console.log("📝 Actualizando archivos de configuración...");
    await updatePackageJson(config);
    await createClaudiaConfig(config);
    await updateReadme(config);

    console.log("📦 Instalando dependencias...");
    execSync("npm install");

    console.log("🔧 Configurando git...");
    await initializeGit(config);

    console.log("✅ ¡Proyecto configurado exitosamente!");
    console.log("\nPróximos pasos:");
    console.log("1. Revisa la configuración en package.json y claudia.json");
    console.log("2. Ejecuta 'npm run local' para probar localmente");
    console.log("3. Ejecuta 'claudia create' para crear el Lambda en AWS");
    console.log("4. Para actualizaciones, usa 'claudia update'");
  } catch (error) {
    console.error("❌ Error durante la inicialización:", error);
    process.exit(1);
  }
}

main();
