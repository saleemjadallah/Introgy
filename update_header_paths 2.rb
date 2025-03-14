#!/usr/bin/env ruby
# This script updates the Header Search Paths in the Xcode project

require 'xcodeproj'

# Path to the Xcode project file
project_path = 'ios/App/App.xcodeproj'

begin
  # Open the project
  project = Xcodeproj::Project.open(project_path)
  puts "Opened project: #{project_path}"
  
  # Find the main target (App)
  target = project.targets.find { |t| t.name == 'App' }
  
  if target.nil?
    puts "Error: Could not find the 'App' target"
    exit 1
  end
  
  puts "Found target: #{target.name}"
  
  # Update each build configuration
  target.build_configurations.each do |config|
    puts "Updating configuration: #{config.name}"
    
    # Get the current header search paths
    header_search_paths = config.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
    
    # Convert to array if it's a string
    header_search_paths = [header_search_paths] if header_search_paths.is_a?(String)
    
    # Add the required paths
    new_paths = [
      '$(PODS_ROOT)/Headers/Public',
      '$(PODS_ROOT)/Headers/Public/Capacitor',
      '$(PODS_ROOT)/Headers/Public/CapacitorCordova'
    ]
    
    # Add new paths if they don't already exist
    new_paths.each do |path|
      unless header_search_paths.include?(path)
        header_search_paths << path
        puts "  Added: #{path}"
      else
        puts "  Already exists: #{path}"
      end
    end
    
    # Update the build setting
    config.build_settings['HEADER_SEARCH_PATHS'] = header_search_paths
  end
  
  # Save the project
  project.save
  puts "Project saved successfully"
  
rescue => e
  puts "Error: #{e.message}"
  puts e.backtrace
  exit 1
end