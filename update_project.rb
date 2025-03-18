#!/usr/bin/env ruby

# Path to the project.pbxproj file
project_file = '/Users/saleemjadallah/Desktop/Introgy-main/ios/App/App.xcodeproj/project.pbxproj'

# Read the file content
content = File.read(project_file)

# Add DEVELOPMENT_TEAM after each CODE_SIGN_IDENTITY
modified_content = content.gsub(/(CODE_SIGN_IDENTITY = "iPhone Developer";)/, "\\1\n\t\t\t\tDEVELOPMENT_TEAM = \"A644J99F8H\";")

# Write the modified content back to the file
File.write(project_file, modified_content)

puts "Project file updated with development team A644J99F8H"
