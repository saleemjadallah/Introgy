Pod::Spec.new do |s|
  s.name             = 'PurchasesHybridCommon'
  s.version          = '13.24.0'
  s.summary          = 'Common files for hybrid SDKs for RevenueCat's Subscription and in-app-purchase backend service.'

  s.description      = <<-DESC
  This pod is used as a dependency for RevenueCat's hybrid SDKs (such as React Native, Flutter, Cordova), so they can share common files.
                       DESC

  s.homepage         = 'https://www.revenuecat.com/'
  s.license          = { :type => 'MIT' }
  s.author           = { 'RevenueCat' => 'support@revenuecat.com' }
  s.source           = { :git => 'https://github.com/RevenueCat/purchases-hybrid-common.git', :tag => s.version.to_s }

  s.ios.deployment_target = '11.0'
  s.swift_version = '5.7'

  # Use custom source_files path that exists locally
  s.source_files = "Headers/Public/PurchasesHybridCommon/**/*"
  
  # Use local header directories instead of trying to access the pod's repository
  s.public_header_files = "Headers/Public/PurchasesHybridCommon/**/*.h"
  
  s.dependency 'RevenueCat', '5.19.0'

  # Skip validating the podspec
  s.validate_spec = false

  # Ensure we don't build unnecessary architectures
  s.pod_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
  s.user_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
end 