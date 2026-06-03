# NativeMessagingFirefoxClicker

Firefox WebExtension plus a Python native messaging host that can receive click coordinates from the extension and perform the click on Windows using `pyautogui`.

## Project layout

```text
FirefoxExtension/
  manifest.json              Firefox extension manifest
  background.js              Connects to the native host
  skipper.js                 Sends click messages to the background script

NativeHostClicker/
  NativeHostClicker.json     Firefox native messaging host manifest
  NativeHostClicker.bat      Windows launcher for the Python host
  NativeHostClicker.py       Native host implementation
```

## Windows install

### 1. Install Python

Install Python 3 for Windows from the Microsoft store (run python without arguments from terminal) or from <https://www.python.org/downloads/windows/>.

During install, enable **Add python.exe to PATH**.

Open PowerShell or Command Prompt and verify Python is available:

```bat
python --version
```

Install the native host dependency:

```bat
python -m pip install pyautogui
```

### 2. Choose an install folder

Copy or keep this project in a stable folder, for example:

```text
C:\Tools\NativeMessagingFirefoxClicker
```

The folder should contain both `FirefoxExtension` and `NativeHostClicker`.

### 3. Update the native host paths

Edit `NativeHostClicker\NativeHostClicker.json` and replace `<install_path>` with the full path to this project folder.

Example:

```json
{
  "name": "NativeHostClicker",
  "description": "host for native messaging",
  "path": "C:\\Tools\\NativeMessagingFirefoxClicker\\NativeHostClicker\\NativeHostClicker.bat",
  "type": "stdio",
  "allowed_extensions": [ "example@rex.com" ]
}
```

Edit `FirefoxExtension\manifest.json` and replace `<certain_site>` with a hopefully obvious sitename beginning with y.

The batch file is self-locating and should not need path edits. It runs `NativeHostClicker.py` from the same folder:

```bat
@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PYTHON_CMD=python"
```

### 4. Register the native messaging host

Firefox finds native messaging hosts through the Windows Registry.

Open PowerShell or Command Prompt and run this command, replacing the path with your actual project folder:

```bat
reg add HKCU\Software\Mozilla\NativeMessagingHosts\NativeHostClicker /ve /t REG_SZ /d "C:\Tools\NativeMessagingFirefoxClicker\NativeHostClicker\NativeHostClicker.json" /f
```

This registers the host for the current Windows user only. To register for all users, use `HKLM` instead of `HKCU` from an elevated Administrator shell.

### 5. Install or load the Firefox extension

For local development:

1. Open Firefox.
2. Go to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Select `FirefoxExtension\manifest.json`.

Firefox will load the extension until the browser is restarted.

For a persistent install, package and sign the extension through Mozilla Add-ons. The native host manifest currently allows only this extension ID:

```text
example@rex.com
```

If you change the extension ID in `FirefoxExtension\manifest.json`, update `allowed_extensions` in `NativeHostClicker\NativeHostClicker.json` to match.

## Verify the install

After loading the extension:

1. Open the Firefox Browser Console.
2. Look for `Connecting to NativeHostClicker`.
3. If native messaging fails, Firefox should log a connection error from `background.js`.

You can also test the Python dependency directly:

```bat
python -c "import pyautogui; print('pyautogui ok')"
```

## Troubleshooting

- **pyautogui fails to install**: pip can be flaky; update with `python -m pip install --upgrade pip` and re-run `python -m pip install pyautogui` until success.
- **Firefox cannot find the native host**: confirm the registry default value points to the full path of `NativeHostClicker.json`.
- **Firefox cannot start the host**: confirm `NativeHostClicker.json` points to the full path of `NativeHostClicker.bat`.
- **`Attempt to postMessage on disconnected port`**: the native host disconnected before the extension sent a message. Check the Browser Console for the earlier native messaging error, then verify the registry path, the `.json` host path, the `.bat` Python command, and the extension ID in `allowed_extensions`.
- **`An unexpected error occurred` after sending to the native host**: the host started, received a message, then crashed or exited. Check `NativeHostClicker\NativeHostClicker.launcher.log`, `NativeHostClicker\NativeHostClicker.stderr.log`, and `NativeHostClicker\NativeHostClicker.log` for the Python error.
- **Python is not found**: the batch file tries `python` first, then `py`. If both fail, install Python and enable **Add python.exe to PATH**.
- **The extension connects but messages are rejected**: confirm `FirefoxExtension\manifest.json` has the same ID as `allowed_extensions` in `NativeHostClicker.json`.
- **Clicks do not occur**: confirm `pyautogui` is installed for the same Python interpreter used by `NativeHostClicker.bat`.

## Uninstall

Remove the Firefox native messaging host registry entry:

```bat
reg delete HKCU\Software\Mozilla\NativeMessagingHosts\NativeHostClicker /f
```

Then remove the temporary add-on from `about:debugging` or uninstall the extension from Firefox.
