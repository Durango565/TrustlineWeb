import re

with open('assets/css/styles.css', 'r') as f:
    content = f.read()

# The block to remove
pattern = r'\.nav-cta\s*\{[^}]*\}'

# We want to keep the first one
matches = list(re.finditer(pattern, content))
if len(matches) > 1:
    # Keep the first match
    first_match = matches[0]
    
    # The rest are problematic. 
    # Let's analyze where they are inserted.
    # Usually they are inserted right after a property.
    
    # A better approach: 
    # 1. Remove all .nav-cta blocks.
    # 2. Put one back at the top.
    # 3. Fix the missing braces.
    
    # However, if we just remove them, we still have the missing '}'
    # Let's look for the pattern:
    # {
    #   property: value;
    #   .nav-cta { ... }
    
    # It seems the injection replaced the closing brace.
    # Let's try to replace every .nav-cta block (after the first) with a closing brace '}'.
    
    new_content = content
    # We iterate backwards to avoid offset issues
    for match in reversed(matches[1:]):
        start, end = match.span()
        new_content = new_content[:start] + '}' + new_content[end:]
        
    with open('assets/css/styles.css.fixed', 'w') as f:
        f.write(new_content)
    print("Fixed CSS written to assets/css/styles.css.fixed")
else:
    print("No duplicate .nav-cta blocks found.")
