import streamlit as st
import matplotlib.pyplot as plt
import random
import matplotlib.dates as mdates
import datetime
import pandas as pd
import requests

def generate_color():
    """Generates a random color in hex format."""
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

def assign_colors_to_values(values_list):
    """Assigns a unique color to each unique individual value."""
    color_map = {}
    for value in values_list:
        color_map[value] = generate_color()
    return color_map

# Extract unique medicines and assign colors

def map_values_to_colors(values_list, color_map):
    """Maps each value in the list to its corresponding color."""
    color_output = []
    for val in values_list:
        color_output.append(color_map[val.strip()])
    return color_output

# Title for the Streamlit app
st.title('Blood Report Visualization with Medicine Highlighting (Lines and Dots)')
query_params = st.query_params

# Extract the 'user' parameter from the query string
user = query_params.get('username')
# File uploader widget
print(user,"User is this")
api_endpoint = "http://localhost:9090/reports/getReportsForUser?username="+user

uploaded_file = requests.get(api_endpoint)
# print(uploaded_file.content,"Hey")
if uploaded_file.content is not None:
    # Read the uploaded CSV file
    df = pd.read_json(uploaded_file.content.decode('utf-8'))
    # print(df.head())
    df.dropna(inplace=True)
    unique_medicines = pd.Series([med.strip() for sublist in df['medicine'] for med in sublist.split(',')]).unique()

    
    # Convert date column to datetime format
    df['date'] = pd.to_datetime(df['date'])
    df['date_num'] = df['date'].apply(lambda date: mdates.date2num(date))
    # Dropdown to select which x to plot
    x=df['date_num']

    # Display the dataframe
    
    attribute=st.selectbox('Select the attribute to plot', df.columns[1:-2], index=0)
    # Dropdown to select which y to plot
    y = df[attribute]  # Exclude 'date' and 'medicine'

    # Generate the plot using matplotlib
    fig, ax = plt.subplots()

    # Plot the y as a line plot
    ax.plot(x, y, marker='o',markersize=0, label="Line Plot with Points")  # Line plot with markers

    # Get the unique medicines in the dataset
    unique_medicines = pd.Series([med.strip() for sublist in df['medicine'] for med in sublist.split(',')]).unique()
    color_map = assign_colors_to_values(unique_medicines)

    # Create a color map for the medicines
    colors = plt.cm.get_cmap('Set1', len(unique_medicines))  # Use Set1 color map with a color for each medicine
    val=(sum(y)//len(y))/50 
    val=val if val>3 else 50
    # Loop through each unique medicine
    for i in range(len(x)):
        size = val# Size of the pie chart
        inset_ax = ax.inset_axes([x[i] - size / 2, y[i] - size / 2, size, size], transform=ax.transData)
        temp_arr = df['medicine'][i].split(',')
        

        # Create the pie chart in the inset axis with correct colors
        colors = map_values_to_colors(temp_arr, color_map)
        inset_ax.pie([1] * len(temp_arr), colors=colors)
        
        inset_ax.set_aspect('equal')
    
    ax.xaxis.set_major_locator(mdates.AutoDateLocator())  # Automatically find the best position for date ticks
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
    ax.set_xlabel('Date')
    ax.set_ylabel(attribute)
    plt.xticks(rotation=45, ha='right')
    html_content = "<div><strong>Medicine Color Guide:</strong><br>"

# Add each medicine as a colored box and name to the HTML
    for med, color in color_map.items():
        html_content += f"<div style='display: flex; align-items: center; margin: 5px;'><div style='width: 20px; height: 20px; background-color: {color}; margin-right: 5px; border: 1px solid black;'></div>{med}</div>"

    # Close the HTML block
    html_content += "</div>"

    # Display the HTML in the Streamlit app
    st.markdown(html_content, unsafe_allow_html=True)
    
    st.pyplot(fig)
