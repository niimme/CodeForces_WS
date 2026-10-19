# Repository Rules: Always Run Online

## Mandatory Rule: Always Deploy Online After Changes

Whenever any code changes, bug fixes, UI adjustments, or new features are implemented, tested, and verified:

1. **Commit and Push to GitHub**:
   - Stage all modified files: `git add .`
   - Commit with a clear, conventional commit message: `git commit -m "..."`
   - Push to the remote repository: `git push origin main`

2. **Deploy Live Online to Google Cloud Run**:
   - Execute the Cloud Run deployment command:
     ```bash
     gcloud run deploy codeforces --source . --region us-central1 --allow-unauthenticated
     ```

3. **Confirm & Report Live URL**:
   - Ensure the deployment succeeds without errors.
   - Report the live production URL to the user:
     [https://codeforces-519204329321.us-central1.run.app](https://codeforces-519204329321.us-central1.run.app)
