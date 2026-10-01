# 🛡️ Automated Dependency Security Sandbox

This repository is equipped with an automated execution sandbox designed to intercept and block **Supply Chain Attacks** before malicious code reaches production. 

Whenever a Pull Request introduces or modifies third-party packages (`npm`, `pip`, etc.), an isolated runtime sandbox automatically inspects their behavior, analyzing script executions, network requests, and environment variables access.

---

## ✨ Features

- **Dynamic Behavioral Analysis:** Evaluates packages in an isolated runner to monitor hidden runtime intents.
- **Malicious Pattern Detection:** Flags unauthorized calls to `process.env`, suspicious outbound telemetry, and silent shell commands.
- **Automated Pull Request Blocking:** Prevents risky PRs from being merged and leaves an explicit security report in the comments.

---

## 🚀 How It Works (CI/CD Pipeline)

1. **Trigger:** A developer opens a Pull Request modifying dependency files (e.g., `package.json`, `requirements.txt`).
2. **Sandbox Isolation:** The GitHub Actions workflow spins up a transient environment and integrates with **Socket CLI** for dynamic deep scanning.
3. **Telemetry Check:** The system looks for severe threats, specifically:
   - `envVars`: Unauthorized attempts to harvest system secrets.
   - `networkAccess`: Unexpected outbound connections to suspicious IPs.
   - `shellExecution`: Lifecyle scripts running backdoor commands.
4. **Verdict:** If critical threats are found, the CI/CD pipeline fails, a security warning is posted on the PR conversation tab, and the merge button is locked.

---

## 🛠️ Setup Instructions

### 1. Add the GitHub Action Workflow
Ensure you have the following file structure and code inside your repository:
`.github/workflows/dependency-sandbox.yml`

### 2. Configure the Security Key
To grant the scanner access to behavioral intelligence feeds:
1. Generate an API token from your organization settings panel at [Socket.dev](https://socket.dev).
2. Navigate to your GitHub Repository **Settings > Secrets and variables > Actions**.
3. Create a **New repository secret**:
   - **Name:** `SOCKET_SECURITY_API_KEY`
   - **Secret:** `YOUR_SOCKET_API_TOKEN_HERE`

---

## 🧪 Simulating a Blocked PR (Testing the Sandbox)

To verify that the automated block is working correctly, you can simulate a suspicious dependency pull:

1. Create a new branch:
   ```bash
   git checkout -b test-sandbox-security
   ```
2. Add a dependency known for telemetry testing or dynamic alerts to your manifest file.
3. Commit the changes and push the branch to GitHub:
   ```bash
   git add .
   git commit -m "chore: test new package inclusion"
   git push origin test-sandbox-security
   ```
4. Open a **Pull Request** on GitHub.

You will see the pipeline execute, catch the behavioral anomalies, and print a warning block directly inside the Pull Request interface.
