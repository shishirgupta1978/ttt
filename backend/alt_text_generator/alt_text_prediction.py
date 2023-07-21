from docx import Document
import re
import glob
import pysbd
import openai
import ast
from django.conf import settings


def read_docx_file(file_path):
    text = []
    figure_strings = []
    grouped_items = {}

    doc = Document(file_path)
    
    for paragraph in doc.paragraphs:
        
        # getting list of figures
        matches = re.findall(r'\bFigure\s(\d+)\.?(\d+)?|\bFig\.\s(\d+)\.?(\d+)?|\bFig\.(\d+)\.?(\d+)?|\bFIGURE\s(\d+)\.?(\d+)?|\bFIG\.\s(\d+)\.?(\d+)?', paragraph.text)
                
        for match in matches:
            if match[0]:
                figure_strings.append(f"Figure {match[0]}.{match[1]}" if match[1] else f"Figure {match[0]}")
            if match[2]:
                figure_strings.append(f"Fig. {match[2]}.{match[3]}" if match[3] else f"Fig. {match[2]}")
            if match[4]:
                figure_strings.append(f"Fig.{match[4]}.{match[5]}" if match[5] else f"Fig.{match[4]}")
            if match[6]:
                figure_strings.append(f"FIGURE {match[6]}.{match[7]}" if match[7] else f"FIGURE {match[6]}")
            if match[8]:
                figure_strings.append(f"FIG. {match[8]}.{match[9]}" if match[9] else f"FIG. {match[8]}")

        # reading content
        text.append(paragraph.text)
    
    for item in figure_strings:
        parts = item.split(' ')
        if len(parts) < 2:
            parts = item.split('.')
        suffix = parts[-1]
        if suffix not in grouped_items:
            grouped_items[suffix] = set()
        grouped_items[suffix].add(item)

    # Convert the dictionary values (sets) to a list of sets
    output_list_of_figures = list(grouped_items.values())

    return '\n'.join(text), output_list_of_figures

def find_word_in_lines(content, word):
    lines = content.split('\n')
    matching_lines = []
    
    # Construct the regular expression pattern with word boundary anchors
    pattern = r"\b{}\b".format(re.escape(word))
    
    for line_number, line in enumerate(lines, start=1):
        if re.search(pattern, line):
            matching_lines.append(line)
    
    return matching_lines

def extract_text(string, matching_word_set):
    # Initialize the SBD model
    sbd = pysbd.Segmenter(language="en", clean=False)
    
    # Split the input string into sentences
    sentences = sbd.segment(string)

    # Convert the matching_word_set to lowercase for case-insensitive comparison
    matching_word_set = {word.lower() for word in matching_word_set}

    if re.sub(r'[^\w]', '', sentences[0][:-1]).lower() in matching_word_set:
        return " ".join(sentences)

    if(len(sentences)>3):
        matching_items = []
        matching_word_found = False

        for i, item in enumerate(sentences):
            # Check if any word in matching_word_set is present in the sentence
            if any(word.lower() in item.lower() for word in matching_word_set):
                if matching_word_found:
                    matching_items.append(item)
                    if i < len(sentences) - 1:
                        next_item = sentences[i + 1]  # Get the next item after the matching word
                        matching_items.append(next_item)
                else:
                    matching_word_found = True
                    matching_items.append(item)
                    if i < len(sentences) - 2:
                        next_items = sentences[i + 1 : i + 3]  # Get the next two items after the matching word
                        matching_items.extend(next_items)
        
        return " ".join(matching_items)
    
    else:
        return " ".join(sentences)

def remove_from_end(string):
    conjunctions = ['and', 'or', 'but', 'nor', 'for', 'yet', 'so', 'are', 'of', 'a', 'an', 'the', 'that', 'this', 'by']
    words = string.split()

    # Iterate over the words from the end of the string
    for i in range(len(words) - 1, 0, -1):
        if words[i].lower() not in conjunctions:
            break  # Stop when a non-conjunction word is found
        else:
            words.pop(i)  # Remove the conjunction word

    return ' '.join(words)

def remove_brackets(text):
    result = ""
    stack = []

    for char in text:
        if char == '(' or char == '[':
            stack.append(char)
        elif char == ')' and stack and stack[-1] == '(':
            stack.pop()
        elif char == ']' and stack and stack[-1] == '[':
            stack.pop()
        elif not stack:
            result += char

    return result

def remove_special_characters(input_string):
    # Define the regular expression pattern to match special characters
    pattern = r'[^a-zA-Z0-9\s.]'
    # Replace the matched special characters with an empty string
    result = re.sub(pattern, '', input_string)

    return result.strip()

def flatten_list(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(sub_item for sub_item in item if sub_item != '')
        else:
            result.append(item)
    return result

def remove_encoded_chars(input_string):
    # Encode the input string to bytes
    encoded_bytes = input_string.encode('ascii', 'ignore')
    
    # Decode the bytes back to string
    cleaned_string = encoded_bytes.decode()
    
    return cleaned_string

def altTextPredict(input_text):
    prompt = f"""{input_text} \n Above you are given an "Image Caption" and "Image Cites" extracted from a research paper. Your task is to use this 
    information as input and generate an "Alt Text" and a "Caption" for the corresponding image described in the given text input. 
    The alt text and caption should be concise and descriptive, conveying the essential information contained in the image while minimizing the 
    use of mathematical information., both individually should not exceed 50 words.
    Remember to consider the context provided by the caption and image citations to ensure accurate and relevant alt text and caption generation.
    Avoid using the words "image," "figure," or their numbers, or any numerical references. 
    The output should be in a JSON format with two keys: "AltText" and "Caption," representing the generated alternative text and caption 
    for the given image."""
    
    openai.api_key = settings.OPENAI_KEY
    openai.organization = settings.OPENAI_ORGANIZATION

    # print("MODELS=", openai.Model.list())

    response = openai.ChatCompletion.create(model = "gpt-3.5-turbo",
                                            messages = [{"role": "user","content":prompt}])
    
    return response.choices[0].message.content

def convert_dict_to_tuple_of_tuples(input_dict, key1, key2):
    result = []
    for key, nested_dict in input_dict.items():
        # Assuming each nested dictionary has exactly 2 keys
        value_key1 = nested_dict.get(key1)
        value_key2 = nested_dict.get(key2)
        result.append((key, value_key1, value_key2))
    return tuple(result)



def figure_predictions(file_path):
    extracted_text_list = []
    final_input_dict = {}
    matching_lines = []
    content,figures_list = read_docx_file(file_path)

    for search_word_set in figures_list:
        for search_word in search_word_set:
            if len(matching_lines) > 0:
                matching_lines.append(find_word_in_lines(content, search_word))
            else:
                matching_lines = find_word_in_lines(content, search_word)
        
        matching_lines = flatten_list(matching_lines)
        # print(matching_lines)

        for string in matching_lines:
            if(len(matching_lines) == 1):
                extracted_text = string
            else:
                extracted_text = extract_text(string, search_word_set)
                
            if extracted_text:
                extracted_text = remove_encoded_chars(extracted_text)
                extracted_text = remove_special_characters(extracted_text)
                extracted_text = remove_brackets(extracted_text)
                extracted_text = remove_from_end(extracted_text)
                
                extracted_text_list.append(extracted_text)
            else:
                print("Matching word not found or no text extracted.")
            
        final_input_dict[search_word] = ". ".join(extracted_text_list)
        extracted_text_list = []
        matching_lines = []

    # print("Input ---",final_input_dict)

    prediction = {}

    for key, value in final_input_dict.items():
        prediction[key] = altTextPredict(value)

    for key, val in prediction.items():
        prediction[key] = ast.literal_eval(val)

    

    output = convert_dict_to_tuple_of_tuples(prediction, "AltText", "Caption")
    return output


    


if __name__ == "__main__":

    #folder_path = "TestFiles/"

    # Find all .docx files in the folder
    #docx_files = glob.glob(folder_path + "/*.docx")

    # Combine the lists
    # all_files = docx_files
    all_files=[r'D:\c\1.docx']

    # Print the file names
    for file_path in all_files:
        # Call the function to read the .docx file and figures
        print(figure_predictions(file_path))
        

