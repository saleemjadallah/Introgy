
// Stub file created for build compatibility
import Foundation

// Basic FeatureEvent class to satisfy the compiler
struct FeatureEvent {
    let name: String
    let properties: [String: Any]
    
    init(name: String, properties: [String: Any] = [:]) {
        self.name = name
        self.properties = properties
    }
}
