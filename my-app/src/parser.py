import os
import re


library_regex = r'#include\s+(?:<(.+?)>|\"(.+?)\")'
find_package_regex = r'find_package\s*\(\s*([^\s\)]+)'
link_regex = r'target_link_libraries\((.*)\)'

# Define the path to the project's source code directory
project_path = "/home/user/Documents/CppND-Route-Planning-Project-master/src"
cmake_file_path = "/home/user/Documents/CppND-Route-Planning-Project-master/CMakeLists.txt"

# Define a set to store the names of the identified libraries
libraries = set()

# Loop through each file in the project's source code directory
for root, dirs, files in os.walk(project_path):
    for file in files:
        #print()
        print(file)
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
           
# Print the set of identified libraries
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

package_names = set()
# Open the file and search for find_package statements and package names
with open(cmake_file_path, "r") as f:
    content = f.read()
    find_package_statements = re.findall(find_package_regex, content)
    link_names = re.findall(link_regex,content)
    package_names.update(find_package_statements)

#output_file = "observations.txt"
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