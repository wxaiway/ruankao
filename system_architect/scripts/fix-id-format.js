const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '../content/2025/04-练习题库/questions');

// Files with unquoted id fields that need to be fixed
const filesToFix = [
  '0009.md', '0018.md', '0019.md', '0029.md', '0039.md', '0049.md',
  '0058.md', '0068.md', '0069.md', '0079.md', '0080.md', '0081.md', 
  '0082.md', '0083.md', '0085.md', '0086.md', '0088.md', '0090.md',
  '0093.md', '0094.md', '0097.md', '0099.md', '0109.md'
];

console.log(`Starting to fix id format for ${filesToFix.length} files...`);

filesToFix.forEach(filename => {
  const filePath = path.join(questionsDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace unquoted id with quoted id in frontmatter
    const updatedContent = content.replace(/^id:\s*(\d{4})$/m, "id: '$1'");
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Fixed id format in ${filename}`);
    } else {
      console.log(`⚠️  No changes needed for ${filename}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
});

console.log('✅ ID format standardization completed!');