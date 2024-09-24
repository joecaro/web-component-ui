#!/bin/sh

set -e

# Specify the components directory to build
components_dir="src/components"
build_dir="_pages/components"

echo "Cleaning up potential old build files..."
rm -rf $build_dir || true;

# Build and bundle all the component files with Parcel
echo "Bundling components with Parcel..."
npx parcel build $components_dir/**/*.ts --no-autoinstall --no-source-maps --no-cache --dist-dir $build_dir

echo "Build and bundle completed. Files moved to $build_dir."