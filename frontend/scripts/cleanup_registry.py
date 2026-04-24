import sys
import re

file_path = 'd:/Builder/withAPP/frontend-app/src/features/resume-builder/constants/registry.generated.js'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Remove aliases
for target in ['vibrant-wave', 'sidekick', 'storyteller', 'clinical']:
    # Match: "id": "id",
    # We remove the whole line. Let's use re.sub
    pattern = r'\s*"' + target + r'":\s*"' + target + r'",?'
    text = re.sub(pattern, '', text)

# Remove array elements
start_idx = text.find('export const GENERATED_REGISTRY = [')
if start_idx == -1:
    print('Could not find GENERATED_REGISTRY')
    sys.exit(1)

array_start = text.find('[', start_idx)
array_end = text.find('];', array_start)

array_content = text[array_start+1:array_end]

objects = []
current_obj = ''
brace_count = 0
in_string = False
escape_char = False

for char in array_content:
    if escape_char:
        current_obj += char
        escape_char = False
        continue
        
    if char == '\\\\':
        escape_char = True
        current_obj += char
        continue
        
    if char == '"':
        in_string = not in_string
        
    if not in_string:
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            
    current_obj += char
    
    if brace_count == 0 and current_obj.strip():
        # Clean leading commas
        obj_clean = current_obj.strip()
        while obj_clean.startswith(','):
            obj_clean = obj_clean[1:].strip()
            
        if obj_clean:
            objects.append(obj_clean)
        current_obj = ''

filtered_objects = []
targets = ['"vibrant-wave"', '"sidekick"', '"storyteller"', '"clinical"']

for obj in objects:
    is_target = False
    for t in targets:
        if ('"id": ' + t) in obj or ('"id":' + t) in obj:
            is_target = True
            break
            
    if not is_target:
        filtered_objects.append(obj)

new_array_content = ',\\n\\n'.join(filtered_objects)
new_text = text[:array_start+1] + '\\n' + new_array_content + '\\n' + text[array_end:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Successfully removed templates from registry.')
