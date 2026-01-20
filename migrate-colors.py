#!/usr/bin/env python3
"""
Script para substituir todas as cores hard-coded por variáveis CSS
"""

import re
import os

# Mapeamento de substituições
REPLACEMENTS = {
    # Backgrounds
    r'bg-\[#0a0a0a\]': 'bg-[var(--bg-primary)]',
    r'bg-\[#121212\]': 'bg-[var(--bg-secondary)]',
    r'bg-\[#0f0f0f\]': 'bg-[var(--bg-elevated)]',
    r'bg-\[#151515\]':  'bg-[var(--bg-secondary)]',
    r'bg-zinc-900': 'bg-[var(--bg-secondary)]',
    r'bg-zinc-800': 'bg-[var(--bg-tertiary)]',
   r'bg-zinc-700': 'bg-[var(--bg-hover)]',
    r'bg-black': 'bg-[var(--bg-primary)]',
    r'bg-white': 'bg-[var(--bg-elevated)]',
    
    # Text
    r'text-white\b': 'text-[var(--text-primary)]',
    r'text-zinc-400': 'text-[var(--text-secondary)]',
    r'text-zinc-500': 'text-[var(--text-tertiary)]',
    r'text-zinc-600': 'text-[var(--text-muted)]',
    
    # Borders
    r'border-zinc-800': 'border-[var(--border-primary)]',
    r'border-zinc-700': 'border-[var(--border-secondary)]',
    
    # Accent
    r'bg-\[#EAB308\]': 'bg-[var(--accent-gold)]',
    r'text-\[#EAB308\]': 'text-[var(--accent-gold)]',
    r'hover:bg-\[#EAB308\]': 'hover:bg-[var(--accent-gold-hover)]',
    r'hover:text-\[#EAB308\]': 'hover:text-[var(--accent-gold)]',
}

def replace_colors_in_file(filepath):
    """Replace hard-coded colors with CSS variables in a file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for pattern, replacement in REPLACEMENTS.items():
        content = re.sub(pattern, replacement, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated: {filepath}")
        return True
    return False

# Arquivos para processar
files = [
    'app/(dashboard)/dashboard/page.tsx',
   'app/(dashboard)/leads/page.tsx',
    'app/(dashboard)/tarefas/page.tsx',
    'app/(dashboard)/funis/page.tsx',
    'components/FunnelSidebar.tsx',
]

base_path = '/Users/pedrostriquer/meu-crm-projeto'
updated = 0

for file in files:
    full_path = os.path.join(base_path, file)
    if os.path.exists(full_path):
        if replace_colors_in_file(full_path):
            updated += 1
    else:
        print(f"❌ File not found: {full_path}")

print(f"\n🎉 Updated {updated} files!")
