# Validation of this source snapshot

Prepared on 2026-10-22. Checks ran on Windows using existing local toolchains and installed dependencies, with imports directed at this exported copy. This is not a clean-room dependency-install test.

| Check | Result |
| --- | --- |
| framework-tests | failed |
| studio-build | passed |

The studio build passed. Framework tests: 339 passed, one failed. Known source inconsistency: content/stat-odds-design.json contains 104 evidence rules, while three framework/spec.json counters and a backstory-event test still expect 96. Probabilities, grants and frozen mechanics were preserved. Studio fixtures were extracted from generated HTML into small JSON inputs; private episodes and generated preview pages are excluded.

The repository contains selected main source, required small configuration/reference inputs and documentation. Installed dependencies, model weights, caches, private records and bulk research outputs are excluded. Reproduce the commands in README.md after installing the declared dependencies.
