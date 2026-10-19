# Always Deploy Online Rule

Whenever any code changes, bug fixes, UI adjustments, or new features are implemented, tested, and verified:

1. **Commit and Push to GitHub**:
   - `git add .`
   - `git commit -m "..."`
   - `git push origin main`

2. **Deploy Live Online to Google Cloud Run**:
   - `gcloud run deploy codeforces --source . --region us-central1 --allow-unauthenticated`

3. **Confirm & Report Live URL**:
   - Verify deployment success and share the live URL:
     https://codeforces-519204329321.us-central1.run.app
