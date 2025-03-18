#!/bin/bash

echo "Running Xcode Cloud header fix..."

# Create directories
mkdir -p $CI_WORKSPACE/ios/App/Pods/Headers/Public/CapacitorCordova

# Copy header files from node_modules directly
if [ -d "$CI_WORKSPACE/node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public" ]; then
  cp -R $CI_WORKSPACE/node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public/* $CI_WORKSPACE/ios/App/Pods/Headers/Public/CapacitorCordova/
  cp $CI_WORKSPACE/node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/CapacitorCordova.h $CI_WORKSPACE/ios/App/Pods/Headers/Public/CapacitorCordova/
  echo "Copied header files from node_modules"
else
  echo "Error: Could not find Capacitor Cordova header files in node_modules"
  exit 1
fi

# Add header search paths to Xcode build settings
cat > $CI_WORKSPACE/add_header_search_paths.rb << 'RUBYEOF'
#!/usr/bin/env ruby

project_path = ENV['CI_WORKSPACE'] + '/ios/App/App.xcodeproj'
require 'xcodeproj'

begin
  project = Xcodeproj::Project.open(project_path)
  project.targets.each do |target|
    target.build_configurations.each do |config|
      header_paths = config.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
      header_paths = [header_paths] if header_paths.is_a?(String)
      
      new_paths = [
        '$(SRCROOT)/Pods/Headers/Public/CapacitorCordova',
        '$(PODS_ROOT)/Headers/Public/CapacitorCordova',
        '$(SRCROOT)/../../node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public'
      ]
      
      new_paths.each do |path|
        header_paths << path unless header_paths.include?(path)
      end
      
      config.build_settings['HEADER_SEARCH_PATHS'] = header_paths
    end
  end
  
  project.save
  puts "Successfully updated header search paths in Xcode project"
rescue => e
  puts "Error updating Xcode project: #{e.message}"
  exit 1
end
RUBYEOF

if command -v ruby >/dev/null 2>&1 && gem list -i xcodeproj >/dev/null 2>&1; then
  ruby $CI_WORKSPACE/add_header_search_paths.rb
  echo "Updated header search paths in Xcode project"
else
  echo "Warning: Ruby xcodeproj gem not available. Header search paths not updated."
fi

echo "Xcode Cloud header fix completed"
