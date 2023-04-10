import os
import re
import sys
import json
import tkinter as tk
from tkinter import ttk
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
import networkx as nx

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
                for match in library_names:
                    for lib_name in match:
                        if lib_name:
                            libraries.add(lib_name)
                            G.add_node(lib_name)
                            G.add_node(file)
                            G.add_edge(file,lib_name)
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

# Create a Tkinter window
root = tk.Tk()
root.title("Graph")

# Create a Matplotlib figure and add it to the Tkinter window
fig = Figure(figsize=(8, 6), dpi=100)
ax = fig.add_subplot(111)
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=1)

# Draw the graph using the draw_networkx function
pos = nx.spring_layout(G, seed=42)
nx.draw_networkx(G, pos, ax=ax, with_labels=True, font_size=10, font_weight='bold', node_color='lightblue', node_size=500, edge_color='gray')

# Create a dictionary to store the positions of the nodes
node_pos = {}

# Function to update the positions of the nodes in the dictionary
def update_node_pos(event):
    for node in G.nodes():
        node_pos[node] = (pos[node][0], pos[node][1])

    # Bind the mouse events to update the positions of the nodes in the dictionary
    canvas.mpl_connect('button_press_event', update_node_pos)
    canvas.mpl_connect('motion_notify_event', update_node_pos)
    canvas.mpl_connect('button_release_event', update_node_pos)

def save_graph():
# Create a dictionary to store the graph data
    graph_data = {}
    graph_data["nodes"] = []
    graph_data["edges"] = []

# Loop through each node in the graph and add it to the dictionary
    for node in G.nodes():
        node_data = {}
        node_data["id"] = node
        node_data["x"] = node_pos[node][0]
        node_data["y"] = node_pos[node][1]
        graph_data["nodes"].append(node_data)

    # Loop through each edge in the graph and add it to the dictionary
    for edge in G.edges():
        edge_data = {}
        edge_data["source"] = edge[0]
        edge_data["target"] = edge[1]
        graph_data["edges"].append(edge_data)

# Save the [graph data](poe://www.poe.com/_api/key_phrase?phrase=graph%20data&prompt=Tell%20me%20more%20about%20graph%20data.) as a JSON file
    with open("graph.json", "w") as f:
        json.dump(graph_data, f)
#Create a button to save the graph
save_button = ttk.Button(root, text="Save Graph", command=save_graph)
save_button.pack(side=tk.BOTTOM)

#Run the Tkinter main loop
tk.mainloop()