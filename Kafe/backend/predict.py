# test.py
import sys
import pickle
import json

def predict(model_path, input_data):
    try:
        # Load the model from the provided path
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Make prediction
        # Note: Modify this according to your model's prediction method
        # prediction = model.predict([input_data['inputObj']])
        # print("Loaded model: ", model)
        # print("\nInput received: ", input_data['inputObj'])
        
        arr = [23,38,45, 50, 25]

        # Return prediction as JSON
        # return json.dumps({
        #     'foods': arr
        # })

        return arr
    
    except Exception as e:
        return json.dumps({
            'status': 'error',
            'message': str(e)
        })

if __name__ == "__main__":
    # Read input data from stdin
    input_data = sys.stdin.read()
    
    try:
        # Parse the input JSON
        input_json = json.loads(input_data)
        
        # Handle prediction model
        model_path = input_json.get("model_path")
        predict_data = input_json.get("input_data")
        
        if model_path and predict_data:
            result = predict(model_path, predict_data)
            print(result)
        else:
            print(json.dumps({
                'status': 'error',
                'message': 'Missing model_path or input_data'
            }))

    except Exception as e:
        print(json.dumps({
            'status': 'error',
            'message': str(e)
        }))