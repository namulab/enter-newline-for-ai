#!/usr/bin/env python3
from pathlib import Path
import argparse
import json
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"

def parse_version(value):
    if not re.fullmatch(r"(0|[1-9][0-9]{0,4})\.(0|[1-9][0-9]{0,4})\.(0|[1-9][0-9]{0,4})", value):
        raise argparse.ArgumentTypeError("version must use the format 1.2.3 (without v)")
    parts = [int(part) for part in value.split(".")]
    if max(parts) > 65535 or not any(parts):
        raise argparse.ArgumentTypeError("version components must be 0..65535 and not all zero")
    return value


def build(target, version=None):
    manifest_path = ROOT / f"manifest.{target}.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    version = version if version is not None else manifest["version"]
    outdir = DIST / target
    if outdir.exists(): shutil.rmtree(outdir)
    outdir.mkdir(parents=True)
    for p in SRC.iterdir():
        if p.is_file(): shutil.copy2(p, outdir / p.name)
    shutil.copytree(ROOT / "icon", outdir / "icon")
    shutil.copy2(manifest_path, outdir / "manifest.json")
    # Only rewrite the staging copy; keep the source manifest untouched.
    manifest["version"] = version
    (outdir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    suffix = "xpi" if target == "firefox" else "zip"
    archive = DIST / f"enter-newline-for-ai-{version}-{target}.{suffix}"
    if archive.exists(): archive.unlink()
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(outdir.rglob("*")):
            if p.is_file(): z.write(p, p.relative_to(outdir))
    print(archive)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build Firefox and Chrome extension packages.")
    parser.add_argument("targets", nargs="*", help="firefox and/or chrome (default: both)")
    parser.add_argument("--version", type=parse_version, help="override the manifest version, e.g. 1.2.3")
    args = parser.parse_args()
    targets = args.targets or ["firefox", "chrome"]
    for target in targets:
        if target not in {"firefox", "chrome"}:
            parser.error(f"unknown target: {target}")
    for t in targets:
        build(t, args.version)
