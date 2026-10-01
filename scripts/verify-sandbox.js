const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Simulates a local lightweight sandbox behavior check by monitoring 
 * if a specific package attempts suspicious system calls.
 */
function verifyPackageSafety(packageName) {
    console.log(`[SANDBOX] Inspecting package: ${packageName}...`);
    
    try {
        // Fetch package metadata and install scripts safely without executing them
        const manifest = execSync(`npm view ${packageName} --json`, { encoding: 'utf-8' });
        const data = JSON.parse(manifest);
        
        const scripts = data.scripts || {};
        const installScripts = [scripts.preinstall, scripts.install, scripts.postinstall].filter(Boolean);
        
        // Red flags for supply chain attacks
        const maliciousPatterns = [
            /curl/i, 
            /wget/i, 
            /process\.env/i, 
            /fetch\(/i, 
            /http/i, 
            /sh -c/i
        ];
        
        let triggersAlert = false;
        
        for (const script of installScripts) {
            for (const pattern of maliciousPatterns) {
                if (pattern.test(script)) {
                    console.error(`\x1b[31m[ALERT] Suspicious pattern ${pattern} found in lifecycle script: "${script}"\x1b[0m`);
                    triggersAlert = true;
                }
            }
        }
        
        if (triggersAlert) {
            console.error(`\x1b[31m[FAIL] ${packageName} failed pre-sandbox inspection. Do not merge.\x1b[0m`);
            process.exit(1);
        } else {
            console.log(`\x1b[32m[PASS] ${packageName} looks safe for local sandbox execution.\x1b[0m`);
        }
        
    } catch (error) {
        console.error(`Error analyzing package ${packageName}:`, error.message);
        process.exit(1);
    }
}

// Example usage: node verify-sandbox.js <package-name>
const targetPackage = process.argv[2];
if (!targetPackage) {
    console.log("Usage: node verify-sandbox.js <package-name>");
    process.exit(1);
}

verifyPackageSafety(targetPackage);
