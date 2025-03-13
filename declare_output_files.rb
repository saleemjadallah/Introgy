#!/usr/bin/env ruby

# This script creates a Run Script build phase in the Xcode project
# to explicitly declare the RevenueCat source files as outputs

require 'xcodeproj'

# Path to the project
project_path = "ios/App/App.xcodeproj"

# Name for the script phase
SCRIPT_PHASE_NAME = "Declare RevenueCat Source Files as Outputs"

begin
  # Open the project
  project = Xcodeproj::Project.open(project_path)
  puts "Opened project: #{project_path}"

  # Find the main target
  target = project.targets.find { |t| t.name == "App" }
  if !target
    puts "Error: Could not find App target"
    exit 1
  end
  puts "Found target: #{target.name}"

  # Check if script phase already exists and remove it
  target.build_phases.each do |phase|
    if phase.is_a?(Xcodeproj::Project::Object::PBXShellScriptBuildPhase) && phase.name == SCRIPT_PHASE_NAME
      target.build_phases.delete(phase)
      puts "Removed existing script phase"
    end
  end

  # Create script to copy files
  script = <<~SCRIPT
    # This script phase declares RevenueCat source files as outputs
    # to prevent "Build input file cannot be found" errors

    # Check if we're in Xcode Cloud
    if [ -d "/Volumes/workspace/repository" ]; then
      echo "Running in Xcode Cloud environment"
      
      # Create directories if they don't exist
      mkdir -p "${BUILT_PRODUCTS_DIR}/RevenueCatFiles/Sources"
      
      # Touch all required files to satisfy the build system
      find "${SRCROOT}/../../revenuecat_sources/Sources" -name "*.swift" -exec touch {} \\;
      
      echo "Declared RevenueCat source files as outputs"
    else
      echo "Not running in Xcode Cloud, skipping output declaration"
    fi
  SCRIPT

  # Create a new build phase
  phase = target.new_shell_script_build_phase(SCRIPT_PHASE_NAME)
  phase.shell_script = script
  
  # Set up input and output paths
  phase.input_paths = []
  
  # Add all source files as output paths
  output_paths = []
  Dir.glob("revenuecat_sources/Sources/**/*.swift").each do |file|
    output_path = "${BUILT_PRODUCTS_DIR}/RevenueCatFiles/#{file.sub('revenuecat_sources/', '')}"
    output_paths << output_path
  end
  
  phase.output_paths = output_paths
  
  # Move the phase to the beginning
  phases = target.build_phases
  phases.move(phases.last, 0)
  
  # Save the project
  project.save
  puts "Added script phase to declare #{output_paths.count} output files"
  puts "Project saved successfully"

rescue => e
  puts "Error: #{e.message}"
  puts e.backtrace
  exit 1
end