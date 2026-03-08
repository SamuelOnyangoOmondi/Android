# Push This Project to GitHub

Follow these steps to put your code on GitHub.

---

## 1. Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in.
2. Click **+** (top right) → **New repository**.
3. Choose a **Repository name** (e.g. `PalmTestApp`).
4. Choose **Public** or **Private**.
5. **Do not** check "Add a README", "Add .gitignore", or "Choose a license" (your project already has files).
6. Click **Create repository**.

---

## 2. Initialize Git and push (first time)

Open a terminal in this project folder and run:

```bash
# Go to project root
cd /Users/samuelomondi/AndroidStudioProjects/PalmTestApp

# Initialize Git (only if not already a git repo)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit"

# Add your GitHub repo as remote (replace YOUR_REPO with your repo name, e.g. PalmTestApp)
git remote add origin https://github.com/SamuelOnyangoOmondi/YOUR_REPO.git

# Rename branch to main (if needed) and push
git branch -M main
git push -u origin main
```

**Replace** `YOUR_REPO` with the repository name you created on GitHub (e.g. `PalmTestApp`). Your username is already set: [SamuelOnyangoOmondi](https://github.com/SamuelOnyangoOmondi).

---

## 3. If you use SSH instead of HTTPS

If you use SSH keys with GitHub:

```bash
git remote add origin git@github.com:SamuelOnyangoOmondi/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 4. Later: push new changes

After the first push, use:

```bash
git add .
git commit -m "Describe your changes"
git push
```

---

## Optional: add a .gitignore

If you don’t have a `.gitignore` yet, add one so build outputs and IDE files aren’t committed. For Android:

- `.idea/`
- `*.iml`
- `local.properties`
- `build/`
- `.gradle/`

You can create a `.gitignore` and add these lines, then run `git add .` and `git commit` again before pushing.

---

## Troubleshooting

- **"remote origin already exists"**  
  Run: `git remote remove origin`  
  Then add the correct `origin` again with `git remote add origin ...`.

- **Authentication failed**  
  Use a [Personal Access Token](https://github.com/settings/tokens) instead of your password when using HTTPS, or set up [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

- **Large files / push rejected**  
  Ensure large binaries or generated files are in `.gitignore` and not added with `git add .`.
