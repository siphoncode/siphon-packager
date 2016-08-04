#!/bin/bash
set -e
export TMPDIR=`mktemp -d -t packager-sim`
echo "Output dir: $TMPDIR"

echo "Generate header..."
./siphon-packager.py --header > $TMPDIR/header

echo "Generate footer..."
./siphon-packager.py --footer --project-path $1 > $TMPDIR/footer

echo "Run in simulator..."
(cd ../siphon-base && ./siphon-base --simulate --app-id app-id-123 --header $TMPDIR/header --footer $TMPDIR/footer)

rm -rf $TMPDIR
