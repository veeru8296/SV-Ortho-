import os

def remove_target_blank():
    directory = '.'
    extensions = ['.html', '.js', '.py']
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if '' in content:
                    # Replace various spacings
                    new_content = content.replace('', '')
                    new_content = new_content.replace('', '')
                    new_content = new_content.replace('', '')
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {filepath}")

if __name__ == "__main__":
    remove_target_blank()
