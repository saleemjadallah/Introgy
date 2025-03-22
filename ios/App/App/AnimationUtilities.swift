import UIKit
import SwiftUI

enum AnimationUtilities {
    // MARK: - Animation Curves
    static func springAnimation(
        duration: TimeInterval = DesignSystem.Animations.standardDuration,
        delay: TimeInterval = 0,
        damping: CGFloat = DesignSystem.Animations.springDamping,
        velocity: CGFloat = DesignSystem.Animations.initialSpringVelocity,
        animations: @escaping () -> Void,
        completion: ((Bool) -> Void)? = nil
    ) {
        UIView.animate(
            withDuration: duration,
            delay: delay,
            usingSpringWithDamping: damping,
            initialSpringVelocity: velocity,
            options: .curveEaseInOut,
            animations: animations,
            completion: completion
        )
    }
    
    static func easeInOut(
        duration: TimeInterval = DesignSystem.Animations.standardDuration,
        delay: TimeInterval = 0,
        animations: @escaping () -> Void,
        completion: ((Bool) -> Void)? = nil
    ) {
        UIView.animate(
            withDuration: duration,
            delay: delay,
            options: .curveEaseInOut,
            animations: animations,
            completion: completion
        )
    }
    
    // MARK: - Transform Animations
    static func pulse(view: UIView, scale: CGFloat = 1.1, duration: TimeInterval = 0.2) {
        UIView.animate(
            withDuration: duration,
            animations: {
                view.transform = CGAffineTransform(scaleX: scale, y: scale)
            },
            completion: { _ in
                UIView.animate(withDuration: duration) {
                    view.transform = .identity
                }
            }
        )
    }
    
    static func shake(view: UIView) {
        let animation = CAKeyframeAnimation(keyPath: "transform.translation.x")
        animation.timingFunction = CAMediaTimingFunction(name: .linear)
        animation.duration = 0.6
        animation.values = [-20.0, 20.0, -20.0, 20.0, -10.0, 10.0, -5.0, 5.0, 0.0]
        view.layer.add(animation, forKey: "shake")
    }
    
    // MARK: - Fade Animations
    static func fadeIn(
        view: UIView,
        duration: TimeInterval = DesignSystem.Animations.standardDuration,
        delay: TimeInterval = 0,
        completion: ((Bool) -> Void)? = nil
    ) {
        view.alpha = 0
        UIView.animate(
            withDuration: duration,
            delay: delay,
            options: .curveEaseInOut,
            animations: {
                view.alpha = 1
            },
            completion: completion
        )
    }
    
    static func fadeOut(
        view: UIView,
        duration: TimeInterval = DesignSystem.Animations.standardDuration,
        delay: TimeInterval = 0,
        completion: ((Bool) -> Void)? = nil
    ) {
        UIView.animate(
            withDuration: duration,
            delay: delay,
            options: .curveEaseInOut,
            animations: {
                view.alpha = 0
            },
            completion: completion
        )
    }
    
    // MARK: - Position Animations
    static func slide(
        view: UIView,
        from startPosition: CGPoint,
        to endPosition: CGPoint,
        duration: TimeInterval = DesignSystem.Animations.standardDuration,
        completion: ((Bool) -> Void)? = nil
    ) {
        view.center = startPosition
        UIView.animate(
            withDuration: duration,
            delay: 0,
            usingSpringWithDamping: DesignSystem.Animations.springDamping,
            initialSpringVelocity: DesignSystem.Animations.initialSpringVelocity,
            options: .curveEaseInOut,
            animations: {
                view.center = endPosition
            },
            completion: completion
        )
    }
}

// MARK: - SwiftUI View Extension
extension View {
    func withSpringAnimation(
        duration: Double = DesignSystem.Animations.standardDuration,
        damping: CGFloat = DesignSystem.Animations.springDamping,
        velocity: CGFloat = DesignSystem.Animations.initialSpringVelocity
    ) -> some View {
        animation(
            .spring(
                response: duration,
                dampingFraction: damping,
                blendDuration: velocity
            )
        )
    }
    
    func withEaseInOut(duration: Double = DesignSystem.Animations.standardDuration) -> some View {
        animation(.easeInOut(duration: duration))
    }
}
