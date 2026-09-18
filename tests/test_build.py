import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile


ROOT = Path(__file__).resolve().parents[1]


class BuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        shutil.copy2(ROOT / "build.py", self.root)
        shutil.copytree(ROOT / "src", self.root / "src")
        self.originals = {}
        for target in ("firefox", "chrome"):
            name = f"manifest.{target}.json"
            shutil.copy2(ROOT / name, self.root / name)
            self.originals[name] = (self.root / name).read_bytes()

    def run_build(self, *args):
        return subprocess.run(
            [sys.executable, str(self.root / "build.py"), *args],
            capture_output=True, text=True,
        )

    def check_package(self, target, version):
        suffix = "xpi" if target == "firefox" else "zip"
        path = self.root / "dist" / f"enter-newline-for-ai-{version}-{target}.{suffix}"
        expected = json.loads(self.originals[f"manifest.{target}.json"])
        expected["version"] = version
        with zipfile.ZipFile(path) as archive:
            self.assertIsNone(archive.testzip())
            self.assertEqual(json.loads(archive.read("manifest.json")), expected)
            for source in (self.root / "src").iterdir():
                self.assertEqual(archive.read(source.name), source.read_bytes())
        staged = self.root / "dist" / target / "manifest.json"
        self.assertEqual(json.loads(staged.read_text(encoding="utf-8")), expected)
        for name, original in self.originals.items():
            self.assertEqual((self.root / name).read_bytes(), original)

    def test_override_both_browsers_and_repeat_build(self):
        for _ in range(2):
            result = self.run_build("--version", "1.2.3")
            self.assertEqual(result.returncode, 0, result.stderr)
            for target in ("firefox", "chrome"):
                self.check_package(target, "1.2.3")

    def test_default_versions(self):
        result = self.run_build()
        self.assertEqual(result.returncode, 0, result.stderr)
        for target in ("firefox", "chrome"):
            self.check_package(target, json.loads(self.originals[f"manifest.{target}.json"])["version"])

    def test_single_target(self):
        result = self.run_build("chrome", "--version", "2.3.4")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.check_package("chrome", "2.3.4")
        self.assertFalse((self.root / "dist" / "firefox").exists())

    def test_invalid_versions_do_not_build(self):
        for version in ("v1.2.3", "1.2", "01.2.3", "1.2.3-beta", "0.0.0", "65536.0.0", "../1.2.3"):
            with self.subTest(version=version):
                self.assertNotEqual(self.run_build("--version", version).returncode, 0)
                self.assertFalse((self.root / "dist").exists())

    def test_unknown_target_does_not_partially_build(self):
        self.assertNotEqual(self.run_build("firefox", "unknown").returncode, 0)
        self.assertFalse((self.root / "dist").exists())


if __name__ == "__main__":
    unittest.main()
