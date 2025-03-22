import UIKit
import SwiftUI

class AnimatedCardView: UIView {
    // MARK: - Properties
    private let title: String
    private let subtitle: String
    private let image: UIImage?
    
    private lazy var containerView: UIView = {
        let view = UIView()
        view.backgroundColor = DesignSystem.Colors.background
        view.layer.cornerRadius = DesignSystem.Layout.cornerRadius
        view.addShadow()
        return view
    }()
    
    private lazy var stackView: UIStackView = {
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = DesignSystem.Layout.standardSpacing
        stack.alignment = .center
        stack.distribution = .fill
        return stack
    }()
    
    private lazy var imageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFit
        imageView.clipsToBounds = true
        return imageView
    }()
    
    private lazy var titleLabel: UILabel = {
        let label = UILabel()
        label.font = DesignSystem.Typography.titleFont
        label.textColor = DesignSystem.Colors.text
        label.textAlignment = .center
        label.numberOfLines = 0
        return label
    }()
    
    private lazy var subtitleLabel: UILabel = {
        let label = UILabel()
        label.font = DesignSystem.Typography.bodyFont
        label.textColor = DesignSystem.Colors.text.withAlphaComponent(0.8)
        label.textAlignment = .center
        label.numberOfLines = 0
        return label
    }()
    
    // MARK: - Initialization
    init(title: String, subtitle: String, image: UIImage? = nil) {
        self.title = title
        self.subtitle = subtitle
        self.image = image
        super.init(frame: .zero)
        setupViews()
    }
    
    required init?(coder: NSCoder) {
        self.title = ""
        self.subtitle = ""
        self.image = nil
        super.init(coder: coder)
        setupViews()
    }
    
    // MARK: - Setup
    private func setupViews() {
        addSubview(containerView)
        containerView.addSubview(stackView)
        
        if let image = image {
            imageView.image = image
            stackView.addArrangedSubview(imageView)
        }
        
        titleLabel.text = title
        subtitleLabel.text = subtitle
        
        stackView.addArrangedSubview(titleLabel)
        stackView.addArrangedSubview(subtitleLabel)
        
        setupConstraints()
        setupAnimations()
    }
    
    private func setupConstraints() {
        containerView.translatesAutoresizingMaskIntoConstraints = false
        stackView.translatesAutoresizingMaskIntoConstraints = false
        imageView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            containerView.topAnchor.constraint(equalTo: topAnchor),
            containerView.leadingAnchor.constraint(equalTo: leadingAnchor),
            containerView.trailingAnchor.constraint(equalTo: trailingAnchor),
            containerView.bottomAnchor.constraint(equalTo: bottomAnchor),
            
            stackView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: DesignSystem.Layout.standardSpacing),
            stackView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: DesignSystem.Layout.standardSpacing),
            stackView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -DesignSystem.Layout.standardSpacing),
            stackView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -DesignSystem.Layout.standardSpacing),
            
            imageView.heightAnchor.constraint(equalToConstant: 120),
            imageView.widthAnchor.constraint(equalToConstant: 120)
        ])
    }
    
    private func setupAnimations() {
        // Initial state
        alpha = 0
        transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
        
        // Animate in
        UIView.animate(
            withDuration: DesignSystem.Animations.standardDuration,
            delay: 0,
            usingSpringWithDamping: DesignSystem.Animations.springDamping,
            initialSpringVelocity: DesignSystem.Animations.initialSpringVelocity,
            options: .curveEaseOut,
            animations: {
                self.alpha = 1
                self.transform = .identity
            }
        )
    }
    
    // MARK: - Public Methods
    func updateContent(title: String? = nil, subtitle: String? = nil, image: UIImage? = nil) {
        if let title = title {
            titleLabel.text = title
        }
        
        if let subtitle = subtitle {
            subtitleLabel.text = subtitle
        }
        
        if let image = image {
            imageView.image = image
            if imageView.superview == nil {
                stackView.insertArrangedSubview(imageView, at: 0)
            }
        }
    }
}

// MARK: - SwiftUI Preview
struct AnimatedCardView_Preview: PreviewProvider {
    static var previews: some View {
        VStack {
            AnimatedCardViewRepresentable(
                title: "Welcome",
                subtitle: "Let's get started with your journey",
                image: UIImage(systemName: "heart.fill")
            )
            .frame(height: 200)
            .padding()
        }
        .previewLayout(.sizeThatFits)
    }
}
