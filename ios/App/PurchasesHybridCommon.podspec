Pod::Spec.new do |s|
  s.name             = 'PurchasesHybridCommon'
  s.version          = '13.24.0'
  s.summary          = 'Stub for PurchasesHybridCommon'
  s.description      = 'Stub implementation of PurchasesHybridCommon to satisfy build requirements'
  s.homepage         = 'https://github.com/RevenueCat/purchases-hybrid-common'
  s.license          = { :type => 'MIT' }
  s.author           = { 'RevenueCat' => 'support@revenuecat.com' }
  s.source           = { :git => 'https://github.com/RevenueCat/purchases-hybrid-common.git', :tag => s.version.to_s }
  s.ios.deployment_target = '15.0'
  s.swift_version = '5.0'
  
  # Create a stub header file
  s.prepare_command = <<-CMD
    mkdir -p ios/PurchasesHybridCommon/PurchasesHybridCommon
    echo "#ifndef PurchasesHybridCommon_h" > ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h
    echo "#define PurchasesHybridCommon_h" >> ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h
    echo "#endif /* PurchasesHybridCommon_h */" >> ios/PurchasesHybridCommon/PurchasesHybridCommon/PurchasesHybridCommon.h
  CMD
  
  s.source_files = 'ios/PurchasesHybridCommon/PurchasesHybridCommon/**/*'
  s.public_header_files = 'ios/PurchasesHybridCommon/PurchasesHybridCommon/**/*.h'
  
  # Dependency on RevenueCat
  s.dependency 'RevenueCat', '5.19.0'
  
  # Ensure we don't build unnecessary architectures
  s.pod_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
  s.user_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64' }
end 