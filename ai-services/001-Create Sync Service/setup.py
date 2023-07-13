from setuptools import setup

setup(
    name="service",
    version="0.0.1",
    packages=["service"],
    package_dir={"": "src"},
    install_requires=[
        "ipykernel==6.15.2",
        "black==22.8.0",
        "fastapi[all]",
        "uvicorn",
        "elasticsearch~=8.8.0"
    ],
)
