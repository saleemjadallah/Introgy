import UIKit
import SwiftUI

extension UI {
    @objc class DesignSystem: NSObject {
    // MARK: - Colors
    @objc class Colors: NSObject {
        @objc static let primary = UIColor(red: 0.2, green: 0.4, blue: 0.8, alpha: 1.0)
        @objc static let secondary = UIColor(red: 0.4, green: 0.6, blue: 0.9, alpha: 1.0)
        @objc static let background = UIColor(red: 0.98, green: 0.98, blue: 0.98, alpha: 1.0)
        @objc static let text = UIColor(red: 0.2, green: 0.2, blue: 0.2, alpha: 1.0)
        @objc static let accent = UIColor(red: 0.3, green: 0.5, blue: 0.9, alpha: 1.0)
        @objc static let secondaryText = UIColor(red: 0.5, green: 0.5, blue: 0.5, alpha: 1.0)
        @objc static let cardBackground = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)
        @objc static let primaryText = UIColor(red: 0.1, green: 0.1, blue: 0.1, alpha: 1.0)
        
        // Social Battery Colors
        @objc static let batteryFull = UIColor(red: 0.2, green: 0.8, blue: 0.2, alpha: 1.0)
        @objc static let batteryMedium = UIColor(red: 0.9, green: 0.7, blue: 0.2, alpha: 1.0)
        @objc static let batteryLow = UIColor(red: 0.8, green: 0.2, blue: 0.2, alpha: 1.0)
        
        @objc static func batteryColor(for level: Double) -> UIColor {
            switch level {
            case 0.0...0.3:
                return batteryLow
            case 0.3...0.7:
                return batteryMedium
            case 0.7...1.0:
                return batteryFull
            default:
                return batteryMedium
            }
        }
        
        class SwiftUI {
            static let primary = Color(Colors.primary)
            static let secondary = Color(Colors.secondary)
            static let background = Color(Colors.background)
            static let text = Color(Colors.text)
            static let accent = Color(Colors.accent) 
            static let secondaryText = Color(Colors.secondaryText)
            static let cardBackground = Color(Colors.cardBackground)
            static let primaryText = Color(Colors.primaryText)
            
            static func batteryColor(for level: Double) -> Color {
                return Color(Colors.batteryColor(for: level))
            }
        }
    }
    
    // MARK: - Typography
    @objc class Typography: NSObject {
        @objc static let titleFont = UIFont.systemFont(ofSize: 24, weight: .bold)
        @objc static let headingFont = UIFont.systemFont(ofSize: 20, weight: .semibold)
        @objc static let bodyFont = UIFont.systemFont(ofSize: 16, weight: .regular)
        @objc static let captionFont = UIFont.systemFont(ofSize: 14, weight: .regular)
        
        // Font sizes
        @objc static let title3: CGFloat = 20.0
        @objc static let caption1: CGFloat = 12.0
        
        @objc static func font(size: CGFloat, weight: UIFont.Weight) -> UIFont {
            return UIFont.systemFont(ofSize: size, weight: weight)
        }
        
        // SwiftUI Typography
        class SwiftUI {
            static func title3(weight: Font.Weight) -> Font {
                // Use the numeric value directly
                return Font.system(size: 20.0, weight: weight)
            }
            
            static func caption1(weight: Font.Weight) -> Font {
                // Use the numeric value directly
                return Font.system(size: 12.0, weight: weight)
            }
        }
    }
    
    // MARK: - Layout
    @objc class Layout: NSObject {
        @objc static let standardSpacing: CGFloat = 16
        @objc static let compactSpacing: CGFloat = 8
        @objc static let wideSpacing: CGFloat = 24
        
        @objc static let cornerRadius: CGFloat = 12
        @objc static let buttonHeight: CGFloat = 48
        @objc static let iconSize: CGFloat = 24
    }
    
    // MARK: - Animations
    @objc class Animations: NSObject {
        @objc static let standardDuration: TimeInterval = 0.3
        @objc static let quickDuration: TimeInterval = 0.2
        @objc static let slowDuration: TimeInterval = 0.5
        
        @objc static let springDamping: CGFloat = 0.7
        @objc static let initialSpringVelocity: CGFloat = 0.5
    }
    
    }
}

// MARK: - SwiftUI Extensions
extension Color {
    static let dsBackground = Color(UI.DesignSystem.Colors.background)
    static let dsPrimary = Color(UI.DesignSystem.Colors.primary)
    static let dsSecondary = Color(UI.DesignSystem.Colors.secondary)
    static let dsText = Color(UI.DesignSystem.Colors.text)
    static let dsAccent = Color(UI.DesignSystem.Colors.accent)
}
