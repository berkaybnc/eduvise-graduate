import os

directory = r'c:\Users\berkay\Desktop\eduvise graduate\frontend\src'
target = r"`http://localhost:8000${"
replacement = r"`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if target in content:
                new_content = content.replace(target, replacement)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {filepath}')
