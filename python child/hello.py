import tkinter as tk
from tkinter import filedialog
import sys

def file_picker(multiple=False):
    root = tk.Tk()
    root.withdraw()  # Hide the root window

    # If "multiple" is True, allow multiple file selection
    if multiple:
        file_paths = filedialog.askopenfilenames(title="Select files")
    else:
        file_paths = filedialog.askopenfilename(title="Select a file")
    
    # Print the result for Node.js to capture
    print("Selected files:", file_paths)
    sys.exit()  # Exit after picking files

if __name__ == "__main__":
    multiple = sys.argv[1] == "2"  # Pass "2" for multiple files, "1" for single file
    file_picker(multiple)
