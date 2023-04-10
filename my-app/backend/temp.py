#importing necessary libraries
import os
import re
import sys
import json

import networkx as nx
import matplotlib.pyplot as plt

# Define the graph
G = nx.DiGraph()

# Regular expressions to identify #include statements, find_package statements, and target_link_libraries statements
library_regex = r'#include\s*(?:<(.+?)>|\"(.+?)\")'
find_package_regex = r'find_package\s*\(\s*([^\s\)]+)'
link_regex = r'target_link_libraries\((.*)\)'

# Checking if a project directory is specified as a command-line argument
if len(sys.argv) < 2:
    print("Usage: python analyze_code.py <project_directory>")
    sys.exit(1)
project_directory = sys.argv[1]   # Get the path to the project directory

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
                dependencies = set()
                for match in library_names:
                    for lib_name in match:
                        if lib_name:
                            libraries.add(lib_name)
                            dependencies.add(lib_name)
                G.add_node(file)
                # Add edges between the file and its dependencies
                for dependency in dependencies:
                    G.add_edge(file, dependency)
        # Process CMakeLists.txt files
        else:
            cmake_file_path = os.path.join(root, file)
            with open(cmake_file_path, "r") as f:
                content = f.read() # Reads the contents of the file
                find_package_statements = re.findall(find_package_regex, content) # Finds all find_package statements in the file
                link_names = re.findall(link_regex, content)
                package_names.update(find_package_statements)  # Add any package names to the set of required packages
                # Loops through the matches and add any library names to the set of target-link-libraries
                for match in link_names:
                    for lib_name in match.split():
                        if lib_name:
                            link_lib.add(lib_name)
                            G.add_node(lib_name)
                            # Add edges between the package and its required libraries
                            for package_name in package_names:
                                G.add_edge(package_name, lib_name)

# Write the identified libraries, required packages, and target-link-libraries to a JSON file
output_file = "observations.json"
data = {"identified_header_libraries": list(libraries),
        "required_packages": list(package_names),
        "target_link_libraries": list(filter(lambda lib: lib not in package_names, link_lib))}

# Draw the graph
pos = nx.spring_layout(G,seed=42)
nx.draw(G, pos, with_labels=True, font_size=10, font_weight='bold', node_color='lightblue', node_size=500, edge_color='gray')

# Save the graph
output_file = "graph.png"
plt.savefig(output_file)
plt.show()
with open(output_file, "w") as f:
    json.dump(data, f, indent=4)

# Print the path to the output file
print(f"Results written to {output_file}")