"""Check that the APK contains the exact offline game and all art assets."""
import hashlib
import sys
import zipfile
from pathlib import Path

with zipfile.ZipFile(sys.argv[1]) as apk:
    assert apk.testzip() is None, 'Corrupt ZIP member'
    for required in ('AndroidManifest.xml', 'classes.dex', 'resources.arsc'):
        assert required in apk.namelist(), f'Missing {required}'
    for source in [Path('index.html'), *sorted(Path('assets').glob('*.webp'))]:
        entry = 'assets/game/' + source.as_posix()
        assert apk.read(entry) == source.read_bytes(), f'Bundled asset differs: {entry}'
    assert len(list(Path('assets').glob('*.webp'))) == 6
    assert not any(n.startswith('lib/') for n in apk.namelist()), 'Unexpected ABI-specific code'
print('Verified: manifest, DEX and all six offline art assets match the source.')
print('SHA-256:', hashlib.sha256(Path(sys.argv[1]).read_bytes()).hexdigest())
