#!/usr/bin/env ruby

require 'xcodeproj'

project_path = ARGV[0] || 'ios/App/App.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Add header search paths to all targets
project.targets.each do |target|
  target.build_configurations.each do |config|
    header_search_paths = config.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']
    
    # Convert to array if it's a string
    header_search_paths = [header_search_paths] if header_search_paths.is_a?(String)
    
    # Add our custom header search paths
    new_paths = [
      '$(SRCROOT)/CapacitorHeaders',
      '$(SRCROOT)/../CapacitorHeaders',
      '$(PODS_ROOT)/Headers/Public/CapacitorCordova',
      '$(SRCROOT)/Pods/Headers/Public/CapacitorCordova',
      '$(SRCROOT)/../../node_modules/@capacitor/ios/CapacitorCordova/CapacitorCordova/Classes/Public'
    ]
    
    # Add new paths if they don't already exist
    new_paths.each do |path|
      header_search_paths << path unless header_search_paths.include?(path)
    end
    
    config.build_settings['HEADER_SEARCH_PATHS'] = header_search_paths
  end
end

project.save
puts "Updated header search paths in #{project_path}"
