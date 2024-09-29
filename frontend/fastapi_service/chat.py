import streamlit as st
import requests

query_params = st.query_params

# Extract the 'user' parameter from the query string
user = query_params.get('username')
# File uploader widget
api_endpoint = "http://localhost:9090/prescription/getDiagnosisForLLM?username="+user

data=requests.get(api_endpoint)
data=data.content.decode('utf-8')
def get_response_from_api(user_input):
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "qwen2.5:0.5b",
        "prompt": user_input,
        "stream": False
    }
    
    try:
        # Send the POST request
        response = requests.post(url, json=payload)
        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()
            # Extracting the chatbot's response from the JSON
            return result.get('response','No response')
        else:
            return f"Error: {response.status_code}"
    except Exception as e:
        return f"An error occurred: {e}"

# Initialize the conversation history in session state if it's not already there
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

for i in st.session_state['chat_history']:
    st.write(i)
    
# Create the chat interface
st.title('Simple Chatbot')
user_input = st.text_input("Type your message here:", key="text")


# When the user sends a message, update the conversation history
if st.button("Send"):
    if user_input:
        # Append user input to the chat history
        st.session_state['chat_history'].append(f"You: {user_input}")
        
        # Get the chatbot response and append it to the chat history
        response = get_response_from_api(f"Here is the patient's data for {user}: {data}. Based on this information and the input: {user_input}, please provide a response in English only.")

        st.write(response)
        st.session_state['chat_history'].append(f"Chatbot: {response}")

        


