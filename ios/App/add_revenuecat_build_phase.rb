#!/usr/bin/env ruby
require 'xcodeproj'

# Open the Xcode project
project_path = 'App.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Get the main target
target = project.targets.first

# Check if the build phase already exists
existing_phase = target.shell_script_build_phases.find { |phase| phase.name == 'RevenueCat Build Phase' }

if existing_phase.nil?
  # Create a new shell script build phase
  phase = target.new_shell_script_build_phase('RevenueCat Build Phase')
  
  # Set the script content
  phase.shell_script = '"${SRCROOT}/revenuecat_build_phase.sh"'
  
  # Move the phase before the "Compile Sources" phase
  compile_phase_index = target.build_phases.find_index { |p| p.instance_of?(Xcodeproj::Project::Object::PBXSourcesBuildPhase) }
  if compile_phase_index
    target.build_phases.move(phase, compile_phase_index)
  end
  
  puts "✅ Added RevenueCat Build Phase"
else
  puts "ℹ️ RevenueCat Build Phase already exists"
end

# Save the project
project.save

puts "✅ Project updated successfully" 