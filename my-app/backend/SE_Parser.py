# importing necessary libraries
import os
import re
import sys

# Defining regular expressions to search for libraries & dependencies in code and CMakeLists.txt files
library_regex = r'#include\s*(?:<(.+?)>|\"(.+?)\")'
find_package_regex = r'find_package\s*\(\s*([^\s\)]+)'
link_regex = r'target_link_libraries\((.*)\)'

# Get the path to the project's source code directory and CMakeLists.txt file from command line arguments
if len(sys.argv) < 3:
    print("Usage: python analyze_code.py <project_path> <cmake_file_path>")
    sys.exit(1)
project_path = sys.argv[1]
cmake_file_path = sys.argv[2]

# Defining a set to store the names of the identified libraries
libraries = set()

# Looping through each file in the project's source code directory
for root, dirs, files in os.walk(project_path):
    for file in files:
        # Ignore files that are not C++ source code files
        if not file.endswith(".cpp") and not file.endswith(".h"):
            continue

        # Open the file and search for include statements and library linking flags
        with open(os.path.join(root, file), "r") as f:
            content = f.read()
            library_names = re.findall(library_regex, content)
            # Add the identified libraries to the set
            for match in library_names:
                for lib_name in match:
                    if lib_name:
                        libraries.add(lib_name)
           
# Printing the set of identified libraries to console and observations.txt file
print()
print("Identified header libraries:")
output_file = "observations.txt"
print()
with open(output_file, "w") as f:
    f.write("Identified header libraries:\n\n")
    for lib in libraries:
      f.write(lib + "\n")
      print(lib)
print(f"Identified libraries written to {output_file}")

# Defining a set to store the names of the required packages
package_names = set()
# Opening the CMakeLists.txt file and search for find_package statements and package names
with open(cmake_file_path, "r") as f:
    content = f.read()
    find_package_statements = re.findall(find_package_regex, content)
    link_names = re.findall(link_regex,content)
    package_names.update(find_package_statements)

#output_file = "observations.txt"

# prints the set of required packages to console and appends to the output file
print()
print("Required packages\n")
with open(output_file, "a") as f:
    f.write("\nThe following packages need to be installed:\n\n")
    for package_name in package_names:
        print(package_name)
        f.write(package_name + "\n")

# Print a confirmation message
print(f"Required package names written to {output_file}")

libraries = set()
for match in link_names:
        for lib_name in match.split():
            if lib_name:
                libraries.add(lib_name)

print()
print("Identified target-link-libraries:")
print()
with open(output_file, "a") as f:
    f.write("\n\ntarget-link-libraries:\n\n")
    for lib in libraries:
        f.write(lib + "\n")
        print(lib)


# Print a confirmation message
print(f"target-link-library names written to {output_file}")
