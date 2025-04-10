#!/bin/bash
set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if kubeseal is installed
if ! command -v kubeseal &> /dev/null; then
    echo "kubeseal is not installed. Please install it first."
    echo "On macOS: brew install kubeseal"
    echo "On Linux: follow installation instructions from the kubeseal documentation"
    exit 1
fi

# Check if raw-secrets directory exists
if [ ! -d "${SCRIPT_DIR}/raw-secrets" ]; then
    echo "Error: raw-secrets directory does not exist in ${SCRIPT_DIR}"
    echo "Please create it and add your secret files first."
    exit 1
fi

# Create secrets directory if it doesn't exist
mkdir -p "${SCRIPT_DIR}/secrets"

# Process all files in raw-secrets directory
for input_file in "${SCRIPT_DIR}/raw-secrets"/*; do
    # Skip if not a file
    [ -f "$input_file" ] || continue
    
    # Get the base filename
    filename=$(basename "$input_file")
    # Create output filename in secrets directory
    output_file="${SCRIPT_DIR}/secrets/sealed-${filename}"
    
    echo "Creating sealed secret for $filename..."
    
    # Create sealed secret
    kubeseal --format yaml --scope namespace-wide < "$input_file" > "$output_file"
    
    echo "✅ Sealed secret created: $output_file"
done
