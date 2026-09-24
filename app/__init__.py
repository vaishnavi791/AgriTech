import pathlib, sys
# Resolve the backend app directory relative to this file (which lives in the top‑level `app` package).
_backend_path = pathlib.Path(__file__).resolve().parent.parent / 'backend' / 'app'
if _backend_path.is_dir():
    sys.path.insert(0, str(_backend_path))
# Extend this package's __path__ so submodules like `app.core` resolve to the backend implementation.
__path__.append(str(_backend_path))

