This folder should contain the brand assets used in emails.

- `logo.base64.txt` contains a base64-encoded PNG used as a placeholder. Replace with your real logo base64 or overwrite with a binary file and update `emailService.js` accordingly.

To generate base64 for a PNG on macOS / Linux:

```bash
base64 -w0 logo.png > logo.base64.txt
```

On Windows (PowerShell):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('logo.png')) | Out-File -Encoding ascii logo.base64.txt
```
