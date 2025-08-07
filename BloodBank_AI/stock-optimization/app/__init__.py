"""Package initializer for the blood inventory optimization app.

This package contains the FastAPI application for optimizing blood bank
inventory. It exposes models, configuration utilities, optimization logic,
and the API routes defined in `main.py`.
"""

__all__ = [
    "models",
    "config",
    "optimizer",
    "main",
]