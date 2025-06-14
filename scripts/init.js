"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var util_1 = require("util");
var child_process_2 = require("child_process");
var inquirer_1 = __importDefault(require("inquirer"));
var execAsync = (0, util_1.promisify)(child_process_2.exec);
var defaultConfig = {
    name: "",
    description: "",
    author: "",
    repository: "",
    region: "us-east-1",
    memorySize: 256,
    timeout: 30,
    ephemeralStorage: 512
};
function getProjectConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var answers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, inquirer_1["default"].prompt([
                        {
                            type: "input",
                            name: "name",
                            message: "Nombre del proyecto (kebab-case):",
                            validate: function (input) { return /^[a-z0-9-]+$/.test(input) || "Debe ser kebab-case"; }
                        },
                        {
                            type: "input",
                            name: "description",
                            message: "Descripción del proyecto:"
                        },
                        {
                            type: "input",
                            name: "author",
                            message: "Autor:"
                        },
                        {
                            type: "input",
                            name: "repository",
                            message: "URL del repositorio:"
                        },
                        {
                            type: "list",
                            name: "region",
                            message: "Región AWS:",
                            choices: ["us-east-1", "us-west-2", "eu-west-1"],
                            "default": defaultConfig.region
                        },
                        {
                            type: "number",
                            name: "memorySize",
                            message: "Tamaño de memoria (MB):",
                            "default": defaultConfig.memorySize
                        },
                        {
                            type: "number",
                            name: "timeout",
                            message: "Timeout (segundos):",
                            "default": defaultConfig.timeout
                        },
                        {
                            type: "number",
                            name: "ephemeralStorage",
                            message: "Almacenamiento efímero (MB):",
                            "default": defaultConfig.ephemeralStorage
                        },
                    ])];
                case 1:
                    answers = _a.sent();
                    return [2, __assign(__assign({}, defaultConfig), answers)];
            }
        });
    });
}
function updatePackageJson(config) {
    return __awaiter(this, void 0, void 0, function () {
        var packagePath, packageJson;
        return __generator(this, function (_a) {
            packagePath = (0, path_1.join)(process.cwd(), "package.json");
            packageJson = JSON.parse((0, fs_1.readFileSync)(packagePath, "utf-8"));
            packageJson.name = config.name;
            packageJson.description = config.description;
            packageJson.author = config.author;
            packageJson.repository = {
                type: "git",
                url: config.repository
            };
            (0, fs_1.writeFileSync)(packagePath, JSON.stringify(packageJson, null, 2));
            return [2];
        });
    });
}
function createClaudiaConfig(config) {
    return __awaiter(this, void 0, void 0, function () {
        var claudiaConfig;
        return __generator(this, function (_a) {
            claudiaConfig = {
                name: config.name,
                region: config.region,
                handler: "index.handler",
                runtime: "nodejs22.x",
                memory: config.memorySize,
                timeout: config.timeout,
                description: config.description
            };
            (0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), "claudia.json"), JSON.stringify(claudiaConfig, null, 2));
            return [2];
        });
    });
}
function updateReadme(config) {
    return __awaiter(this, void 0, void 0, function () {
        var readmePath, readme, updatedReadme;
        return __generator(this, function (_a) {
            readmePath = (0, path_1.join)(process.cwd(), "README.md");
            readme = (0, fs_1.readFileSync)(readmePath, "utf-8");
            updatedReadme = readme
                .replace(/# 🚀 AWS Lambda Base/, "# \uD83D\uDE80 ".concat(config.name))
                .replace(/Este es un proyecto base.*/, config.description)
                .replace(/git clone https:\/\/github.com\/.*/, "git clone ".concat(config.repository));
            (0, fs_1.writeFileSync)(readmePath, updatedReadme);
            return [2];
        });
    });
}
function initializeGit(config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                (0, child_process_1.execSync)("rm -rf .git");
                (0, child_process_1.execSync)("git init");
                (0, child_process_1.execSync)("git add .");
                (0, child_process_1.execSync)('git commit -m "Initial commit"');
                (0, child_process_1.execSync)("git remote add origin ".concat(config.repository));
                (0, child_process_1.execSync)("git push -u origin main");
            }
            catch (error) {
                console.error("Error al inicializar git:", error);
            }
            return [2];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var config, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    console.log("🚀 Iniciando configuración del proyecto...");
                    return [4, getProjectConfig()];
                case 1:
                    config = _a.sent();
                    console.log("📝 Actualizando archivos de configuración...");
                    return [4, updatePackageJson(config)];
                case 2:
                    _a.sent();
                    return [4, createClaudiaConfig(config)];
                case 3:
                    _a.sent();
                    return [4, updateReadme(config)];
                case 4:
                    _a.sent();
                    console.log("📦 Instalando dependencias...");
                    (0, child_process_1.execSync)("npm install");
                    console.log("🔧 Configurando git...");
                    return [4, initializeGit(config)];
                case 5:
                    _a.sent();
                    console.log("✅ ¡Proyecto configurado exitosamente!");
                    console.log("\nPróximos pasos:");
                    console.log("1. Revisa la configuración en package.json y claudia.json");
                    console.log("2. Ejecuta 'npm run local' para probar localmente");
                    console.log("3. Ejecuta 'claudia create' para crear el Lambda en AWS");
                    console.log("4. Para actualizaciones, usa 'claudia update'");
                    return [3, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("❌ Error durante la inicialización:", error_1);
                    process.exit(1);
                    return [3, 7];
                case 7: return [2];
            }
        });
    });
}
main();
