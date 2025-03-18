
# Setting up Xcode Build for RevenueCat

To fix the RevenueCat build errors in Xcode Cloud, you need to add a Run Script phase to your Xcode project.

## 1. Add a Run Script Phase

In Xcode:
1. Open your project file (.xcodeproj)
2. Select the App target
3. Go to the "Build Phases" tab
4. Click "+" at the top left > "New Run Script Phase"
5. Drag this new phase BEFORE the "Compile Sources" phase
6. Add this script:

```bash
# Ensure RevenueCat files exist
"${SRCROOT}/declare_revenuecat_outputs.sh"
```

## 2. Configure pre-build for Xcode Cloud

In your Xcode Cloud workflow:
1. Add a pre-build script step that executes `fix_revenuecat_before_build.sh`
2. Make sure the script has executable permissions

## 3. Verify RevenueCat is properly configured

The Podfile should specify version 5.19.0:
```ruby
pod 'RevenueCat', '5.19.0'
```

## How This Solution Works

1. The `fix_revenuecat_before_build.sh` script creates all necessary RevenueCat stub files
2. The `declare_revenuecat_outputs.sh` script declares these files as outputs of a build phase
3. This tells Xcode that these files are generated, so it won't error when they're not found initially

The Xcode build should now proceed without the "Build input files cannot be found" errors.
