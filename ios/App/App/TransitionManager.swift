import UIKit

class TransitionManager: NSObject, UIViewControllerAnimatedTransitioning {
    private let isPresenting: Bool
    private let duration: TimeInterval
    
    init(isPresenting: Bool, duration: TimeInterval = DesignSystem.Animations.standardDuration) {
        self.isPresenting = isPresenting
        self.duration = duration
        super.init()
    }
    
    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return duration
    }
    
    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        guard let fromView = transitionContext.view(forKey: .from),
              let toView = transitionContext.view(forKey: .to) else {
            transitionContext.completeTransition(false)
            return
        }
        
        let container = transitionContext.containerView
        let finalFrame = transitionContext.finalFrame(for: transitionContext.viewController(forKey: .to)!)
        
        if isPresenting {
            container.addSubview(toView)
            toView.frame = finalFrame
            toView.transform = CGAffineTransform(translationX: 0, y: container.bounds.height)
            toView.alpha = 0
            
            UIView.animate(
                withDuration: duration,
                delay: 0,
                usingSpringWithDamping: DesignSystem.Animations.springDamping,
                initialSpringVelocity: DesignSystem.Animations.initialSpringVelocity,
                options: .curveEaseInOut,
                animations: {
                    toView.transform = .identity
                    toView.alpha = 1
                    fromView.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
                    fromView.alpha = 0.5
                }
            ) { finished in
                fromView.transform = .identity
                transitionContext.completeTransition(finished)
            }
        } else {
            UIView.animate(
                withDuration: duration,
                delay: 0,
                usingSpringWithDamping: DesignSystem.Animations.springDamping,
                initialSpringVelocity: DesignSystem.Animations.initialSpringVelocity,
                options: .curveEaseInOut,
                animations: {
                    toView.transform = .identity
                    toView.alpha = 1
                    fromView.transform = CGAffineTransform(translationX: 0, y: container.bounds.height)
                    fromView.alpha = 0
                }
            ) { finished in
                if finished {
                    fromView.removeFromSuperview()
                }
                transitionContext.completeTransition(finished)
            }
        }
    }
}

// MARK: - UIViewControllerTransitioningDelegate
extension TransitionManager: UIViewControllerTransitioningDelegate {
    func animationController(forPresented presented: UIViewController, presenting: UIViewController, source: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        return TransitionManager(isPresenting: true)
    }
    
    func animationController(forDismissed dismissed: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        return TransitionManager(isPresenting: false)
    }
}

// MARK: - Helper Extensions
extension UIViewController {
    func presentWithCustomTransition(_ viewControllerToPresent: UIViewController, animated: Bool = true, completion: (() -> Void)? = nil) {
        let transitionManager = TransitionManager(isPresenting: true)
        viewControllerToPresent.modalPresentationStyle = .fullScreen
        viewControllerToPresent.transitioningDelegate = transitionManager
        present(viewControllerToPresent, animated: animated, completion: completion)
    }
}
