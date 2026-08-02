"""Set up or update the jewelry inventory app.

Place this file in an empty shop folder (or next to project/ and local_data/), then run:

    python updater.py

First launch (setup): only updater.py is required. You will be asked for your shop
username and password. The script downloads the licensed release, creates local_data/,
and installs the app into project/.

Later runs (update): compares license.json latest_version to the installed APP_VERSION.
If they differ and updates are enabled for the shop, downloads jewelry-inventory-{version}.zip.

When started via main.py, the app exits first so project/ files are not locked during update.

The updater is never included in release zips.
"""

from __future__ import annotations

import argparse
import getpass
import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import urllib.error
import urllib.request
import zipfile
from pathlib import Path

APP_ID = "jewelry-inventory"
LICENSE_JSON_URL = "https://casperschepkens.com/jewelry_software/license.json"
SOFTWARE_BASE_URL = "https://casperschepkens.com/jewelry_software"
LICENSE_TIMEOUT_SECONDS = 10
LICENSE_SSL_VERIFY = True

VERSION_PATTERN = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")
SETTINGS_VERSION_PATTERN = re.compile(
    r'^APP_VERSION\s*=\s*["\']([^"\']+)["\']',
    re.MULTILINE,
)

LOCAL_DATA_README = """Your local data folder. Do not delete.

jewelry.db          Your inventory database
session.json        Login session (created after sign-in)
assets/images/      Product photos
assets/thumbs/      Thumbnails (auto-generated)
assets/images_to_add/   Staging folder for new photos
assets/phone_upload/    Temporary phone uploads

This folder is never replaced by software updates.
"""


def _shop_root() -> Path:
    return Path(__file__).resolve().parent


def _local_data_dir(root: Path) -> Path:
    return root / "local_data"


def _project_dir(root: Path) -> Path:
    return root / "project"


def _session_path(root: Path) -> Path:
    return _local_data_dir(root) / "session.json"


def _settings_path(root: Path) -> Path:
    return _project_dir(root) / "config" / "settings.py"


def validate_version(version: str) -> str:
    cleaned = version.strip()
    if not VERSION_PATTERN.fullmatch(cleaned):
        raise ValueError(f"Invalid version: {cleaned!r}")
    return cleaned


def compare_versions(left: str, right: str) -> int:
    left_parts = [int(part) for part in validate_version(left).split(".")]
    right_parts = [int(part) for part in validate_version(right).split(".")]
    if left_parts > right_parts:
        return 1
    if left_parts < right_parts:
        return -1
    return 0


def is_app_installed(root: Path) -> bool:
    project_dir = _project_dir(root)
    return _settings_path(root).is_file() and (project_dir / "main.py").is_file()


def read_installed_version(root: Path) -> str | None:
    if not is_app_installed(root):
        return None
    content = _settings_path(root).read_text(encoding="utf-8")
    match = SETTINGS_VERSION_PATTERN.search(content)
    if not match:
        raise ValueError(f"APP_VERSION not found in {_settings_path(root)}")
    return match.group(1)


def _try_load_session(root: Path) -> dict[str, str] | None:
    session_path = _session_path(root)
    if not session_path.is_file():
        return None
    try:
        data = json.loads(session_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    if not isinstance(data, dict):
        return None
    shop_id = str(data.get("shop_id", "") or "").strip()
    if not shop_id:
        return None
    return {
        "shop_id": shop_id,
        "display_name": str(data.get("display_name", "") or shop_id).strip(),
    }


def _iter_shops(data: dict) -> list[tuple[str, dict]]:
    shops: list[tuple[str, dict]] = []
    for key in ("shops", "apps"):
        raw = data.get(key)
        if isinstance(raw, dict):
            for shop_id, entry in raw.items():
                if isinstance(entry, dict):
                    shops.append((shop_id, entry))
    return shops


def _authenticate(
    data: dict,
    username: str,
    password: str,
) -> dict[str, str] | None:
    username = username.strip()
    password = password.strip()
    if not username or not password:
        return None
    for shop_id, entry in _iter_shops(data):
        if (
            str(entry.get("username", "")) == username
            and str(entry.get("password", "")) == password
        ):
            display_name = str(entry.get("display_name", "") or shop_id).strip()
            return {
                "shop_id": shop_id,
                "display_name": display_name or shop_id,
            }
    return None


def _prompt_credentials() -> tuple[str, str]:
    print("Sign in with your shop account (from your license).")
    username = input("Username: ").strip()
    password = getpass.getpass("Password: ")
    return username, password


def _resolve_shop(
    root: Path,
    license_data: dict,
    *,
    username: str | None,
    password: str | None,
) -> dict[str, str] | None:
    session = _try_load_session(root)
    if session is not None:
        return session

    if username and password:
        return _authenticate(license_data, username, password)

    if sys.stdin.isatty():
        user, pwd = _prompt_credentials()
        return _authenticate(license_data, user, pwd)

    print(
        "No session.json found. Sign in to the app once, or run interactively, "
        "or pass --username and --password.",
        file=sys.stderr,
    )
    return None


def _is_ssl_verification_error(exc: urllib.error.URLError) -> bool:
    reason = exc.reason
    if isinstance(reason, ssl.SSLError):
        return True
    message = str(reason).lower()
    return "certificate verify failed" in message or "ssl" in message


def _open_url(request: urllib.request.Request, verify_ssl: bool):
    if verify_ssl:
        return urllib.request.urlopen(request, timeout=LICENSE_TIMEOUT_SECONDS)
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    return urllib.request.urlopen(request, timeout=LICENSE_TIMEOUT_SECONDS, context=context)


def _read_url(url: str, user_agent: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": user_agent})
    try:
        with _open_url(request, verify_ssl=LICENSE_SSL_VERIFY) as response:
            return response.read().decode("utf-8")
    except urllib.error.URLError as exc:
        if LICENSE_SSL_VERIFY and _is_ssl_verification_error(exc):
            with _open_url(request, verify_ssl=False) as response:
                return response.read().decode("utf-8")
        raise


def _load_license_json(license_url: str, license_path: Path | None, user_agent: str) -> dict:
    if license_path is not None:
        if not license_path.is_file():
            raise FileNotFoundError(f"License file not found: {license_path}")
        payload = license_path.read_text(encoding="utf-8").lstrip("\ufeff")
    else:
        payload = _read_url(license_url, user_agent)

    data = json.loads(payload.lstrip("\ufeff"))
    if not isinstance(data, dict):
        raise ValueError("License JSON root must be an object.")
    return data


def _shop_entry(data: dict, shop_id: str) -> dict | None:
    for key in ("shops", "apps"):
        raw = data.get(key)
        if isinstance(raw, dict):
            entry = raw.get(shop_id)
            if isinstance(entry, dict):
                return entry
    return None


def _latest_version(license_data: dict) -> str:
    return str(license_data.get("latest_version", "") or "").strip()


def _release_zip_name(version: str) -> str:
    return f"{APP_ID}-{validate_version(version)}.zip"


def _release_zip_url(version: str, base_url: str = SOFTWARE_BASE_URL) -> str:
    return f"{base_url.rstrip('/')}/{_release_zip_name(version)}"


def _download_file(url: str, destination: Path, user_agent: str) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": user_agent})
    try:
        with _open_url(request, verify_ssl=LICENSE_SSL_VERIFY) as response:
            destination.write_bytes(response.read())
    except urllib.error.URLError as exc:
        if LICENSE_SSL_VERIFY and _is_ssl_verification_error(exc):
            with _open_url(request, verify_ssl=False) as response:
                destination.write_bytes(response.read())
        else:
            raise


def _clear_directory(path: Path) -> None:
    if not path.exists():
        path.mkdir(parents=True, exist_ok=True)
        return
    for item in path.iterdir():
        if item.is_dir():
            shutil.rmtree(item)
        else:
            item.unlink()


def _safe_extract(archive: zipfile.ZipFile, destination: Path) -> None:
    destination = destination.resolve()
    for member in archive.namelist():
        target = (destination / member).resolve()
        if not str(target).startswith(str(destination)):
            raise RuntimeError(f"Unsafe path in zip archive: {member}")
    archive.extractall(destination)


def _ensure_local_data_layout(root: Path) -> None:
    local_data = _local_data_dir(root)
    asset_dirs = (
        local_data / "assets" / "images",
        local_data / "assets" / "thumbs",
        local_data / "assets" / "images_to_add",
        local_data / "assets" / "phone_upload",
    )
    for path in (local_data, *asset_dirs):
        path.mkdir(parents=True, exist_ok=True)

    readme = local_data / "README.txt"
    if not readme.is_file():
        readme.write_text(LOCAL_DATA_README, encoding="utf-8")


def _requirements_path(root: Path) -> Path:
    return _project_dir(root) / "requirements.txt"


def _install_requirements(root: Path) -> int:
    requirements = _requirements_path(root)
    if not requirements.is_file():
        return 0

    print("Installing Python packages ...")
    result = subprocess.run(
        [sys.executable, "-m", "pip", "install", "-r", str(requirements)],
        cwd=str(_project_dir(root)),
    )
    if result.returncode != 0:
        print(
            "Could not install required packages. "
            f"Run manually: python -m pip install -r {requirements}",
            file=sys.stderr,
        )
    return result.returncode


def _apply_release(root: Path, zip_path: Path, *, setup: bool) -> None:
    project_dir = _project_dir(root)
    project_dir.mkdir(parents=True, exist_ok=True)

    if setup:
        print(f"Preparing {project_dir} ...")
    else:
        print(f"Clearing {project_dir} ...")
    _clear_directory(project_dir)

    print(f"Extracting {zip_path.name} into {project_dir} ...")
    with zipfile.ZipFile(zip_path, "r") as archive:
        _safe_extract(archive, project_dir)

    print(f"Removing {zip_path.name} ...")
    zip_path.unlink()


def _install_release(
    root: Path,
    target_version: str,
    user_agent: str,
    *,
    dry_run: bool,
    setup: bool,
    software_base_url: str,
) -> tuple[int, bool]:
    zip_name = _release_zip_name(target_version)
    zip_path = root / zip_name
    zip_url = _release_zip_url(target_version, software_base_url)

    if dry_run:
        print("Dry run: no files were changed.")
        return 0, False

    if zip_path.exists():
        zip_path.unlink()

    try:
        print(f"Downloading {zip_name} ...")
        _download_file(zip_url, zip_path, user_agent)
    except urllib.error.HTTPError as exc:
        print(
            f"Could not download release (HTTP {exc.code}). "
            f"Make sure {zip_name} is uploaded to the license server.",
            file=sys.stderr,
        )
        if zip_path.exists():
            zip_path.unlink()
        return 1, False
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        print(f"Could not download release: {exc}", file=sys.stderr)
        if zip_path.exists():
            zip_path.unlink()
        return 1, False

    try:
        _ensure_local_data_layout(root)
        _apply_release(root, zip_path, setup=setup)
    except (OSError, zipfile.BadZipFile, RuntimeError) as exc:
        print(f"Install failed: {exc}", file=sys.stderr)
        if zip_path.exists():
            zip_path.unlink()
        return 1, False

    deps_code = _install_requirements(root)
    if deps_code != 0:
        return deps_code, False

    try:
        new_version = read_installed_version(root)
    except (OSError, ValueError) as exc:
        print(f"Files installed but version check failed: {exc}", file=sys.stderr)
        return 1, False

    if setup:
        print(f"Setup complete. Installed version v{new_version}.")
        print("Start the app with: cd project && python main.py")
        print("Then sign in with the same username and password.")
    else:
        print(f"Update complete. Installed version is now v{new_version}.")
    return 0, True


def run_update(
    *,
    dry_run: bool = False,
    license_url: str = LICENSE_JSON_URL,
    license_path: Path | None = None,
    username: str | None = None,
    password: str | None = None,
    software_base_url: str = SOFTWARE_BASE_URL,
    auto_start: bool = False,
) -> int:
    root = _shop_root()
    setup_mode = not is_app_installed(root)

    try:
        installed_version = read_installed_version(root)
    except (OSError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 0 if auto_start else 1

    version_label = installed_version or "not installed"
    user_agent = f"{APP_ID}-updater/{version_label}"

    try:
        license_data = _load_license_json(license_url, license_path, user_agent)
    except urllib.error.HTTPError as exc:
        message = f"Could not load license file (HTTP {exc.code})."
        if auto_start:
            print(f"Update check skipped: {message}", file=sys.stderr)
            return 0
        print(message, file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, ValueError, OSError) as exc:
        message = f"Could not load license file: {exc}"
        if auto_start:
            print(f"Update check skipped: {message}", file=sys.stderr)
            return 0
        print(message, file=sys.stderr)
        return 1

    latest_version = _latest_version(license_data)
    if not latest_version:
        message = "License has no latest_version set."
        if auto_start:
            print(f"Update check skipped: {message}", file=sys.stderr)
            return 0
        print(message, file=sys.stderr)
        return 1

    try:
        validate_version(latest_version)
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 0 if auto_start else 1

    shop = _resolve_shop(root, license_data, username=username, password=password)
    if shop is None:
        if auto_start and not setup_mode:
            print("Update check skipped: no saved session.", file=sys.stderr)
            return 0
        print("Invalid username or password.", file=sys.stderr)
        return 1

    entry = _shop_entry(license_data, shop["shop_id"])
    if entry is None:
        message = f'No license entry found for shop "{shop["shop_id"]}".'
        if auto_start:
            print(f"Update check skipped: {message}", file=sys.stderr)
            return 0
        print(message, file=sys.stderr)
        return 1

    app_enabled = bool(entry.get("app_enabled", False))
    updates_enabled = bool(entry.get("updates_enabled", False))

    print(f"Shop: {shop['display_name']} ({shop['shop_id']})")
    print(f"Latest version: v{latest_version}")

    if setup_mode:
        print("Mode: first-time setup")
    else:
        print(f"Mode: update (installed v{installed_version})")

    if not app_enabled:
        message = "License not valid. Contact Casper."
        print(message, file=sys.stderr)
        return 1

    if setup_mode:
        if not dry_run:
            _ensure_local_data_layout(root)
        print(f"Will install v{latest_version} into project/")
        print(f"Download: {_release_zip_url(latest_version, software_base_url)}")
        exit_code, _ = _install_release(
            root,
            latest_version,
            user_agent,
            dry_run=dry_run,
            setup=True,
            software_base_url=software_base_url,
        )
        return exit_code

    assert installed_version is not None
    print(f"Installed version: v{installed_version}")

    if compare_versions(latest_version, installed_version) == 0:
        print("Already up to date.")
        if not dry_run:
            return _install_requirements(root)
        return 0

    if not updates_enabled:
        message = "A newer version is available but updates are disabled for this account."
        if auto_start:
            print(f"Update skipped: {message}", file=sys.stderr)
            return 0
        print(message)
        return 0

    print(f"Update available: v{installed_version} -> v{latest_version}")
    print(f"Download: {_release_zip_url(latest_version, software_base_url)}")

    exit_code, _ = _install_release(
        root,
        latest_version,
        user_agent,
        dry_run=dry_run,
        setup=False,
        software_base_url=software_base_url,
    )
    return exit_code


def run_update_and_start(
    main_script: Path,
    main_args: list[str],
    *,
    license_url: str = LICENSE_JSON_URL,
    license_path: Path | None = None,
    software_base_url: str = SOFTWARE_BASE_URL,
) -> int:
    exit_code = run_update(
        license_url=license_url,
        license_path=license_path,
        software_base_url=software_base_url,
        auto_start=True,
    )
    if exit_code != 0:
        return exit_code

    deps_code = _install_requirements(_shop_root())
    if deps_code != 0:
        return deps_code

    env = os.environ.copy()
    env["JEWELRY_SKIP_UPDATE_BOOTSTRAP"] = "1"
    completed = subprocess.run(
        [sys.executable, str(main_script), *main_args],
        env=env,
    )
    return completed.returncode


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Set up or update the jewelry inventory app."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would happen without downloading or changing files.",
    )
    parser.add_argument(
        "--license-url",
        default=LICENSE_JSON_URL,
        help=f"License JSON URL (default: {LICENSE_JSON_URL}).",
    )
    parser.add_argument(
        "--license-path",
        type=Path,
        default=None,
        help="Use a local license.json instead of downloading from the web.",
    )
    parser.add_argument(
        "--username",
        default=None,
        help="Shop username (optional; prompts if missing and no session.json).",
    )
    parser.add_argument(
        "--password",
        default=None,
        help="Shop password (optional; use with --username).",
    )
    parser.add_argument(
        "--software-base-url",
        default=SOFTWARE_BASE_URL,
        help=f"Base URL for release zips (default: {SOFTWARE_BASE_URL}).",
    )
    parser.add_argument(
        "--update-and-start",
        metavar="MAIN_SCRIPT",
        type=Path,
        default=None,
        help="Check for updates, then start MAIN_SCRIPT (used by main.py bootstrap).",
    )
    args, main_args = parser.parse_known_args()

    license_path = args.license_path
    if license_path is None:
        env_path = os.environ.get("JEWELRY_LICENSE_PATH", "").strip()
        if env_path:
            license_path = Path(env_path)

    if args.update_and_start is not None:
        sys.exit(
            run_update_and_start(
                args.update_and_start,
                main_args,
                license_url=args.license_url,
                license_path=license_path,
                software_base_url=args.software_base_url,
            )
        )

    sys.exit(
        run_update(
            dry_run=args.dry_run,
            license_url=args.license_url,
            license_path=license_path,
            username=args.username,
            password=args.password,
            software_base_url=args.software_base_url,
        )
    )


if __name__ == "__main__":
    main()
