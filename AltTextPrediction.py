from docx import Document
import re
import glob
import transformers
import os
import pickle
import pysbd

def read_docx_file(file_path):
    text = []
    figure_strings = set()

    doc = Document(file_path)
    
    for paragraph in doc.paragraphs:
        
        # getting list of figures
        matches = re.findall(r'Figure\s(\d+)\.|Fig\.\s(\d+)|Fig\.(\d+)', paragraph.text)
        for match in matches:
            if match[0]:
                figure_strings.add("Figure " + match[0])
            elif match[1]:
                figure_strings.add("Fig. " + match[1])
            else:
                figure_strings.add("Fig." + match[2])

        # reading content
        text.append(paragraph.text)

    return '\n'.join(text),sorted(figure_strings,key=lambda x: int(re.findall(r'\d+', x)[0]))

def find_word_in_lines(content, word):
    lines = content.split('\n')
    matching_lines = []
    
    # Construct the regular expression pattern with word boundary anchors
    pattern = r"\b{}\b".format(re.escape(word))
    
    for line_number, line in enumerate(lines, start=1):
        if re.search(pattern, line):
            matching_lines.append(line)
    
    return matching_lines

def extract_text(string, matching_word):
    # Initialize the SBD model
    sbd = pysbd.Segmenter(language="en", clean=False)
    
    # Split the input string into sentences
    sentences = sbd.segment(string)

    if(re.sub(r'[^\w]', '', sentences[0][:-1]) == matching_word.replace(" ","")):
        return " ".join(sentences)

    if(len(sentences)>3):
        matching_items = []
        matching_word_found = False

        for i, item in enumerate(sentences):
            if matching_word in item:
                if matching_word_found:
                    matching_items.append(item)
                    next_item = sentences[i + 1]  # Get the next item after the matching word
                    matching_items.append(next_item)
                else:
                    matching_word_found = True
                    matching_items.append(item)
                    next_items = sentences[i + 1 : i + 3]  # Get the next two items after the matching word
                    matching_items.extend(next_items)
        
        return " ".join(matching_items)
    
    else:
        return " ".join(sentences)

def remove_from_end(string):
    conjunctions = ['and', 'or', 'but', 'nor', 'for', 'yet', 'so', 'are', 'of', 'a', 'an', 'the', 'that', 'this']
    words = string.split()

    # Iterate over the words from the end of the string
    for i in range(len(words) - 1, 0, -1):
        if words[i].lower() not in conjunctions:
            break  # Stop when a non-conjunction word is found
        else:
            words.pop(i)  # Remove the conjunction word

    return ' '.join(words)

def capitalize_sentences(input_string):
    # to capitalize the first letter of each sentence
    return re.sub(r"(^|[.!?]\s+)(\w+)", lambda x: x.group(0).capitalize(), input_string)

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

def clean_string(text):
  # Remove special characters except spaces
  text = re.sub(r'[^a-zA-Z0-9\s]', '', text)

  # Remove unnecessary spaces
  text = re.sub(r'\s+', ' ', text)

  return text.strip()

def replace_figures_words(text):
    # Replace diag/ diagram 
    pattern = r'\b(?:fig|figure|Figure)\s*(\d+)\b'
    result = re.sub(pattern, r'image \1', text)
    return result.strip()

def preprocess_text(text, tokenizer):
    # Tokenize the text.
    encoded_text = tokenizer(text=text, return_tensors="pt")

    # Clean the text.
    normalized_text = text.lower()
    cleaned_text = tokenizer.tokenize(normalized_text)

    return {
        "input_ids": encoded_text["input_ids"],
        "attention_mask": encoded_text["attention_mask"]
    }

def summarize_text(cleaned_text, model):
    # Get the input IDs and attention mask.
    input_ids = cleaned_text["input_ids"]
    attention_mask = cleaned_text["attention_mask"]

    # Summarize the text.
    # print("Input length = ", len(input_ids[0]))

    if  100 < len(input_ids[0]):
      length = len(input_ids[0]) * 0.50
    elif 50 < len(input_ids[0]) > 99:
      length = len(input_ids[0]) * 0.70
    else:
      length = len(input_ids[0])

    summary = model.generate(input_ids=input_ids, attention_mask=attention_mask, max_length=int(length))
    # print(len(summary[0]))

    return summary

def output_cleaning(text, tokenizer):
    # Convert the generated summary tensor to a string.
    text = tokenizer.decode(text[0], skip_special_tokens=True)

    # Clean the output.
    cleaned_output = tokenizer.clean_up_tokenization(text)

    return cleaned_output

def runner(input_text):
    tokenizer = transformers.AutoTokenizer.from_pretrained("bert-base-uncased")

    model_path = "facebook/bart-base"
    pickle_file = "alt_model.pickle"

    if os.path.exists(pickle_file):
        # Load the model from the pickle file
        print("Loading model...")
        with open(pickle_file, "rb") as f:
            model = pickle.load(f)
    else:
        # Initialize and save the model
        print("Downloading and saving model...")
        model = transformers.AutoModelForSeq2SeqLM.from_pretrained(model_path)
        with open(pickle_file, "wb") as f:
            pickle.dump(model, f)


    cleaned_text = preprocess_text(input_text, tokenizer)

    summary = summarize_text(cleaned_text, model)

    cleaned_output = output_cleaning(summary, tokenizer)

    # print("Raw---",cleaned_output)

    cleaned_output = remove_from_end(cleaned_output)

    cleaned_output = remove_brackets(cleaned_output)

    cleaned_output = clean_string(cleaned_output)

    cleaned_output = replace_figures_words(cleaned_output)

    cleaned_output = capitalize_sentences(cleaned_output)

    return cleaned_output

if __name__ == "__main__":
    extracted_text_list = []
    final_input_dict = {}

    folder_path = "TestFiles/"

    # Find all .docx files in the folder
    #docx_files = glob.glob(folder_path + "/*.docx")

    # Combine the lists
    # all_files = docx_files
    all_files=[r'D:\c\00tvt00-zheng-3274688.docx']

    # Print the file names
    for file_path in all_files:
        # Call the function to read the .docx file and figures
        print(file_path)
        content,figures_list = read_docx_file(file_path)

        for search_word in figures_list:
            matching_lines = find_word_in_lines(content, search_word)
            for string in matching_lines:
                if(len(matching_lines) == 1):
                    extracted_text = string
                else:
                    extracted_text = extract_text(string, search_word)

                if extracted_text:
                    extracted_text_list.append(extracted_text)
                else:
                    print("Matching word not found or no text extracted.")
            
            final_input_dict[search_word] = ". ".join(extracted_text_list)
            extracted_text_list = []

        print("Input ---",final_input_dict)

        prediction = {}

        for key, value in final_input_dict.items():
            prediction[key] = runner(value)

        print("Alt texts ---",prediction)




