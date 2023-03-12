import os
import re
import sys
import json

library_regex = r'#include\s*(?:<(.+?)>|\"(.+?)\")'
find_package_regex = r'find_package\s*\(\s*([^\s\)]+)'
link_regex = r'target_link_libraries\((.*)\)'

# Get the path to the project directory
if len(sys.argv) < 2:
    print("Usage: python analyze_code.py <project_directory>")
    sys.exit(1)
project_directory = sys.argv[1]

# Define sets to store the names of the identified libraries and packages
libraries = set()
package_names = set()
link_lib=set()

# Loop through each file in the project directory and its subdirectories
for root, dirs, files in os.walk(project_directory):
    for file in files:
        # Ignore files that are not C++ source code files or CMakeLists.txt files
        if not file.endswith(".cpp") and not file.endswith(".cc") and not file.endswith(".cxx") and not file.endswith(".h") and not file.endswith(".hpp") and not file.endswith(".hh") and not file.endswith(".hxx") and not file.endswith(".cu") and not file.endswith(".cuh") and file != "CMakeLists.txt":
            continue

        # Process C++ source code files
        if file.endswith(".cpp") or file.endswith(".cc") or file.endswith(".cxx") or file.endswith(".cu") or file.endswith(".h") or file.endswith(".hpp") or file.endswith(".hh") or file.endswith(".hxx") or file.endswith(".cuh"):
            with open(os.path.join(root, file), "r") as f:
                content = f.read()
                library_names = re.findall(library_regex, content)
                for match in library_names:
                    for lib_name in match:
                        if lib_name:
                            libraries.add(lib_name)
        # Process CMakeLists.txt files
        else:
            cmake_file_path = os.path.join(root, file)
            with open(cmake_file_path, "r") as f:
                content = f.read()
                find_package_statements = re.findall(find_package_regex, content)
                link_names = re.findall(link_regex, content)
                package_names.update(find_package_statements)
                for match in link_names:
                    for lib_name in match.split():
                        if lib_name:
                            link_lib.add(lib_name)

# Write the identified libraries, required packages, and target-link-libraries to a JSON file
output_file = "observations.json"
data = {"identified_header_libraries": list(libraries),
        "required_packages": list(package_names),
        "target_link_libraries": list(filter(lambda lib: lib not in package_names, link_lib))}

with open(output_file, "w") as f:
    json.dump(data, f, indent=4)

# Print the path to the output file
print(f"Results written to {output_file}")
