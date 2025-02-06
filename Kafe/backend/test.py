import sys
import pickle
import json

# Define the file path where the .pkl file will be stored
PKL_FILE_PATH = "output.pkl"

def save_as_pkl(array):
    try:
        # Save the array to a .pkl file
        with open(PKL_FILE_PATH, 'wb') as f:
            pickle.dump(array, f)
        print(PKL_FILE_PATH)  # Print the file path as output for Node.js
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Read input data from stdin
    input_data = sys.stdin.read()

    try:
        # Parse the input JSON
        input_data = json.loads(input_data)
        array = input_data.get("array")

        if array and isinstance(array, list):
            save_as_pkl(array)
        else:
            print("Error: Invalid array input")
    except Exception as e:
        print(f"Error: {str(e)}")
